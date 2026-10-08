# BB84 Quantum Key Distribution (QKD) Simulator: Project Report

---

## 1. Title
**Simulation and Security Analysis of the BB84 Quantum Key Distribution Protocol with Eavesdropper Detection and Noise Modeling**

---

## 2. Abstract
Quantum Key Distribution (QKD) provides information-theoretic security based on the fundamental laws of quantum physics rather than unproven computational complexity assumptions. This project presents the design, implementation, and evaluation of a comprehensive educational software simulator for the BB84 QKD protocol. Developed in Python with a Tkinter desktop Graphical User Interface (GUI), the system simulates single-photon quantum state preparation, transmission over noisy optical channels, quantum measurement collapse, public basis reconciliation (sifting), parameter estimation via Quantum Bit Error Rate (QBER), and secret key extraction. An intercept-and-resend eavesdropping attack by an adversary (Eve) is modeled to demonstrate the measurement disturbance principle and the No-Cloning theorem. Experimental simulation results demonstrate key agreement with 0% QBER under noiseless, uncompromised conditions and an average QBER of ~25% when Eve intercepts the channel, successfully triggering key rejection against the 11% security threshold.

---

## 3. Introduction
In contemporary cybersecurity, secure communication fundamentally relies on symmetric cryptography (such as the Advanced Encryption Standard - AES). Symmetric encryption requires sender (Alice) and receiver (Bob) to possess an identical secret cryptographic key. Distributing this secret key securely over public communication networks remains a major challenge.

Traditional public-key cryptography (e.g., RSA, Diffie-Hellman, Elliptic Curve Cryptography) solves key exchange under computational hardness assumptions (e.g., integer factorization and discrete logarithms). However, the development of quantum algorithms—notably Shor's Algorithm—proves that large-scale quantum computers will break these mathematical foundations in polynomial time.

Quantum Key Distribution (QKD), first proposed in 1984 by Charles H. Bennett and Gilles Brassard (BB84), utilizes quantum mechanics to solve the key distribution problem with unconditional, information-theoretic security.

---

## 4. Problem Statement
Public-key cryptographic systems are vulnerable to future quantum cryptanalysis ("Harvest Now, Decrypt Later" threats). While QKD provides a quantum-safe alternative, physical quantum hardware is expensive, fragile, and inaccessible to students and researchers. There is a need for an open-source, intuitive, mathematically accurate desktop simulator that illustrates:
1. How quantum superposition and conjugate measurement bases enable secret key sharing.
2. Why an eavesdropper cannot intercept quantum signals without introducing detectable errors.
3. How public sifting and parameter estimation operate without exposing the final secret key.

---

## 5. Objectives
1. **Model the BB84 Protocol**: Implement state preparation, conjugate basis encoding, quantum transmission, and projective measurement.
2. **Simulate Intercept-and-Resend Attacks**: Model Eve's eavesdropping mechanism and mathematically verify the resulting state disturbance.
3. **Incorporate Environmental Noise**: Model depolarizing/bit-flip noise across the transmission channel.
4. **Implement Basis Sifting & QBER Analysis**: Automate public basis exchange, sample-based parameter estimation, and threshold comparison.
5. **Develop an Interactive Desktop GUI**: Construct a modern dark-themed user interface with real-time KPI metrics, interactive tables, and transmission animations.
6. **Ensure High Code Quality & Modularity**: Adhere to clean software engineering practices with comprehensive automated unit testing.

---

## 6. Existing Approach
Existing approaches to understanding QKD often rely on abstract mathematical textbooks or command-line scripts with hardcoded parameters. Some existing simulation tools either require complex quantum computing frameworks (e.g., Qiskit, Cirq) which introduce heavy dependencies and overhead, or oversimplify the protocol by artificially increasing error counters rather than simulating physical measurement collapse.

---

## 7. Proposed System
The proposed system is a standalone, dependency-free Python application featuring a modular architecture and an interactive Tkinter graphical interface. Key highlights include:
- **True Probabilistic Measurement**: Qubit collapse is computed from quantum mechanical projection rules.
- **Dynamic Intercept-and-Resend Attack**: Errors emerge naturally from Eve's basis mismatches rather than static multipliers.
- **Safe Parameter Estimation**: Publicly tested bits are discarded from the final key, preserving secrecy.
- **Dual Mode (GUI & Headless CLI)**: Supports visual learning as well as automated batch scripting.

---

## 8. BB84 Protocol
The BB84 protocol uses two mutually unbiased conjugate bases in a two-dimensional Hilbert space:

### 1. Rectilinear Basis ($+$)
$$\{|0\rangle, |1\rangle\}$$
- Bit $0 \longrightarrow |0\rangle$ (Horizontal polarization)
- Bit $1 \longrightarrow |1\rangle$ (Vertical polarization)

### 2. Diagonal Basis ($\times$)
$$\{|+\rangle, |-\rangle\}$$
- Bit $0 \longrightarrow |+\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}}$ (Diagonal 45°)
- Bit $1 \longrightarrow |-\rangle = \frac{|0\rangle - |1\rangle}{\sqrt{2}}$ (Anti-diagonal 135°)

