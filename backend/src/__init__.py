"""BB84 Quantum Key Distribution Simulator Package."""

from src.bb84 import Basis, State, QubitRecord, SimulationConfig, encode_bit, measure_state
from src.quantum_channel import QuantumChannel
from src.eavesdropper import Eavesdropper
from src.key_sifting import SiftingResult, sift_keys
from src.security import SecurityAnalysisResult, analyze_security
from src.simulator import BB84Simulator, FullSimulationResult

__all__ = [
    "Basis",
    "State",
    "QubitRecord",
    "SimulationConfig",
    "encode_bit",
    "measure_state",
    "QuantumChannel",
    "Eavesdropper",
    "SiftingResult",
    "sift_keys",
    "SecurityAnalysisResult",
    "analyze_security",
    "BB84Simulator",
    "FullSimulationResult",
]
