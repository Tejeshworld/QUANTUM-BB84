"""Quantum Channel implementation with optional noise modeling for BB84."""

from typing import Optional, Tuple
import random
from src.bb84 import Basis, State, encode_bit


class QuantumChannel:
    """Represents the physical quantum transmission medium (optical fiber, free space).

    Supports simulating environmental depolarization/bit-flip noise.
    """

    def __init__(self, noise_rate: float = 0.0, rng: Optional[random.Random] = None) -> None:
        """Initialize quantum channel.

        Args:
            noise_rate: Probability (0.0 to 1.0) of random perturbation in transit.
            rng: Optional random number generator instance.
        """
        if not (0.0 <= noise_rate <= 1.0):
            raise ValueError(f"Noise rate must be between 0.0 and 1.0, got {noise_rate}")
        self.noise_rate = noise_rate
        self.rng = rng if rng is not None else random

    def transmit(self, state: State, basis: Basis) -> Tuple[State, bool]:
        """Transmit a quantum state through the channel, potentially subject to environmental noise.

        Returns:
            (resulting_state, was_noise_applied)
        """
        if self.noise_rate > 0.0 and self.rng.random() < self.noise_rate:
            # Noise perturbation: random state flip
            # Flip to conjugate or orthogonal state
            if state == State.ZERO:
                return State.ONE, True
            elif state == State.ONE:
                return State.ZERO, True
            elif state == State.PLUS:
                return State.MINUS, True
            elif state == State.MINUS:
                return State.PLUS, True

        return state, False
