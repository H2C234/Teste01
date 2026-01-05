
import React, { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SimulationStep, Statistics } from '../types';
import { getNormalDistribution } from '../utils/math';

interface Props {
  history: SimulationStep[];
  stats: Statistics;
}

const DistributionPlot: React.FC<Props> = ({ history, stats }) => {
  const data = useMemo(() => {
    if (history.length === 0) return { histogram: [], gaussian: [] };
    
    const xValues = history.map(h => h.mean.x);
    const min = Math.min(...xValues);
    const max = Math.max(...xValues);
    const range = max - min;
    const binsCount = 30;
    const binSize = range === 0 ? 1 : range / binsCount;
    
    const bins = Array.from({ length: binsCount }, (_, i) => ({
      x0: min + i * binSize,
      x1: min + (i + 1) * binSize,
      count: 0
    }));

    xValues.forEach(v => {
      let idx = Math.floor((v - min) / binSize);
      if (idx >= binsCount) idx = binsCount - 1;
      if (idx < 0) idx = 0;
      bins[idx].count++;
    });

    const total = xValues.length;
    const histogram = bins.map(b => ({
      x: (b.x0 + b.x1) / 2,
      density: total > 0 ? b.count / (total * binSize) : 0
    }));

    const stdX = Math.sqrt(xValues.reduce((a, b) => a + Math.pow(b - stats.meanX, 2), 0) / total);
    const gaussian = getNormalDistribution(stats.meanX, stdX, [min - 1, max + 1], 100);

    return { histogram, gaussian };
  }, [history, stats]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[450px]">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">Distribuição da Posição X (CG)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data.histogram} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={['auto', 'auto']} 
            stroke="#64748b" 
            tickFormatter={(v) => typeof v === 'number' ? v.toFixed(1) : ''}
          />
          <YAxis stroke="#64748b" />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelFormatter={(v) => `Posição X: ${Number(v).toFixed(2)}`}
          />
          <Bar dataKey="density" fill="#bae6fd" name="Histograma" radius={[4, 4, 0, 0]} />
          
          <Line 
            data={data.gaussian} 
            type="monotone" 
            dataKey="y" 
            stroke="#ef4444" 
            strokeWidth={2} 
            dot={false} 
            name="Curva Gaussiana" 
          />

          <ReferenceLine x={stats.meanX} stroke="#1e293b" strokeDasharray="3 3" label={{ position: 'top', value: 'Média', fill: '#1e293b', fontSize: 10 }} />
          <ReferenceLine x={stats.medianX} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Mediana', fill: '#10b981', fontSize: 10 }} />
          <ReferenceLine x={stats.modeX} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Moda', fill: '#ef4444', fontSize: 10 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionPlot;
