
export interface Vector2D {
  x: number;
  y: number;
}

export interface SimulationStep {
  bodies: Vector2D[];
  mean: Vector2D;
  median: Vector2D;
}

export interface SimulationConfig {
  n_steps: number;
  vel_scale: number;
  noise_scale: number;
  dt: number;
}

export interface Statistics {
  meanX: number;
  meanY: number;
  medianX: number;
  medianY: number;
  modeX: number;
  modeY: number;
  skewness: number;
  kurtosis: number;
  q1: number;
  q3: number;
  iqr: number;
}
