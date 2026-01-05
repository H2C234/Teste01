
import React, { useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { SimulationStep, Statistics } from '../types';

interface Props {
  history: SimulationStep[];
  stats: Statistics;
}

const SimulationPlot: React.FC<Props> = ({ history, stats }) => {
  const chartData = useMemo(() => {
    // We downsample for better performance if n_steps is high
    const stepSize = Math.max(1, Math.floor(history.length / 500));
    return history
      .filter((_, i) => i % stepSize === 0)
      .map((step, idx) => ({
        index: idx,
        b1x: step.bodies[0].x, b1y: step.bodies[0].y,
        b2x: step.bodies[1].x, b2y: step.bodies[1].y,
        b3x: step.bodies[2].x, b3y: step.bodies[2].y,
        meanX: step.mean.x, meanY: step.mean.y,
        medianX: step.median.x, medianY: step.median.y,
      }));
  }, [history]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[500px]">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">Caminho dos Corpos e Centro de Gravidade</h3>
      <ResponsiveContainer width="100%" height="90%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis type="number" dataKey="x" name="X" unit="" stroke="#64748b" />
          <YAxis type="number" dataKey="y" name="Y" unit="" stroke="#64748b" />
          <ZAxis type="number" range={[1, 1]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend verticalAlign="top" height={36}/>
          
          <Scatter name="Corpo 1" data={chartData.map(d => ({ x: d.b1x, y: d.b1y }))} fill="#3b82f6" line={{ stroke: '#3b82f6', strokeWidth: 1, opacity: 0.4 }} shape="circle" />
          <Scatter name="Corpo 2" data={chartData.map(d => ({ x: d.b2x, y: d.b2y }))} fill="#10b981" line={{ stroke: '#10b981', strokeWidth: 1, opacity: 0.4 }} shape="circle" />
          <Scatter name="Corpo 3" data={chartData.map(d => ({ x: d.b3x, y: d.b3y }))} fill="#f59e0b" line={{ stroke: '#f59e0b', strokeWidth: 1, opacity: 0.4 }} shape="circle" />
          
          <Scatter name="Média (CG)" data={chartData.map(d => ({ x: d.meanX, y: d.meanY }))} fill="#1e293b" line={{ stroke: '#1e293b', strokeWidth: 2, strokeDasharray: '5 5' }} shape="circle" />
          <Scatter name="Mediana" data={chartData.map(d => ({ x: d.medianX, y: d.medianY }))} fill="#ec4899" line={{ stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '3 3' }} shape="circle" />
          
          {/* Static Mode Point */}
          <Scatter name="Moda (Fixa)" data={[{ x: stats.modeX, y: stats.modeY }]} fill="#ef4444" shape="diamond"  />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimulationPlot;