When a qubit prepared in basis $\mathcal{B}_A$ is measured in basis $\mathcal{B}_B$:
- If $\mathcal{B}_A = \mathcal{B}_B$: Outcome is deterministic ($P = 1.0$).
- If $\mathcal{B}_A \neq \mathcal{B}_B$: Outcome collapses randomly ($P(0) = 0.5, P(1) = 0.5$).

---

## 9. System Architecture

```
┌────────────────────────────────────────────────────────┐
│                        GUI APP                         │
│   (Tkinter / ttk / Canvas Animation / Treeview Table)  │
└───────────────────────────┬────────────────────────────┘
                            │ Dispatches Config & Receives Results
┌───────────────────────────▼────────────────────────────┐
│                    BB84 SIMULATOR                      │
│            (src/simulator.py Orchestrator)             │
└──────┬────────────────────┬────────────────────┬───────┘
       │                    │                    │
┌──────▼──────┐      ┌──────▼──────┐      ┌──────▼──────┐
│  Alice &    │      │  Quantum    │      │    Eve      │
│  Bob Nodes  │      │   Channel   │      │ Interceptor │
│ (src/bb84)  │      │(src/channel)│      │  (src/eve)  │
└──────┬──────┘      └─────────────┘      └─────────────┘
       │
┌──────▼─────────────────────────────────────────────────┐
│               Public Classical Processing              │
│  - Key Sifting (src/key_sifting.py)                    │
│  - Security Analysis & QBER Check (src/security.py)    │
└────────────────────────────────────────────────────────┘
```

---

## 10. Methodology
1. **State Preparation**: Alice generates $N$ random classical bits $a_i \in \{0, 1\}$ and bases $b_i^A \in \{+, \times\}$. She encodes each into state $|\psi_i\rangle$.
2. **Channel Transmission**: $|\psi_i\rangle$ is transmitted through the quantum channel.
3. **Eavesdropping (Optional)**: If Eve is active, Eve intercepts $|\psi_i\rangle$, measures in basis $b_i^E \in \{+, \times\}$, and resends state $|\psi_i'\rangle$.
4. **Bob Measurement**: Bob measures the arriving state in random basis $b_i^B \in \{+, \times\}$ to obtain bit $b_i$.
5. **Basis Reconciliation**: Alice and Bob communicate over a classical channel and identify indices $I_{\text{sift}} = \{i \mid b_i^A = b_i^B\}$.
6. **Error Estimation**: A random subset $I_{\text{test}} \subset I_{\text{sift}}$ is published and compared to compute the Quantum Bit Error Rate (QBER).
7. **Key Finalization**: $I_{\text{test}}$ is discarded. If $\text{QBER} \leq 11\%$, the remaining bits form the shared secret key.

---

## 11. Algorithm

```python
Algorithm BB84_Protocol(N, EveEnabled, NoiseRate, QBERThreshold):
    Records = []
    For i from 1 to N:
        bit_A = RandomChoice([0, 1])
        basis_A = RandomChoice(['+', 'x'])
        state = Encode(bit_A, basis_A)
        
        If EveEnabled:
            basis_E = RandomChoice(['+', 'x'])
            bit_E, state = Measure(state, basis_E)
            
        If Random() < NoiseRate:
            state = Perturb(state)
            
        basis_B = RandomChoice(['+', 'x'])
        bit_B, _ = Measure(state, basis_B)
        
        Records.append(Record(i, bit_A, basis_A, basis_B, bit_B))
        
    SiftedKey = [r for r in Records if r.basis_A == r.basis_B]
    TestSample = RandomSample(SiftedKey, ratio=0.5)
    Errors = Count(r for r in TestSample if r.bit_A != r.bit_B)
    QBER = (Errors / len(TestSample)) * 100
    
    If QBER <= QBERThreshold:
        FinalKey = [r.bit_A for r in SiftedKey if r not in TestSample]
        Return (ACCEPT, FinalKey, QBER)
    Else:
        Return (REJECT, None, QBER)
```

---

## 12. Implementation
The application is structured into clean modular components:
- `src/bb84.py`: Data classes (`QubitRecord`, `SimulationConfig`), enums (`Basis`, `State`), and quantum state encoding/measurement routines.
- `src/quantum_channel.py`: Channel transmission and environmental noise modeling.
- `src/eavesdropper.py`: Intercept-and-resend attack logic.
- `src/key_sifting.py`: Basis reconciliation algorithms.
- `src/security.py`: QBER estimation and threshold evaluation.
- `src/simulator.py`: End-to-end pipeline execution engine.
- `gui/app.py`: Tkinter-based graphical user interface.
- `main.py`: Entry point supporting both GUI and CLI flags.

---

## 13. GUI Description
The GUI is designed with a sleek slate dark theme:
- **Control Bar**: Inputs for Qubit Count, Eve Toggle button with live state styling, Noise %, QBER Threshold %, and Seed.
- **Optical Channel Canvas**: Visual representation of Alice, the Quantum Channel / Eve interceptor, and Bob, complete with photon pulse animation.
- **KPI Metrics Cards**: Real-time display of Total Qubits, Matched Bases, Discarded Bases, Sifted Key Length, Test Bits, Detected Errors, QBER %, and Final Key Length.
- **Interactive Breakdown Table**: Treeview showing each qubit's journey, color-coded by protocol outcome.
- **Security Status Banner & Key Extraction Box**: Visual indication of protocol success/rejection and a one-click clipboard copy button.
- **Educational Guide Tab**: Built-in reference materials explaining quantum principles, mathematical derivations, and real-world QKD notes.

