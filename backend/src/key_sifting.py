"""Key sifting stage for BB84 Quantum Key Distribution."""

from dataclasses import dataclass
from typing import List, Tuple
from src.bb84 import Basis, QubitRecord


@dataclass
class SiftingResult:
    """Results of the public basis comparison and sifting process."""
    total_qubits: int
    matching_indices: List[int]
    discarded_indices: List[int]
    alice_sifted_bits: List[int]
    bob_sifted_bits: List[int]

    @property
    def matching_bases_count(self) -> int:
        return len(self.matching_indices)

    @property
    def discarded_count(self) -> int:
        return len(self.discarded_indices)

    @property
    def sifted_key_length(self) -> int:
        return len(self.alice_sifted_bits)


def sift_keys(records: List[QubitRecord]) -> SiftingResult:
    """Perform public basis reconciliation (sifting).

    Alice and Bob publicly compare their bases for each transmitted qubit.
    If the bases match, they retain the bit for the sifted key.
    If the bases differ, they discard the bit.

    Note:
    Crucially, only the basis choices (+ or x) are exchanged over the public
    classical channel, NEVER the actual bit values!
    """
    total = len(records)
    matching_indices: List[int] = []
    discarded_indices: List[int] = []
    alice_sifted: List[int] = []
    bob_sifted: List[int] = []

    for i, rec in enumerate(records):
        if rec.alice_basis == rec.bob_basis:
            rec.basis_matched = True
            matching_indices.append(i)
            alice_sifted.append(rec.alice_bit)
            bob_sifted.append(rec.bob_measured_bit)
        else:
            rec.basis_matched = False
            discarded_indices.append(i)

    return SiftingResult(
        total_qubits=total,
        matching_indices=matching_indices,
        discarded_indices=discarded_indices,
        alice_sifted_bits=alice_sifted,
        bob_sifted_bits=bob_sifted,
    )
