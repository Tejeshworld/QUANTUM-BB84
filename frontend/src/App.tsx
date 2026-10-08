import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ControlPanel } from './components/ControlPanel';
import { QuantumFlowDiagram } from './components/QuantumFlowDiagram';
import { AlicePanel } from './components/AlicePanel';
import { EvePanel } from './components/EvePanel';
import { BobPanel } from './components/BobPanel';
import { BasisSifting } from './components/BasisSifting';
import { QBERAnalysis } from './components/QBERAnalysis';
import { SecretKey } from './components/SecretKey';
import { ResultsDashboard } from './components/ResultsDashboard';
import { SimulationTable } from './components/SimulationTable';
import { QBERChart } from './components/QBERChart';
import { SimulationLog } from './components/SimulationLog';
import { HowBB84Works } from './components/HowBB84Works';
import { SecuritySection } from './components/SecuritySection';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { QuantumBackground } from './components/QuantumBackground';

import { SimulationConfig, SimulationResult, HistoryRun, LogEntry } from './types/bb84';
import { executeSimulationPipeline } from './lib/api';

export const App: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>({
    numQubits: 20,
    eveEnabled: false,
    noiseEnabled: false,
    noiseProbability: 0.0,
    qberThreshold: 11.0,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeQubitIndex, setActiveQubitIndex] = useState<number>(0);
  const [history, setHistory] = useState<HistoryRun[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Initial simulation on mount
  useEffect(() => {
    executeSimulation(false);
  }, []);

  // IntersectionObserver for smooth scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [result]);

  const executeSimulation = async (animate: boolean = true) => {
    if (isRunning) return;

    if (animate) {
      setIsRunning(true);
      setActiveQubitIndex(0);

      const total = config.numQubits;
      let current = 0;
      const intervalMs = Math.max(25, Math.min(80, Math.floor(1200 / total)));

      const timer = setInterval(async () => {
        current++;
        setActiveQubitIndex(current);

        if (current >= total) {
          clearInterval(timer);
          const { result: simRes, logs: simLogs } = await executeSimulationPipeline(config);
          setResult(simRes);
          setLogs((prev) => [...simLogs, ...prev].slice(0, 100));

          // Append to history
          setHistory((prev) => [
            ...prev,
            {
              runId: prev.length + 1,
              timestamp: new Date().toLocaleTimeString(),
              qubits: config.numQubits,
              eveEnabled: config.eveEnabled,
              noise: config.noiseProbability,
              qber: simRes.qber,
              isSecure: simRes.isSecure,
            },
          ]);

          setIsRunning(false);
        }
      }, intervalMs);
    } else {
      const { result: simRes, logs: simLogs } = await executeSimulationPipeline(config);
      setResult(simRes);
      setLogs((prev) => [...simLogs, ...prev].slice(0, 100));

      setHistory((prev) => [
        ...prev,
        {
          runId: prev.length + 1,
          timestamp: new Date().toLocaleTimeString(),
          qubits: config.numQubits,
          eveEnabled: config.eveEnabled,
          noise: config.noiseProbability,
          qber: simRes.qber,
          isSecure: simRes.isSecure,
        },
      ]);
    }
  };

  const handleGenerateOnly = () => {
    executeSimulation(true);
  };

  const handleReset = async () => {
    const resetConfig: SimulationConfig = {
      numQubits: 20,
      eveEnabled: false,
      noiseEnabled: false,
      noiseProbability: 0.0,
      qberThreshold: 11.0,
    };
    setConfig(resetConfig);
    setHistory([]);
    setLogs([
      {
        id: `log-reset-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: 'info',
        message: 'Simulation reset to factory defaults. Quantum channel ready.',
      },
    ]);
    const { result: simRes } = await executeSimulationPipeline(resetConfig);
    setResult(simRes);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100 selection:bg-cyan-500 selection:text-black relative">
      
      {/* 1. Quantum Top Scroll Progress Tracker */}
      <ScrollProgress />

      {/* 2. Quantum Glass Laboratory Fixed Background Environment */}
      <QuantumBackground eveActive={config.eveEnabled} />

      {/* 3. Navigation Header */}
      <Header isRunning={isRunning} onNavigate={scrollToSection} />

      {/* 4. Main Foreground Dashboard Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 lg:px-8 py-6 w-full relative z-10">
        
        {/* Hero Section */}
        <div className="reveal-on-scroll">
          <Hero
            onStartSimulation={() => scrollToSection('controls')}
            onLearnMore={() => scrollToSection('how-it-works')}
          />
        </div>

        {/* Real-time KPI Dashboard Cards */}
        <div className="reveal-on-scroll">
          <ResultsDashboard result={result} />
        </div>

        {/* Simulation Control Panel */}
        <div id="simulator" className="reveal-on-scroll">
          <ControlPanel
            config={config}
            onChangeConfig={setConfig}
            onRunSimulation={() => executeSimulation(true)}
            onGenerateOnly={handleGenerateOnly}
            onReset={handleReset}
            isRunning={isRunning}
          />
        </div>

        {/* Visual Quantum Flow Diagram */}
        <div className="reveal-on-scroll">
          <QuantumFlowDiagram
            config={config}
            isRunning={isRunning}
            activeQubitIndex={activeQubitIndex}
          />
        </div>

        {/* 3-Party Panels: Alice, Eve, Bob */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 reveal-on-scroll">
          <AlicePanel records={result?.records || []} />
          <EvePanel eveEnabled={config.eveEnabled} records={result?.records || []} />
          <BobPanel records={result?.records || []} />
        </div>

        {/* Basis Sifting Section */}
        <div className="reveal-on-scroll">
          <BasisSifting result={result} />
        </div>

        {/* QBER Analysis Section */}
        <div className="reveal-on-scroll">
          <QBERAnalysis result={result} />
        </div>

        {/* Final Secret Key Agreement */}
        <div className="reveal-on-scroll">
          <SecretKey result={result} />
        </div>

        {/* Historical QBER Chart */}
        <div className="reveal-on-scroll">
          <QBERChart history={history} threshold={config.qberThreshold} />
        </div>

        {/* Comprehensive Qubit Table */}
        <div className="reveal-on-scroll">
          <SimulationTable
            records={result?.records || []}
            eveEnabled={config.eveEnabled}
          />
        </div>

        {/* Live Simulation Console Log */}
        <div className="reveal-on-scroll">
          <SimulationLog logs={logs} onClearLogs={() => setLogs([])} />
        </div>

        {/* Educational 8-Step Guide */}
        <div className="reveal-on-scroll">
          <HowBB84Works />
        </div>

        {/* Physics & Security Cryptanalysis */}
        <div className="reveal-on-scroll">
          <SecuritySection />
        </div>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default App;
