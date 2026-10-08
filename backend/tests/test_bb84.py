"""Unit tests for BB84 QKD Simulator components and protocols."""

import unittest
import random
from src.bb84 import Basis, State, QubitRecord, SimulationConfig, encode_bit, measure_state
from src.quantum_channel import QuantumChannel
from src.eavesdropper import Eavesdropper
from src.key_sifting import sift_keys
from src.security import analyze_security
from src.simulator import BB84Simulator


class TestBB84Protocol(unittest.TestCase):
    """Test suite covering quantum state encoding, measurements, sifting, eavesdropping, and security."""

    def setUp(self) -> None:
        self.rng = random.Random(42)

    def test_state_encoding(self) -> None:
        """Test encoding of classical bits into quantum states according to BB84 bases."""
        # Rectilinear (+) basis
        self.assertEqual(encode_bit(0, Basis.RECTILINEAR), State.ZERO)
        self.assertEqual(encode_bit(1, Basis.RECTILINEAR), State.ONE)

        # Diagonal (x) basis
        self.assertEqual(encode_bit(0, Basis.DIAGONAL), State.PLUS)
        self.assertEqual(encode_bit(1, Basis.DIAGONAL), State.MINUS)

    def test_deterministic_measurement_matching_bases(self) -> None:
        """When measurement basis matches preparation basis, measurement must be 100% deterministic."""
        for _ in range(100):
            # |0> measured in +
            bit, st = measure_state(State.ZERO, Basis.RECTILINEAR)
            self.assertEqual(bit, 0)
            self.assertEqual(st, State.ZERO)

            # |1> measured in +
            bit, st = measure_state(State.ONE, Basis.RECTILINEAR)
            self.assertEqual(bit, 1)
            self.assertEqual(st, State.ONE)

            # |+> measured in x
            bit, st = measure_state(State.PLUS, Basis.DIAGONAL)
            self.assertEqual(bit, 0)
            self.assertEqual(st, State.PLUS)

            # |-> measured in x
            bit, st = measure_state(State.MINUS, Basis.DIAGONAL)
            self.assertEqual(bit, 1)
            self.assertEqual(st, State.MINUS)

    def test_probabilistic_measurement_conjugate_bases(self) -> None:
        """When measurement basis is conjugate/incompatible, measurement must yield 50/50 outcomes."""
        samples = 1000
        zero_in_diag_bits = [measure_state(State.ZERO, Basis.DIAGONAL)[0] for _ in range(samples)]
        plus_in_rect_bits = [measure_state(State.PLUS, Basis.RECTILINEAR)[0] for _ in range(samples)]

        # Fraction of 1s should be approximately 0.5 within statistical margin
        ratio1 = sum(zero_in_diag_bits) / samples
        ratio2 = sum(plus_in_rect_bits) / samples

        self.assertAlmostEqual(ratio1, 0.5, delta=0.08)
        self.assertAlmostEqual(ratio2, 0.5, delta=0.08)

    def test_basis_sifting(self) -> None:
        """Test that key sifting keeps matching bases and discards non-matching ones."""
        records = [
            QubitRecord(index=1, alice_bit=0, alice_basis=Basis.RECTILINEAR, alice_state=State.ZERO, bob_basis=Basis.RECTILINEAR, bob_measured_bit=0),
            QubitRecord(index=2, alice_bit=1, alice_basis=Basis.DIAGONAL, alice_state=State.MINUS, bob_basis=Basis.RECTILINEAR, bob_measured_bit=0),
            QubitRecord(index=3, alice_bit=1, alice_basis=Basis.DIAGONAL, alice_state=State.MINUS, bob_basis=Basis.DIAGONAL, bob_measured_bit=1),
            QubitRecord(index=4, alice_bit=0, alice_basis=Basis.RECTILINEAR, alice_state=State.ZERO, bob_basis=Basis.DIAGONAL, bob_measured_bit=1),
        ]

        sifting = sift_keys(records)
        self.assertEqual(sifting.total_qubits, 4)
        self.assertEqual(sifting.matching_indices, [0, 2])
        self.assertEqual(sifting.discarded_indices, [1, 3])
        self.assertEqual(sifting.alice_sifted_bits, [0, 1])
        self.assertEqual(sifting.bob_sifted_bits, [0, 1])
        self.assertEqual(sifting.sifted_key_length, 2)

    def test_perfect_key_agreement_without_eve_or_noise(self) -> None:
        """When Eve is OFF and Noise is 0%, Alice and Bob must have identical sifted keys and QBER == 0%."""
        config = SimulationConfig(num_qubits=100, eve_enabled=False, noise_rate=0.0, random_seed=123)
        simulator = BB84Simulator(config)
        result = simulator.run()

        self.assertEqual(result.security.num_errors, 0)
        self.assertEqual(result.security.qber_percentage, 0.0)
        self.assertTrue(result.security.is_secure)
        self.assertEqual(result.security.alice_final_key, result.security.bob_final_key)
        self.assertGreater(len(result.security.alice_final_key), 0)

    def test_eve_intercept_and_resend_introduces_errors(self) -> None:
        """When Eve is ON, intercept-and-resend attack introduces ~25% error rate on sifted keys."""
        config = SimulationConfig(num_qubits=1000, eve_enabled=True, noise_rate=0.0, test_sample_ratio=0.8, random_seed=999)
        simulator = BB84Simulator(config)
        result = simulator.run()

        # Theoretical error rate on matching bases is around 25% (0.5 * 0.5)
        # Should easily exceed default 11% threshold
        self.assertGreater(result.security.qber_percentage, 15.0)
        self.assertFalse(result.security.is_secure)
        self.assertIn("HIGH QBER", result.security.status_message)
        self.assertEqual(result.security.alice_final_key, [])
        self.assertEqual(result.security.bob_final_key, [])

    def test_channel_noise_effect(self) -> None:
        """Channel noise should independently induce errors even without Eve."""
        config = SimulationConfig(num_qubits=500, eve_enabled=False, noise_rate=0.20, test_sample_ratio=0.5, random_seed=777)
        simulator = BB84Simulator(config)
        result = simulator.run()

        self.assertGreater(result.security.num_errors, 0)
        self.assertGreater(result.security.qber_percentage, 0.0)

    def test_security_analysis_threshold(self) -> None:
        """Test threshold logic for QBER acceptance/rejection."""
        records = [
            QubitRecord(index=1, alice_bit=0, alice_basis=Basis.RECTILINEAR, alice_state=State.ZERO, bob_basis=Basis.RECTILINEAR, bob_measured_bit=0),
            QubitRecord(index=2, alice_bit=1, alice_basis=Basis.RECTILINEAR, alice_state=State.ONE, bob_basis=Basis.RECTILINEAR, bob_measured_bit=1),
            QubitRecord(index=3, alice_bit=0, alice_basis=Basis.RECTILINEAR, alice_state=State.ZERO, bob_basis=Basis.RECTILINEAR, bob_measured_bit=1), # error
            QubitRecord(index=4, alice_bit=1, alice_basis=Basis.RECTILINEAR, alice_state=State.ONE, bob_basis=Basis.RECTILINEAR, bob_measured_bit=1),
        ]
        sifting = sift_keys(records)

        # Force sample ratio to test all 4 bits
        sec_result = analyze_security(sifting, records, threshold_percentage=11.0, sample_ratio=1.0, rng=random.Random(1))
        # 1 error out of 3 test bits = 33.33% > 11% -> Rejection
        self.assertFalse(sec_result.is_secure)
        self.assertGreater(sec_result.qber_percentage, 11.0)


if __name__ == "__main__":
    unittest.main()
