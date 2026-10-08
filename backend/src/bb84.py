"""BB84 Quantum Key Distribution Simulator.

Core data structures and definitions for quantum states and bases.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional, Tuple
import random


class Basis(str, Enum):
    """Measurement and preparation bases for BB84."""
    RECTILINEAR = "+"  # Computational / Rectilinear basis: {|0>, |1>}
    DIAGONAL = "x"     # Diagonal / Hadamard basis: {|+>, |->}

    def __str__(self) -> str:
        return self.value


class State(str, Enum):
    """Symbolic representation of polarized photon / single qubit quantum states."""
    ZERO = "|0>"    # Rectilinear basis bit 0
    ONE = "|1>"     # Rectilinear basis bit 1
    PLUS = "|+>"    # Diagonal basis bit 0: (|0> + |1>) / sqrt(2)
    MINUS = "|->"   # Diagonal basis bit 1: (|0> - |1>) / sqrt(2)

    def __str__(self) -> str:
        return self.value


def encode_bit(bit: int, basis: Basis) -> State:
    """Encode a classical bit into a quantum state according to the given basis.

    Rectilinear (+):
        0 -> |0>
        1 -> |1>
    Diagonal (x):
        0 -> |+>
        1 -> |->
    """
    if basis == Basis.RECTILINEAR:
        return State.ZERO if bit == 0 else State.ONE
    elif basis == Basis.DIAGONAL:
        return State.PLUS if bit == 0 else State.MINUS
    raise ValueError(f"Unknown basis: {basis}")


def measure_state(state: State, measurement_basis: Basis, rng: Optional[random.Random] = None) -> Tuple[int, State]:
    """Measure a quantum state in the specified measurement basis according to quantum mechanics.

    Returns:
        (measured_bit, collapsed_state)

    Quantum Measurement Rules:
    - If measured in the same basis as preparation:
        |0> in + -> bit 0, stays |0>
        |1> in + -> bit 1, stays |1>
        |+> in x -> bit 0, stays |+>
        |-> in x -> bit 1, stays |->
    - If measured in conjugate (complementary) basis:
        |0> or |1> measured in x -> 50% chance bit 0 (collapses to |+>), 50% chance bit 1 (collapses to |->)
        |+> or |-> measured in + -> 50% chance bit 0 (collapses to |0>), 50% chance bit 1 (collapses to |1>)
    """
    r = rng if rng is not None else random

    if measurement_basis == Basis.RECTILINEAR:
        if state == State.ZERO:
            return 0, State.ZERO
        elif state == State.ONE:
            return 1, State.ONE
        elif state in (State.PLUS, State.MINUS):
            # Diagonal state measured in rectilinear basis collapses with 50/50 probability
            bit = r.choice([0, 1])
            collapsed = State.ZERO if bit == 0 else State.ONE
            return bit, collapsed

    elif measurement_basis == Basis.DIAGONAL:
        if state == State.PLUS:
            return 0, State.PLUS
        elif state == State.MINUS:
            return 1, State.MINUS
        elif state in (State.ZERO, State.ONE):
            # Rectilinear state measured in diagonal basis collapses with 50/50 probability
            bit = r.choice([0, 1])
            collapsed = State.PLUS if bit == 0 else State.MINUS
            return bit, collapsed

    raise ValueError(f"Invalid measurement combination: state={state}, basis={measurement_basis}")


@dataclass
class QubitRecord:
    """Complete record of a single transmitted qubit through the BB84 pipeline."""
    index: int
    alice_bit: int
    alice_basis: Basis
    alice_state: State
    eve_present: bool = False
    eve_basis: Optional[Basis] = None
    eve_measured_bit: Optional[int] = None
    eve_resent_state: Optional[State] = None
    bob_basis: Basis = Basis.RECTILINEAR
    bob_measured_bit: int = 0
    bob_collapsed_state: State = State.ZERO
    channel_noise_applied: bool = False
    basis_matched: bool = False
    is_test_bit: bool = False
    is_error: bool = False


@dataclass
class SimulationConfig:
    """Configuration parameters for the BB84 simulation."""
    num_qubits: int = 20
    eve_enabled: bool = False
    noise_rate: float = 0.0          # Probability of channel noise (0.0 to 0.20)
    qber_threshold: float = 11.0      # QBER threshold in percentage (default 11%)
    test_sample_ratio: float = 0.5   # Fraction of sifted bits used for public error checking
    random_seed: Optional[int] = None
