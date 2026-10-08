"""BB84 Simulation Pipeline and Orchestrator."""

from dataclasses import dataclass, field
from typing import List, Optional
import random

from src.bb84 import Basis, QubitRecord, SimulationConfig, State, encode_bit, measure_state
from src.quantum_channel import QuantumChannel
from src.eavesdropper import Eavesdropper
from src.key_sifting import SiftingResult, sift_keys
from src.security import SecurityAnalysisResult, analyze_security


@dataclass
class FullSimulationResult:
    """Consolidated results of a complete BB84 protocol run."""
    config: SimulationConfig
    records: List[QubitRecord]
    sifting: SiftingResult
    security: SecurityAnalysisResult

    @property
    def alice_raw_bits(self) -> List[int]:
        return [r.alice_bit for r in self.records]

    @property
    def alice_raw_bases(self) -> List[Basis]:
        return [r.alice_basis for r in self.records]

    @property
    def alice_states(self) -> List[State]:
        return [r.alice_state for r in self.records]

    @property
    def bob_raw_bases(self) -> List[Basis]:
        return [r.bob_basis for r in self.records]

    @property
    def bob_measured_bits(self) -> List[int]:
        return [r.bob_measured_bit for r in self.records]


class BB84Simulator:
    """Orchestrates the end-to-end BB84 Quantum Key Distribution simulation."""

    def __init__(self, config: Optional[SimulationConfig] = None) -> None:
        self.config = config or SimulationConfig()
        self.rng = random.Random(self.config.random_seed) if self.config.random_seed is not None else random.Random()
        self.channel = QuantumChannel(noise_rate=self.config.noise_rate, rng=self.rng)
        self.eve = Eavesdropper(rng=self.rng)

    def set_config(self, config: SimulationConfig) -> None:
        """Update simulation parameters."""
        self.config = config
        self.rng = random.Random(config.random_seed) if config.random_seed is not None else random.Random()
        self.channel = QuantumChannel(noise_rate=config.noise_rate, rng=self.rng)
        self.eve = Eavesdropper(rng=self.rng)

    def run(self) -> FullSimulationResult:
        """Execute the entire BB84 protocol from qubit generation to final key verification."""
        num = self.config.num_qubits
        records: List[QubitRecord] = []

        # =========================================================================
        # Step 1: Alice generates classical bits and prepares quantum states
        # =========================================================================
        for i in range(num):
            alice_bit = self.rng.choice([0, 1])
            alice_basis = self.rng.choice([Basis.RECTILINEAR, Basis.DIAGONAL])
            alice_state = encode_bit(alice_bit, alice_basis)

            records.append(
                QubitRecord(
                    index=i + 1,
                    alice_bit=alice_bit,
                    alice_basis=alice_basis,
                    alice_state=alice_state,
                    eve_present=self.config.eve_enabled,
                )
            )

        # =========================================================================
        # Step 2: Transmission over Quantum Channel (with optional Eve intercept)
        # =========================================================================
        for rec in records:
            current_state = rec.alice_state

            # If Eve is active, she intercepts and resends
            if self.config.eve_enabled:
                eve_basis, eve_bit, resent_state = self.eve.intercept_and_resend(current_state)
                rec.eve_basis = eve_basis
                rec.eve_measured_bit = eve_bit
                rec.eve_resent_state = resent_state
                current_state = resent_state

            # Environmental noise perturbation in quantum channel
            transmitted_state, noise_applied = self.channel.transmit(current_state, rec.alice_basis)
            rec.channel_noise_applied = noise_applied

            # =========================================================================
            # Step 3: Bob chooses a random measurement basis and measures incoming qubit
            # =========================================================================
            bob_basis = self.rng.choice([Basis.RECTILINEAR, Basis.DIAGONAL])
            bob_bit, bob_state = measure_state(transmitted_state, bob_basis, self.rng)

            rec.bob_basis = bob_basis
            rec.bob_measured_bit = bob_bit
            rec.bob_collapsed_state = bob_state

        # =========================================================================
        # Step 4: Basis Reconciliation (Sifting)
        # =========================================================================
        sifting_result = sift_keys(records)

        # =========================================================================
        # Step 5: Security Analysis (Parameter Estimation / QBER Calculation)
        # =========================================================================
        security_result = analyze_security(
            sifting=sifting_result,
            records=records,
            threshold_percentage=self.config.qber_threshold,
            sample_ratio=self.config.test_sample_ratio,
            rng=self.rng,
        )

        return FullSimulationResult(
            config=self.config,
            records=records,
            sifting=sifting_result,
            security=security_result,
        )
