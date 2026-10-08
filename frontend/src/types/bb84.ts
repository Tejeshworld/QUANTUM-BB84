export type Basis = '+' | 'x';
export type QuantumState = '|0⟩' | '|1⟩' | '|+⟩' | '|−⟩';

export interface QubitRecord {
  index: number;
  aliceBit: number;
  aliceBasis: Basis;
  aliceState: QuantumState;
  
  // Eve
  evePresent: boolean;
  eveBasis?: Basis;
  eveBit?: number;
  eveResentState?: QuantumState;
  
  // Channel
  noiseApplied: boolean;
  
  // Bob
  bobBasis: Basis;
  bobBit: number;
  bobCollapsedState: QuantumState;
  
  // Protocol status
  basisMatched: boolean;
  isTestBit: boolean;
  isError: boolean;
}

export interface SimulationConfig {
  numQubits: number;
  eveEnabled: boolean;
  noiseEnabled: boolean;
  noiseProbability: number; // 0.0 to 0.20
  qberThreshold: number;   // default 11.0%
}

export interface SimulationResult {
  config: SimulationConfig;
  records: QubitRecord[];
  
  // Sifting
  matchingIndices: number[];
  discardedIndices: number[];
  aliceSiftedKey: number[];
  bobSiftedKey: number[];
  
  // Parameter estimation
  testSampleIndices: number[];
  testedAliceBits: number[];
  testedBobBits: number[];
  errorCount: number;
  qber: number; // percentage
  
  // Final Key
  isSecure: boolean;
  aliceFinalKey: number[];
  bobFinalKey: number[];
  keyAgreement: boolean;
  statusMessage: string;
}

export interface HistoryRun {
  runId: number;
  timestamp: string;
  qubits: number;
  eveEnabled: boolean;
  noise: number;
  qber: number;
  isSecure: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  message: string;
}
