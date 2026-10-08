export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

import type {
  Basis,
  LogEntry,
  QubitRecord,
  SimulationConfig,
  SimulationResult,
  QuantumState,
} from '../types/bb84';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');

type BackendResponse = {
  config: { num_qubits: number; eve_enabled: boolean; noise_rate: number; qber_threshold: number };
  records: Array<{
    index: number;
    alice_bit: number;
    alice_basis: string;
    alice_state: string;
    eve_present: boolean;
    eve_basis?: string | null;
    eve_bit?: number | null;
    eve_state?: string | null;
    bob_basis: string;
    bob_bit: number;
    bob_state: string;
    noise_applied: boolean;
    basis_matched: boolean;
    is_test_bit: boolean;
    is_error: boolean;
  }>;
  sifting: {
    alice_sifted_key: number[];
    bob_sifted_key: number[];
  };
  security: {
    alice_test_bits: number[];
    bob_test_bits: number[];
    num_errors: number;
    qber_percentage: number;
    is_secure: boolean;
    status_message: string;
    alice_final_key: number[];
    bob_final_key: number[];
  };
};

const basisFor = (value: string): Basis => (value === 'x' ? 'x' : '+');
const stateFor = (value: string): QuantumState => value as QuantumState;

function mapBackendResponse(response: BackendResponse, config: SimulationConfig): SimulationResult {
  const records: QubitRecord[] = response.records.map((record) => ({
    index: record.index,
    aliceBit: record.alice_bit,
    aliceBasis: basisFor(record.alice_basis),
    aliceState: stateFor(record.alice_state),
    evePresent: record.eve_present,
    eveBasis: record.eve_basis ? basisFor(record.eve_basis) : undefined,
    eveBit: record.eve_bit ?? undefined,
    eveResentState: record.eve_state ? stateFor(record.eve_state) : undefined,
    noiseApplied: record.noise_applied,
    bobBasis: basisFor(record.bob_basis),
    bobBit: record.bob_bit,
    bobCollapsedState: stateFor(record.bob_state),
    basisMatched: record.basis_matched,
    isTestBit: record.is_test_bit,
    isError: record.is_error,
  }));

  const matchingIndices = records.filter((record) => record.basisMatched).map((record) => record.index);
  const discardedIndices = records.filter((record) => !record.basisMatched).map((record) => record.index);
  const testSampleIndices = records.filter((record) => record.isTestBit).map((record) => record.index);

  return {
    config,
    records,
    matchingIndices,
    discardedIndices,
    aliceSiftedKey: response.sifting.alice_sifted_key,
    bobSiftedKey: response.sifting.bob_sifted_key,
    testSampleIndices,
    testedAliceBits: response.security.alice_test_bits,
    testedBobBits: response.security.bob_test_bits,
    errorCount: response.security.num_errors,
    qber: response.security.qber_percentage,
    isSecure: response.security.is_secure,
    aliceFinalKey: response.security.alice_final_key,
    bobFinalKey: response.security.bob_final_key,
    keyAgreement: response.security.alice_final_key.join('') === response.security.bob_final_key.join(''),
    statusMessage: response.security.status_message,
  };
}

function fallbackSimulation(config: SimulationConfig): SimulationResult {
  const records: QubitRecord[] = Array.from({ length: config.numQubits }, (_, index) => {
    const aliceBit = Math.random() > 0.5 ? 1 : 0;
    const aliceBasis: Basis = Math.random() > 0.5 ? '+' : 'x';
    const bobBasis: Basis = Math.random() > 0.5 ? '+' : 'x';
    const basisMatched = aliceBasis === bobBasis;
    const eveDisturbs = config.eveEnabled && Math.random() < 0.25;
    const noisy = config.noiseEnabled && Math.random() < config.noiseProbability;
    const isError = basisMatched && (eveDisturbs || noisy);
    const bobBit = isError ? 1 - aliceBit : aliceBit;
    const state: QuantumState = aliceBasis === '+'
      ? (aliceBit ? '|1⟩' : '|0⟩')
      : (aliceBit ? '|−⟩' : '|+⟩');

    return {
      index,
      aliceBit,
      aliceBasis,
      aliceState: state,
      evePresent: config.eveEnabled,
      eveBasis: config.eveEnabled ? (Math.random() > 0.5 ? '+' : 'x') : undefined,
      eveBit: config.eveEnabled ? aliceBit : undefined,
      eveResentState: config.eveEnabled ? state : undefined,
      noiseApplied: noisy,
      bobBasis,
      bobBit,
      bobCollapsedState: state,
      basisMatched,
      isTestBit: basisMatched && index % 2 === 0,
      isError,
    };
  });

  const matching = records.filter((record) => record.basisMatched);
  const tested = matching.filter((record) => record.isTestBit);
  const key = matching.filter((record) => !record.isTestBit);
  const errorCount = tested.filter((record) => record.isError).length;
  const qber = tested.length ? (errorCount / tested.length) * 100 : 0;
  const aliceFinalKey = key.map((record) => record.aliceBit);
  const bobFinalKey = key.map((record) => record.bobBit);

  return {
    config,
    records,
    matchingIndices: matching.map((record) => record.index),
    discardedIndices: records.filter((record) => !record.basisMatched).map((record) => record.index),
    aliceSiftedKey: matching.map((record) => record.aliceBit),
    bobSiftedKey: matching.map((record) => record.bobBit),
    testSampleIndices: tested.map((record) => record.index),
    testedAliceBits: tested.map((record) => record.aliceBit),
    testedBobBits: tested.map((record) => record.bobBit),
    errorCount,
    qber,
    isSecure: qber <= config.qberThreshold,
    aliceFinalKey,
    bobFinalKey,
    keyAgreement: aliceFinalKey.join('') === bobFinalKey.join(''),
    statusMessage: qber <= config.qberThreshold ? 'Secure key established.' : 'Channel compromised: QBER exceeds threshold.',
  };
}

export async function executeSimulationPipeline(config: SimulationConfig): Promise<{ result: SimulationResult; logs: LogEntry[] }> {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          num_qubits: config.numQubits,
          eve_enabled: config.eveEnabled,
          noise_rate: config.noiseEnabled ? config.noiseProbability : 0,
          qber_threshold: config.qberThreshold,
        }),
      });
      if (response.ok) {
        const result = mapBackendResponse(await response.json() as BackendResponse, config);
        return { result, logs: [{ id: `log-${Date.now()}`, timestamp: new Date().toLocaleTimeString(), type: 'success', message: 'Simulation completed by the BB84 backend.' }] };
      }
    } catch {
      // Keep the simulator usable when the optional backend is unavailable.
    }
  }

  const result = fallbackSimulation(config);
  return { result, logs: [{ id: `log-${Date.now()}`, timestamp: new Date().toLocaleTimeString(), type: 'info', message: API_BASE_URL ? 'Backend unavailable; completed a local simulation.' : 'Completed a local simulation.' }] };
}
