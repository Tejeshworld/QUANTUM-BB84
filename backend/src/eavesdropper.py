"""Eavesdropper (Eve) implementation using the Intercept-and-Resend attack."""

from typing import Optional, Tuple
import random
from src.bb84 import Basis, State, encode_bit, measure_state


class Eavesdropper:
    """Simulates an eavesdropper (Eve) performing an Intercept-and-Resend attack.

    Eve intercepts each qubit transmitted by Alice, measures it in a randomly
    chosen basis, and prepares and resends a new qubit to Bob based on her measurement.

    Quantum Mechanical Consequence:
    Because quantum states cannot be cloned (No-Cloning Theorem), Eve cannot duplicate
    the state without measuring it. Measuring an unknown quantum state in a conjugate
    basis irrevocably collapses its wavefunction, introducing detectable disturbances (errors)
    when Bob measures in Alice's original basis (~25% error rate on matching bases).
    """

    def __init__(self, rng: Optional[random.Random] = None) -> None:
        self.rng = rng if rng is not None else random

    def intercept_and_resend(self, incoming_state: State) -> Tuple[Basis, int, State]:
        """Perform intercept and resend on an incoming qubit state.

        Returns:
            Tuple of:
            - eve_basis: Basis chosen by Eve ('+' or 'x')
            - eve_measured_bit: Bit (0 or 1) obtained from measurement
            - resent_state: New quantum state prepared by Eve to forward to Bob
        """
        # 1. Eve chooses a measurement basis at random
        eve_basis = self.rng.choice([Basis.RECTILINEAR, Basis.DIAGONAL])

        # 2. Eve measures the incoming quantum state
        measured_bit, _ = measure_state(incoming_state, eve_basis, self.rng)

        # 3. Eve encodes a new qubit in her chosen basis with the measured bit
        resent_state = encode_bit(measured_bit, eve_basis)

        return eve_basis, measured_bit, resent_state
