# BB84 Quantum Key Distribution (QKD) Simulator

A modern, responsive, cyber-futuristic web application and FastAPI backend simulating the **BB84 Quantum Key Distribution** protocol, quantum measurement collapse, public basis sifting, parameter estimation (QBER), and eavesdropper (Eve) detection.

---

## 🏗️ Project Architecture

```
bb84_qkd_simulator/
│
├── frontend/                    # React 18 + TypeScript + Tailwind CSS UI
│   ├── src/
│   │   ├── components/          # 14 Quantum Glass UI Components
│   │   ├── lib/
│   │   │   ├── api.ts           # FastAPI client with graceful client fallback
│   │   │   └── bb84.ts          # Client simulation engine
│   │   ├── types/               # TypeScript interfaces
│   │   ├── App.tsx              # Master Application Orchestrator
│   │   ├── main.tsx             # React DOM entry
│   │   └── index.css            # Quantum Glass CSS styling & glows
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                     # Python 3 + FastAPI Simulation Server
│   ├── src/                     # Core Quantum Simulation Engine
│   │   ├── bb84.py              # Quantum states & bases
│   │   ├── quantum_channel.py   # Optical channel & noise modeling
│   │   ├── eavesdropper.py      # Eve Intercept-and-Resend attack
│   │   ├── key_sifting.py       # Basis reconciliation
│   │   ├── security.py          # QBER estimation & threshold checking
│   │   └── simulator.py         # Simulation orchestrator
│   ├── tests/
│   │   └── test_bb84.py         # Automated unit test suite
│   ├── main.py                  # FastAPI server with CORS & Swagger docs
│   ├── requirements.txt         # Backend dependencies (FastAPI, Uvicorn, Pydantic)
│   └── Procfile                 # Production process file (Railway/Render)
│
├── deployment.md                # Multi-platform deployment guide
├── PROJECT_REPORT.md            # Academic 21-section CS Project Report
└── LICENSE                      # MIT License
```

---

## 🚀 Getting Started

### 1. Start the FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive Swagger API Documentation: `http://localhost:8000/docs`

---

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:3000`

---

### 3. Run Backend Unit Tests
```bash
cd backend
python3 -m unittest discover tests
```

---

## 🔬 Protocol & Quantum Mechanics Summary

| Basis | Bit 0 State | Bit 1 State | Measurement Outcome Rule |
| :--- | :--- | :--- | :--- |
| **Rectilinear ($+$)** | $\|0\rangle$ (Horizontal) | $\|1\rangle$ (Vertical) | In $+$: deterministic. In $\times$: 50/50 random collapse. |
| **Diagonal ($\times$)** | $\|+\rangle = \frac{\|0\rangle + \|1\rangle}{\sqrt{2}}$ | $\|-\rangle = \frac{\|0\rangle - \|1\rangle}{\sqrt{2}}$ | In $\times$: deterministic. In $+$: 50/50 random collapse. |

### Eve Intercept-and-Resend Attack:
1. When Eve intercepts an incoming photon, she randomly chooses a basis ($+$ or $\times$) with 50% probability.
2. If Eve chooses the wrong basis ($P = 0.5$), she collapses the qubit and resends a state in the wrong basis.
3. When Bob measures in Alice's basis, Bob has a 50% chance of measuring the incorrect bit.
4. Theoretical Error Rate on sifted keys:
   $$\text{QBER}_{\text{Eve}} = 0.5 \times 0.5 = 25.0\%$$
5. Because $25\% > 11\%$ (standard threshold), Alice and Bob immediately abort key generation and reject the compromised channel.

---

## 📜 License

This project is open-source and distributed under the [MIT License](LICENSE).
