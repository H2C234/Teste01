
import React, { useMemo } from 'react';
import { Statistics, SimulationStep } from '../types';

interface Props {
  history: SimulationStep[];
  stats: Statistics;
}

const BoxPlot: React.FC<Props> = ({ history, stats }) => {
  const xValues = useMemo(() => history.map(h => h.mean.x), [history]);
  const min = Math.min(...xValues);
  const max = Math.max(...xValues);

  const scale = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold mb-6 text-slate-800">Boxplot da Posição X (CG)</h3>
      <div className="relative h-24 mt-8 bg-slate-50 rounded-lg flex items-center px-4">
        {/* Whisker Line */}
        <div 
          className="absolute h-0.5 bg-slate-400" 
          style={{ 
            left: `${scale(min)}%`, 
            width: `${scale(max) - scale(min)}%` 
          }} 
        />
        
        {/* Box */}
        <div 
          className="absolute h-12 bg-emerald-100 border-2 border-emerald-500 rounded shadow-sm flex items-center justify-center overflow-hidden" 
          style={{ 
            left: `${scale(stats.q1)}%`, 
            width: `${scale(stats.q3) - scale(stats.q1)}%` 
          }}
        >
          {/* Median Line */}
          <div 
            className="absolute h-full w-1 bg-emerald-700" 
            style={{ 
              left: `${((stats.medianX - stats.q1) / (stats.q3 - stats.q1)) * 100}%` 
            }} 
          />
        </div>

        {/* Min/Max indicators */}
        <div className="absolute h-4 w-0.5 bg-slate-400" style={{ left: `${scale(min)}%` }} />
        <div className="absolute h-4 w-0.5 bg-slate-400" style={{ left: `${scale(max)}%` }} />

        {/* Labels */}
        <div className="absolute top-[-25px] flex flex-col items-center" style={{ left: `${scale(min)}%`, transform: 'translateX(-50%)' }}>
          <span className="text-[10px] text-slate-500">Min</span>
          <span className="text-xs font-medium text-slate-700">{min.toFixed(2)}</span>
        </div>
        <div className="absolute top-[-25px] flex flex-col items-center" style={{ left: `${scale(max)}%`, transform: 'translateX(-50%)' }}>
          <span className="text-[10px] text-slate-500">Max</span>
          <span className="text-xs font-medium text-slate-700">{max.toFixed(2)}</span>
        </div>
        <div className="absolute bottom-[-25px] flex flex-col items-center" style={{ left: `${scale(stats.q1)}%`, transform: 'translateX(-50%)' }}>
          <span className="text-[10px] text-slate-500">Q1</span>
          <span className="text-xs font-medium text-emerald-600">{stats.q1.toFixed(2)}</span>
        </div>
        <div className="absolute bottom-[-25px] flex flex-col items-center" style={{ left: `${scale(stats.q3)}%`, transform: 'translateX(-50%)' }}>
          <span className="text-[10px] text-slate-500">Q3</span>
          <span className="text-xs font-medium text-emerald-600">{stats.q3.toFixed(2)}</span>
        </div>
        <div className="absolute bottom-[-35px] flex flex-col items-center" style={{ left: `${scale(stats.medianX)}%`, transform: 'translateX(-50%)' }}>
          <span className="text-[10px] text-slate-500">Median</span>
          <span className="text-xs font-bold text-slate-900">{stats.medianX.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-slate-600">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="font-semibold text-slate-800">Interpretação:</p>
          <ul className="list-disc ml-4 mt-1 space-y-1">
            <li>IQR (Amplitude Interquartil): <span className="font-mono">{stats.iqr.toFixed(2)}</span></li>
            <li>Amplitude Total: <span className="font-mono">{(max - min).toFixed(2)}</span></li>
          </ul>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="font-semibold text-slate-800">Assimetria (Skewness):</p>
          <p className="mt-1">
            Valor: <span className={`font-mono font-bold ${Math.abs(stats.skewness) > 0.5 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {stats.skewness.toFixed(3)}
            </span>
          </p>
          <p className="text-xs mt-1 text-slate-400">
            {stats.skewness > 0.5 ? "Cauda longa à direita" : stats.skewness < -0.5 ? "Cauda longa à esquerda" : "Distribuição aproximadamente simétrica"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BoxPlot;
