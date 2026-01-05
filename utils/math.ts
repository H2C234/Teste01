
import { Vector2D, SimulationStep, SimulationConfig, Statistics } from '../types';

export const generateSimulation = (config: SimulationConfig): { history: SimulationStep[], stats: Statistics } => {
  const { n_steps, vel_scale, noise_scale, dt } = config;
  
  // Initialize positions (3 bodies)
  let positions: Vector2D[] = Array.from({ length: 3 }, () => ({
    x: Math.random() * 10,
    y: Math.random() * 10
  }));

  // Initialize velocities
  let velocities: Vector2D[] = Array.from({ length: 3 }, () => ({
    x: (Math.random() - 0.5) * 2 * vel_scale,
    y: (Math.random() - 0.5) * 2 * vel_scale
  }));

  const history: SimulationStep[] = [];
  const xValues: number[] = [];
  const yValues: number[] = [];

  for (let step = 0; step < n_steps; step++) {
    const bodiesStep: Vector2D[] = [];
    
    // Update velocities with noise and positions
    positions = positions.map((pos, i) => {
      velocities[i].x += (Math.random() - 0.5) * 2 * noise_scale;
      velocities[i].y += (Math.random() - 0.5) * 2 * noise_scale;
      
      const nextPos = {
        x: pos.x + velocities[i].x * dt,
        y: pos.y + velocities[i].y * dt
      };
      bodiesStep.push(nextPos);
      return nextPos;
    });

    const meanX = bodiesStep.reduce((acc, p) => acc + p.x, 0) / 3;
    const meanY = bodiesStep.reduce((acc, p) => acc + p.y, 0) / 3;
    
    const sortedX = [...bodiesStep.map(p => p.x)].sort((a, b) => a - b);
    const sortedY = [...bodiesStep.map(p => p.y)].sort((a, b) => a - b);
    
    const medianX = sortedX[1];
    const medianY = sortedY[1];

    history.push({
      bodies: bodiesStep,
      mean: { x: meanX, y: meanY },
      median: { x: medianX, y: medianY }
    });
    
    xValues.push(meanX);
    yValues.push(meanY);
  }

  // Calculate Statistics for Center of Gravity (Mean Path)
  const stats = calculateAdvancedStats(xValues, yValues);

  return { history, stats };
};

const calculateAdvancedStats = (x: number[], y: number[]): Statistics => {
  const n = x.length;
  if (n === 0) {
    return {
      meanX: 0, meanY: 0, medianX: 0, medianY: 0, modeX: 0, modeY: 0,
      skewness: 0, kurtosis: 0, q1: 0, q3: 0, iqr: 0
    };
  }

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  const sortedX = [...x].sort((a, b) => a - b);
  const sortedY = [...y].sort((a, b) => a - b);
  const medianX = sortedX[Math.floor(n / 2)];
  const medianY = sortedY[Math.floor(n / 2)];

  // Mode (rounded to 1 decimal like the original script)
  const getMode = (arr: number[]) => {
    if (arr.length === 0) return 0;
    const counts: Record<string, number> = {};
    let maxCount = 0;
    let modeVal = arr[0];
    arr.forEach(val => {
      const rounded = val.toFixed(1);
      counts[rounded] = (counts[rounded] || 0) + 1;
      if (counts[rounded] > maxCount) {
        maxCount = counts[rounded];
        modeVal = parseFloat(rounded);
      }
    });
    return modeVal;
  };

  const modeX = getMode(x);
  const modeY = getMode(y);

  // Standard Deviation
  const sumSqDiffX = x.reduce((a, b) => a + Math.pow(b - meanX, 2), 0);
  const stdX = Math.sqrt(sumSqDiffX / n);

  // Skewness and Kurtosis (avoid division by zero)
  let skewness = 0;
  let kurtosis = 0;
  if (stdX > 0) {
    skewness = (x.reduce((a, b) => a + Math.pow(b - meanX, 3), 0) / n) / Math.pow(stdX, 3);
    kurtosis = (x.reduce((a, b) => a + Math.pow(b - meanX, 4), 0) / n) / Math.pow(stdX, 4) - 3;
  }

  const q1 = sortedX[Math.floor(n * 0.25)];
  const q3 = sortedX[Math.floor(n * 0.75)];
  const iqr = q3 - q1;

  return {
    meanX, meanY,
    medianX, medianY,
    modeX, modeY,
    skewness, kurtosis,
    q1, q3, iqr
  };
};

export const getNormalDistribution = (mean: number, std: number, range: [number, number], steps: number = 100) => {
  if (std <= 0) return [];
  const points = [];
  const step = (range[1] - range[0]) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = range[0] + i * step;
    const y = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
    points.push({ x, y });
  }
  return points;
};
