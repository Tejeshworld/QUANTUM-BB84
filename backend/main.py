"""FastAPI Backend Server for BB84 Quantum Key Distribution (QKD) Simulator."""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uvicorn
import time
import os
import sys

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.bb84 import Basis, State, QubitRecord, SimulationConfig, encode_bit, measure_state
from src.quantum_channel import QuantumChannel
from src.eavesdropper import Eavesdropper
from src.key_sifting import SiftingResult, sift_keys
from src.security import SecurityAnalysisResult, analyze_security
from src.simulator import BB84Simulator, FullSimulationResult

app = FastAPI(
    title="BB84 Quantum Key Distribution (QKD) Simulator API",
    description="High-performance FastAPI backend for simulating quantum state exchange, basis reconciliation, and eavesdropper detection.",
    version="2.0.0",
)

# Enable CORS for frontend web client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory history store
simulation_history: List[Dict[str, Any]] = []


# ==============================================================================
# PYDANTIC SCHEMAS
# ==============================================================================

class SimulationRequest(BaseModel):
    num_qubits: int = Field(default=20, ge=1, le=2000, description="Total number of photons transmitted")
    eve_enabled: bool = Field(default=False, description="Enable Eve Intercept-and-Resend attack")
    noise_rate: float = Field(default=0.0, ge=0.0, le=1.0, description="Channel noise rate (0.0 to 1.0)")
    qber_threshold: float = Field(default=11.0, ge=0.0, le=100.0, description="QBER threshold percentage")
    test_sample_ratio: float = Field(default=0.5, ge=0.05, le=0.95, description="Fraction of sifted bits tested")
    random_seed: Optional[int] = Field(default=None, description="Optional random seed for reproducibility")


class QubitRecordDTO(BaseModel):
    index: int
    alice_bit: int
    alice_basis: str
    alice_state: str
    eve_present: bool
    eve_basis: Optional[str] = None
    eve_bit: Optional[int] = None
    eve_state: Optional[str] = None
    bob_basis: str
    bob_bit: int
    bob_state: str
    noise_applied: bool
    basis_matched: bool
    is_test_bit: bool
    is_error: bool


class SiftingResultDTO(BaseModel):
    total_qubits: int
    matching_bases_count: int
    discarded_count: int
    sifted_key_length: int
    alice_sifted_key: List[int]
    bob_sifted_key: List[int]


class SecurityResultDTO(BaseModel):
    total_sifted_bits: int
    num_test_bits: int
    num_errors: int
    qber_percentage: float
    threshold_percentage: float
    is_secure: bool
    status_message: str
    alice_test_bits: List[int]
    bob_test_bits: List[int]
    alice_final_key: List[int]
    bob_final_key: List[int]
    final_key_length: int


class SimulationResponse(BaseModel):
    success: bool
    config: SimulationRequest
    execution_time_ms: float
    sifting: SiftingResultDTO
    security: SecurityResultDTO
    records: List[QubitRecordDTO]


class StepRequest(BaseModel):
    alice_bit: int = Field(ge=0, le=1)
    alice_basis: str = Field(pattern="^[+x]$")
    eve_enabled: bool = False
    bob_basis: Optional[str] = None
    noise_rate: float = 0.0


# ==============================================================================
# REST API ENDPOINTS
# ==============================================================================

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": "BB84 Quantum Key Distribution FastAPI Backend",
        "version": "2.0.0",
        "docs_url": "/docs",
        "endpoints": ["/api/simulate", "/api/step", "/api/history", "/health"],
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "timestamp": time.time()}


