
import React, { useState, useEffect, useMemo } from 'react';
import { Settings, RefreshCw, BarChart2, Activity, Info, Layout } from 'lucide-react';
import { SimulationConfig, SimulationStep, Statistics } from './types';
import { generateSimulation } from './utils/math';
import SimulationPlot from './components/SimulationPlot';
import DistributionPlot from './components/DistributionPlot';
import BoxPlot from './components/BoxPlot';
import HeatmapPlot from './components/HeatmapPlot';

const App: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>({
    n_steps: 1500,
    vel_scale: 0.2,
    noise_scale: 0.1,
    dt: 0.1
  });

  const [simulationData, setSimulationData] = useState<{
    history: SimulationStep[];
    stats: Statistics;
  } | null>(null);

  const runSimulation = () => {
    const result = generateSimulation(config);
    setSimulationData(result);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">3-Body Simulator</h1>
        </div>

        <div className="space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-4 text-slate-800">
              <Settings className="w-4 h-4" />
              <h2 className="font-semibold uppercase text-xs tracking-wider">Parâmetros</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="text-slate-600">Tempo (Steps)</label>
                  <span className="font-mono font-medium">{config.n_steps}</span>
                </div>
                <input 
                  type="range" name="n_steps" min="500" max="3000" step="100" 
                  value={config.n_steps} onChange={handleInputChange}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="text-slate-600">Velocidade Inicial</label>
                  <span className="font-mono font-medium">{config.vel_scale.toFixed(2)}</span>
                </div>
                <input 
                  type="range" name="vel_scale" min="0.05" max="1.0" step="0.05" 
                  value={config.vel_scale} onChange={handleInputChange}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="text-slate-600">Oscilação (Ruído)</label>
                  <span className="font-mono font-medium">{config.noise_scale.toFixed(2)}</span>
                </div>
                <input 
                  type="range" name="noise_scale" min="0.01" max="0.5" step="0.01" 
                  value={config.noise_scale} onChange={handleInputChange}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="text-slate-600">dt (Intervalo)</label>
                  <span className="font-mono font-medium">{config.dt.toFixed(2)}</span>
                </div>
                <input 
                  type="range" name="dt" min="0.01" max="0.5" step="0.01" 
                  value={config.dt} onChange={handleInputChange}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </section>

          <button 
            onClick={runSimulation}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
          >
            <RefreshCw className="w-4 h-4" />
            Recalcular Simulação
          </button>

          <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-800">
              <Info className="w-4 h-4 text-indigo-500" />
              <h2 className="font-semibold text-sm">Guia Rápido</h2>
            </div>
            <div className="space-y-3 text-xs text-slate-500 leading-relaxed">
              <p><b>Tempo:</b> Número total de passos.</p>
              <p><b>Velocidade:</b> Controle de impulso inicial.</p>
              <p><b>Ruído:</b> Intensidade das perturbações aleatórias.</p>
              <p><b>dt:</b> Resolução temporal de cada passo.</p>
            </div>
          </section>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {simulationData ? (
          <>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-1">
                  <Layout className="w-4 h-4" />
                  <span>Dashboard Estatístico</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Resultados da Simulação</h2>
              </div>
              <div className="flex gap-4">
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Steps</p>
                  <p className="text-lg font-mono font-bold text-slate-700">{config.n_steps}</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Skewness X</p>
                  <p className="text-lg font-mono font-bold text-indigo-600">{simulationData.stats.skewness.toFixed(3)}</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Kurtosis X</p>
                  <p className="text-lg font-mono font-bold text-indigo-600">{simulationData.stats.kurtosis.toFixed(3)}</p>
                </div>
              </div>
            </header>

            {/* Path Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SimulationPlot history={simulationData.history} stats={simulationData.stats} />
              <HeatmapPlot history={simulationData.history} />
            </div>

            {/* Statistics Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-800">Tabela de Estatísticas Descritivas</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-semibold">
                    <tr>
                      <th className="px-6 py-4">Estatística</th>
                      <th className="px-6 py-4">Eixo X (CG)</th>
                      <th className="px-6 py-4">Eixo Y (CG)</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-6 py-4 font-semibold text-slate-700">Média (Mean)</td>
                      <td className="px-6 py-4 font-mono">{simulationData.stats.meanX.toFixed(4)}</td>
                      <td className="px-6 py-4 font-mono">{simulationData.stats.meanY.toFixed(4)}</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">CENTRAL</span></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold text-slate-700">Mediana (Median)</td>
                      <td className="px-6 py-4 font-mono">{simulationData.stats.medianX.toFixed(4)}</td>
                      <td className="px-6 py-4 font-mono">{simulationData.stats.medianY.toFixed(4)}</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">ROBUSTO</span></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold text-slate-700">Moda (Mode)</td>
                      <td className="px-6 py-4 font-mono">{simulationData.stats.modeX.toFixed(1)}</td>
                      <td className="px-6 py-4 font-mono">{simulationData.stats.modeY.toFixed(1)}</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">FREQUENTE</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
              <DistributionPlot history={simulationData.history} stats={simulationData.stats} />
              <BoxPlot history={simulationData.history} stats={simulationData.stats} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
            <RefreshCw className="w-12 h-12 animate-spin opacity-20" />
            <p className="text-lg">Processando Simulação...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
