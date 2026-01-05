
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SimulationStep } from '../types';

interface Props {
  history: SimulationStep[];
}

const HeatmapPlot: React.FC<Props> = ({ history }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || history.length < 2) return;

    const data = history.map(d => [d.mean.x, d.mean.y]);
    const width = containerRef.current.clientWidth;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const xExtent = d3.extent(data, d => d[0]) as [number, number];
    const yExtent = d3.extent(data, d => d[1]) as [number, number];
    
    // Fallback if domain is point-like
    if (xExtent[0] === xExtent[1]) { xExtent[0] -= 1; xExtent[1] += 1; }
    if (yExtent[0] === yExtent[1]) { yExtent[0] -= 1; yExtent[1] += 1; }

    const x = d3.scaleLinear()
      .domain(xExtent)
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain(yExtent)
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
      .attr("color", "#64748b");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .attr("color", "#64748b");

    try {
      const densityData = d3.contourDensity()
        .x(d => x(d[0]))
        .y(d => y(d[1]))
        .size([width, height])
        .bandwidth(20)
        .thresholds(30)
        (data as any);

      if (densityData && densityData.length > 0) {
        const color = d3.scaleSequential(d3.interpolateCoolwarm)
          .domain(d3.extent(densityData, d => d.value) as [number, number]);

        svg.append("g")
          .attr("fill", "none")
          .attr("stroke", "none")
          .selectAll("path")
          .data(densityData)
          .enter().append("path")
          .attr("d", d3.geoPath())
          .attr("fill", d => color(d.value))
          .attr("opacity", 0.6);
      }
    } catch (err) {
      console.warn("Could not generate heatmap contours", err);
    }

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height - 6)
      .text("Posição X")
      .attr("fill", "#64748b")
      .attr("font-size", "12px");

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("x", -margin.top)
      .text("Posição Y")
      .attr("fill", "#64748b")
      .attr("font-size", "12px");

  }, [history]);

  return (
    <div ref={containerRef} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[500px]">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">Heatmap 2D (KDE) da Posição do CG</h3>
      {history.length < 2 ? (
        <div className="flex items-center justify-center h-[300px] text-slate-400">Dados insuficientes para Heatmap</div>
      ) : (
        <svg ref={svgRef} className="w-full h-full" viewBox={`0 0 ${containerRef.current?.clientWidth || 800} 400`} preserveAspectRatio="xMidYMid meet" />
      )}
    </div>
  );
};

export default HeatmapPlot;