@app.post("/api/simulate", response_model=SimulationResponse, tags=["Simulation"])
def run_bb84_simulation(req: SimulationRequest):
    """Execute complete BB84 protocol simulation pipeline."""
    start_time = time.perf_counter()

    config = SimulationConfig(
        num_qubits=req.num_qubits,
        eve_enabled=req.eve_enabled,
        noise_rate=req.noise_rate,
        qber_threshold=req.qber_threshold,
        test_sample_ratio=req.test_sample_ratio,
        random_seed=req.random_seed,
    )

    simulator = BB84Simulator(config)
    res = simulator.run()
    elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

    records_dto = [
        QubitRecordDTO(
            index=r.index,
            alice_bit=r.alice_bit,
            alice_basis=r.alice_basis.value,
            alice_state=r.alice_state.value,
            eve_present=r.eve_present,
            eve_basis=r.eve_basis.value if r.eve_basis else None,
            eve_bit=r.eve_measured_bit,
            eve_state=r.eve_resent_state.value if r.eve_resent_state else None,
            bob_basis=r.bob_basis.value,
            bob_bit=r.bob_measured_bit,
            bob_state=r.bob_collapsed_state.value,
            noise_applied=r.channel_noise_applied,
            basis_matched=r.basis_matched,
            is_test_bit=r.is_test_bit,
            is_error=r.is_error,
        )
        for r in res.records
    ]

    sifting_dto = SiftingResultDTO(
        total_qubits=res.sifting.total_qubits,
        matching_bases_count=res.sifting.matching_bases_count,
        discarded_count=res.sifting.discarded_count,
        sifted_key_length=res.sifting.sifted_key_length,
        alice_sifted_key=res.sifting.alice_sifted_bits,
        bob_sifted_key=res.sifting.bob_sifted_bits,
    )

    security_dto = SecurityResultDTO(
        total_sifted_bits=res.security.total_sifted_bits,
        num_test_bits=res.security.num_test_bits,
        num_errors=res.security.num_errors,
        qber_percentage=round(res.security.qber_percentage, 2),
        threshold_percentage=res.security.threshold_percentage,
        is_secure=res.security.is_secure,
        status_message=res.security.status_message,
        alice_test_bits=res.security.alice_test_bits,
        bob_test_bits=res.security.bob_test_bits,
        alice_final_key=res.security.alice_final_key,
        bob_final_key=res.security.bob_final_key,
        final_key_length=res.security.final_key_length,
    )

    # Store run history
    run_entry = {
        "run_id": len(simulation_history) + 1,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "num_qubits": req.num_qubits,
        "eve_enabled": req.eve_enabled,
        "noise_rate": req.noise_rate,
        "qber": round(res.security.qber_percentage, 2),
        "is_secure": res.security.is_secure,
        "final_key_length": res.security.final_key_length,
    }
    simulation_history.append(run_entry)

    return SimulationResponse(
        success=True,
        config=req,
        execution_time_ms=elapsed_ms,
        sifting=sifting_dto,
        security=security_dto,
        records=records_dto,
    )


@app.post("/api/step", tags=["Simulation"])
def simulate_single_qubit(req: StepRequest):
    """Simulate transmission of a single individual qubit."""
    alice_b = Basis.RECTILINEAR if req.alice_basis == "+" else Basis.DIAGONAL
    state = encode_bit(req.alice_bit, alice_b)

    eve_basis_val = None
    eve_bit = None
    eve_state_val = None

    current_state = state
    if req.eve_enabled:
        eve = Eavesdropper()
        eve_b, eve_bit, resent_state = eve.intercept_and_resend(current_state)
        eve_basis_val = eve_b.value
        eve_state_val = resent_state.value
        current_state = resent_state

    # Bob measurement
    if req.bob_basis:
        bob_b = Basis.RECTILINEAR if req.bob_basis == "+" else Basis.DIAGONAL
    else:
        bob_b = Basis.RECTILINEAR if time.time_ns() % 2 == 0 else Basis.DIAGONAL

    bob_bit, collapsed = measure_state(current_state, bob_b)
    basis_matched = (alice_b == bob_b)
    is_error = basis_matched and (req.alice_bit != bob_bit)

    return {
        "alice_bit": req.alice_bit,
        "alice_basis": alice_b.value,
        "alice_state": state.value,
        "eve_basis": eve_basis_val,
        "eve_bit": eve_bit,
        "eve_state": eve_state_val,
        "bob_basis": bob_b.value,
        "bob_bit": bob_bit,
        "bob_state": collapsed.value,
        "basis_matched": basis_matched,
        "is_error": is_error,
    }


@app.get("/api/history", tags=["History"])
def get_simulation_history():
    """Retrieve historical simulation runs."""
    return {"total_runs": len(simulation_history), "history": simulation_history}


@app.delete("/api/history", tags=["History"])
def clear_simulation_history():
    """Clear simulation run history."""
    simulation_history.clear()
    return {"success": True, "message": "History cleared."}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