---

## 14. Eve Attack (Intercept & Resend Analysis)
When Eve intercepts every qubit:
1. Probability of Eve choosing Alice's basis: $P(b_E = b_A) = 0.5$.
   - Outcome: Eve measures the correct bit and resends the original state. Bob experiences no error if $b_B = b_A$.
2. Probability of Eve choosing the wrong basis: $P(b_E \neq b_A) = 0.5$.
   - Outcome: Eve prepares a state in the wrong basis. When Bob measures in $b_B = b_A$, Bob has a $50\%$ probability of obtaining the wrong bit.
3. Total Expected Error Rate on sifted bits:
   $$\text{QBER}_{\text{Eve}} = P(b_E \neq b_A) \times P(\text{Error} \mid b_E \neq b_A) = 0.5 \times 0.5 = 25.0\%$$

---

## 15. QBER (Quantum Bit Error Rate)
The Quantum Bit Error Rate is defined as:
$$\text{QBER} = \frac{\text{Number of Erroneous Test Bits}}{\text{Total Number of Tested Sifted Bits}} \times 100\%$$

In standard BB84 security proofs (e.g., Shor-Preskill), the theoretical asymptotic threshold is approximately **11%**. If the observed QBER is below 11%, information reconciliation and privacy amplification can extract an unconditionally secure secret key. If QBER exceeds 11%, Eve may possess enough mutual information to compromise the key, requiring the protocol to abort.

---

## 16. Results
Simulation experiments demonstrate the following statistical outcomes across different modes:

| Mode | Qubits ($N$) | Eve Active | Channel Noise | Mean Sifted Ratio | Mean QBER | Protocol Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Normal BB84** | 100 | OFF | 0.0% | ~50% | **0.0%** | **ACCEPTED (Secure)** |
| **Eavesdropping** | 100 | ON | 0.0% | ~50% | **~24.8%** | **REJECTED (Aborted)** |
| **Noisy Channel** | 100 | OFF | 5.0% | ~50% | **~5.1%** | **ACCEPTED (Tolerated)** |
| **Noisy + Eve** | 100 | ON | 5.0% | ~50% | **~28.2%** | **REJECTED (Aborted)** |

---

## 17. Advantages
- **Zero Third-Party Dependencies**: Runs directly on any system with Python 3.10+.
- **Mathematically Faithful**: Uses true quantum projection rules rather than synthetic error multipliers.
- **Interactive Visual Learning**: Makes abstract quantum mechanics tangible through color-coded visual feedback and animations.
- **Dual Interface**: Includes both a GUI for interactive exploration and a CLI for automated batch testing.

---

## 18. Limitations
- **Classical Simulation**: Runs on a classical CPU; does not create physical single-photon quantum states.
- **Intercept-and-Resend Only**: Does not currently simulate more advanced quantum attacks (e.g., coherent attacks, photon number splitting on weak coherent pulses).
- **Simplified Post-Processing**: Demonstrates sample parameter estimation rather than multi-round Cascade/LDPC error correction and universal hashing privacy amplification.

---

## 19. Future Scope
1. **Decoy-State Protocol**: Implement decoy states to simulate defenses against Photon Number Splitting (PNS) attacks.
2. **Entanglement-based QKD (E91)**: Extend the architecture to simulate the Ekert 91 protocol using Bell state measurements.
3. **Information Reconciliation Algorithms**: Add step-by-step visualizations of Cascade and Winnow parity-exchange error correction.
4. **Export Capabilities**: Add CSV and JSON export options for simulated datasets.

---

## 20. Conclusion
The developed BB84 Quantum Key Distribution Simulator successfully demonstrates the principles of quantum cryptography, measurement disturbance, and eavesdropper detection. By providing a clean, modular Python codebase, comprehensive automated tests, and a user-friendly desktop GUI, the project serves as an effective educational tool for students, educators, and cybersecurity enthusiasts exploring quantum communication.

---

## 21. References
1. C. H. Bennett and G. Brassard, "Quantum cryptography: Public key distribution and coin tossing," *Proceedings of IEEE International Conference on Computers, Systems and Signal Processing*, Bangalore, India, 1984, pp. 175-179.
2. P. W. Shor and J. Preskill, "Simple proof of security of the BB84 quantum key distribution protocol," *Physical Review Letters*, vol. 85, no. 2, pp. 441-444, 2000.
3. N. Gisin, G. Ribordy, W. Tittel, and H. Zbinden, "Quantum cryptography," *Reviews of Modern Physics*, vol. 74, no. 1, pp. 145-195, 2002.
4. W. K. Wootters and W. H. Zurek, "A single quantum cannot be cloned," *Nature*, vol. 299, pp. 802-803, 1982.
