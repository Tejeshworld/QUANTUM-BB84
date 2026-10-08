"""Security analysis, QBER estimation, and final secret key extraction for BB84."""

from dataclasses import dataclass, field
from typing import List, Optional, Tuple
import random
from src.bb84 import QubitRecord
from src.key_sifting import SiftingResult


@dataclass
class SecurityAnalysisResult:
    """Outcome of quantum bit error rate (QBER) analysis and threshold verification."""
    total_sifted_bits: int
    num_test_bits: int
    num_errors: int
    qber_percentage: float
    threshold_percentage: float
    is_secure: bool
    status_message: str
    sampled_indices_in_sifted: List[int] = field(default_factory=list)
    alice_test_bits: List[int] = field(default_factory=list)
    bob_test_bits: List[int] = field(default_factory=list)
    alice_final_key: List[int] = field(default_factory=list)
    bob_final_key: List[int] = field(default_factory=list)

    @property
    def final_key_length(self) -> int:
        return len(self.alice_final_key) if self.is_secure else 0


def analyze_security(
    sifting: SiftingResult,
    records: List[QubitRecord],
    threshold_percentage: float = 11.0,
    sample_ratio: float = 0.5,
    rng: Optional[random.Random] = None,
) -> SecurityAnalysisResult:
    """Perform public parameter estimation by comparing a random subset of the sifted key.

    Important Cryptographic Principles:
    1. Only a sample subset of sifted bits is revealed publicly to estimate the QBER.
    2. Any bits publicly revealed during test bit comparison MUST BE DISCARDED from the
       final key to prevent Eve from learning those bits.
    3. If QBER <= threshold (typically ~11% in standard BB84 without 1-way post-processing),
       the protocol accepts the remaining bits as a secure raw key.
    4. If QBER > threshold, eavesdropping or unacceptable noise is detected and the key is rejected.
    """
    r = rng if rng is not None else random
    sifted_len = sifting.sifted_key_length

    if sifted_len == 0:
        return SecurityAnalysisResult(
            total_sifted_bits=0,
            num_test_bits=0,
            num_errors=0,
            qber_percentage=0.0,
            threshold_percentage=threshold_percentage,
            is_secure=False,
            status_message="No matching bases found in simulation. Sifted key is empty.",
            alice_final_key=[],
            bob_final_key=[],
        )

    # Determine number of bits to sample for QBER estimation
    # For small keys, sample at least 1 or up to 50%
    if sifted_len == 1:
        num_test = 1
    else:
        num_test = max(1, int(round(sifted_len * sample_ratio)))
        num_test = min(num_test, sifted_len - 1)  # Leave at least 1 bit for final key if possible

    # Sample random indices from the sifted key
    sifted_indices = list(range(sifted_len))
    sampled_indices = sorted(r.sample(sifted_indices, num_test))
    sampled_set = set(sampled_indices)

    alice_test: List[int] = []
    bob_test: List[int] = []
    errors = 0

    alice_final: List[int] = []
    bob_final: List[int] = []

    for idx in range(sifted_len):
        orig_rec_idx = sifting.matching_indices[idx]
        a_bit = sifting.alice_sifted_bits[idx]
        b_bit = sifting.bob_sifted_bits[idx]

        if idx in sampled_set:
            # Mark in original record for UI tracking
            records[orig_rec_idx].is_test_bit = True
            alice_test.append(a_bit)
            bob_test.append(b_bit)
            if a_bit != b_bit:
                errors += 1
                records[orig_rec_idx].is_error = True
        else:
            # Key retention
            alice_final.append(a_bit)
            bob_final.append(b_bit)
            if a_bit != b_bit:
                records[orig_rec_idx].is_error = True

    qber = (errors / num_test * 100.0) if num_test > 0 else 0.0
    is_secure = qber <= threshold_percentage

    if is_secure:
        status_msg = (
            f"✓ LOW QBER ({qber:.1f}% <= {threshold_percentage:.1f}%) — "
            "no significant eavesdropping detected in this simulation."
        )
    else:
        status_msg = (
            f"⚠ HIGH QBER ({qber:.1f}% > {threshold_percentage:.1f}%) — "
            "possible eavesdropping or channel noise detected. KEY REJECTED."
        )

    return SecurityAnalysisResult(
        total_sifted_bits=sifted_len,
        num_test_bits=num_test,
        num_errors=errors,
        qber_percentage=qber,
        threshold_percentage=threshold_percentage,
        is_secure=is_secure,
        status_message=status_msg,
        sampled_indices_in_sifted=sampled_indices,
        alice_test_bits=alice_test,
        bob_test_bits=bob_test,
        alice_final_key=alice_final if is_secure else [],
        bob_final_key=bob_final if is_secure else [],
    )
