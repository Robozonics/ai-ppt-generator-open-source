import { Card } from "@/lib/schema";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, LineChart as LineChartIcon, Activity } from "lucide-react";

interface DataPoint {
  label: string;
  value: number;
  displayValue?: string;
  color?: string;
}

export function ChartCard({ card }: { card?: Card }) {
  const title = card?.title || "Growth Trajectory & Performance";
  const subtitle = card?.subtitle || "Key quantitative indicators and performance projections.";

  // Extract chart data from card elements
  const chartElement = card?.elements?.find((el) => el.type === "chart");
  const statElements = card?.elements?.filter((el) => el.type === "stat_metric") || [];
  const bulletElements = card?.elements?.filter((el) => el.type === "bullet_list") || [];
  const textElements = card?.elements?.filter((el) => el.type === "paragraph" || el.type === "callout") || [];

  // Parse points from various formats
  let parsedPoints: DataPoint[] = [];

  if (chartElement?.chartData && chartElement.chartData.length > 0) {
    parsedPoints = chartElement.chartData.map((d) => ({
      label: d.label,
      value: d.value,
      displayValue: `${d.value}`,
      color: d.color,
    }));
  } else if (statElements.length > 0) {
    parsedPoints = statElements.map((st) => {
      const numericVal = parseFloat((st.metricValue || "0").replace(/[^0-9.]/g, "")) || 50;
      return {
        label: st.metricLabel || "Metric",
        value: numericVal,
        displayValue: st.metricValue || `${numericVal}`,
      };
    });
  } else if (bulletElements.length > 0 && bulletElements[0].items) {
    bulletElements[0].items.forEach((item) => {
      const match = item.match(/^([^:]+):\s*([$€£]?\s*[\d,.]+%?)/i);
      if (match) {
        const rawNum = parseFloat(match[2].replace(/[^0-9.]/g, "")) || 40;
        parsedPoints.push({
          label: match[1].trim(),
          value: rawNum,
          displayValue: match[2].trim(),
        });
      }
    });
  }

  // Smart default dataset if elements had no parseable numbers
  if (parsedPoints.length < 2) {
    parsedPoints = [
      { label: "Q1 Launch", value: 25, displayValue: "25%" },
      { label: "Q2 Expansion", value: 48, displayValue: "48%" },
      { label: "Q3 Scale", value: 72, displayValue: "72%" },
      { label: "Q4 Dominance", value: 95, displayValue: "95%" },
    ];
  }

  // Determine chart style (bar, line, or area)
  const chartType = chartElement?.chartType || (title.toLowerCase().includes("trend") || title.toLowerCase().includes("growth") ? "area" : "bar");

  // Chart calculation metrics
  const maxValue = Math.max(...parsedPoints.map((p) => p.value), 10);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Accent colors for dynamic palette
  const accentVars = ["--theme-primary", "--theme-secondary", "--theme-accent", "--theme-primary"];

  return (
    <div className="w-full h-full flex flex-col justify-center">
      {/* Slide Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
          <Activity className="w-3.5 h-3.5" /> Quantitative Insights
        </div>
        <h2
          className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-text), 0.85))` }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-base md:text-lg max-w-3xl mx-auto font-light" style={{ color: `rgb(var(--theme-text-muted))` }}>
            {subtitle}
          </p>
        )}
        <div
          className="mt-3 mx-auto w-20 h-1 rounded-full"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))` }}
        />
      </div>

      {/* Main Grid: Insights on Left, Interactive Graph on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-6xl mx-auto w-full">
        {/* Left Side: Analytical Insights */}
        <div className="md:col-span-5 space-y-4">
          {textElements.map((el, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border backdrop-blur-xl shadow-lg"
              style={{
                backgroundColor: `rgba(var(--theme-surface), 0.4)`,
                borderColor: `rgba(var(--theme-primary), 0.25)`,
              }}
            >
              {el.title && (
                <h4 className="text-base md:text-lg font-bold mb-1.5 flex items-center gap-2" style={{ color: `rgb(var(--theme-text))` }}>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  {el.title}
                </h4>
              )}
              <p className="text-sm md:text-base leading-relaxed font-light" style={{ color: `rgb(var(--theme-text-muted))` }}>
                {el.content}
              </p>
            </div>
          ))}

          {/* Quick Metrics Summary Strip */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div
              className="p-4 rounded-xl border backdrop-blur-md"
              style={{
                backgroundColor: `rgba(var(--theme-primary), 0.08)`,
                borderColor: `rgba(var(--theme-primary), 0.3)`,
              }}
            >
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">Peak Value</div>
              <div className="text-2xl font-black mt-1" style={{ color: `rgb(var(--theme-primary))` }}>
                {parsedPoints[parsedPoints.length - 1]?.displayValue || `${maxValue}`}
              </div>
            </div>
            <div
              className="p-4 rounded-xl border backdrop-blur-md"
              style={{
                backgroundColor: `rgba(var(--theme-secondary), 0.08)`,
                borderColor: `rgba(var(--theme-secondary), 0.3)`,
              }}
            >
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">Data Points</div>
              <div className="text-2xl font-black mt-1" style={{ color: `rgb(var(--theme-secondary))` }}>
                {parsedPoints.length} Cycles
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Graph / Chart Canvas */}
        <div
          className="md:col-span-7 rounded-3xl p-6 md:p-8 border backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[340px]"
          style={{
            backgroundColor: `rgba(var(--theme-surface), 0.5)`,
            borderColor: `rgba(var(--theme-primary), 0.25)`,
            boxShadow: `0 0 50px -10px rgba(var(--theme-primary), 0.2)`,
          }}
        >
          {/* Subtle Ambient Graph Glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-25"
            style={{ backgroundColor: `rgb(var(--theme-primary))` }}
          />

          {/* Graph Header / Legend */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              {chartType === "bar" ? <BarChart3 className="w-5 h-5 text-cyan-400" /> : <LineChartIcon className="w-5 h-5 text-cyan-400" />}
              <span className="text-sm font-bold tracking-wide text-white uppercase">Performance Analysis</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `rgb(var(--theme-primary))` }} /> Target
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `rgb(var(--theme-secondary))` }} /> Forecast
              </span>
            </div>
          </div>

          {/* Render Bar Chart */}
          {chartType === "bar" && (
            <div className="flex-1 flex items-end justify-between gap-4 md:gap-6 pt-8 pb-4 relative">
              {/* Horizontal Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-15">
                <div className="border-b border-white w-full" />
                <div className="border-b border-white w-full" />
                <div className="border-b border-white w-full" />
                <div className="border-b border-white w-full" />
              </div>

              {parsedPoints.map((pt, idx) => {
                const heightPercent = Math.max(12, Math.round((pt.value / maxValue) * 100));
                const accentVar = accentVars[idx % accentVars.length];
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center group relative z-10 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: -5 }}
                        className="absolute -top-10 px-3 py-1 rounded-lg bg-black/90 border border-white/20 text-xs font-bold text-white shadow-xl pointer-events-none whitespace-nowrap z-20"
                      >
                        {pt.label}: {pt.displayValue}
                      </motion.div>
                    )}

                    {/* Value Badge above bar */}
                    <span
                      className={`text-xs font-bold mb-2 transition-all duration-300 ${
                        isHovered ? "scale-110" : "opacity-80"
                      }`}
                      style={{ color: `rgb(var(${accentVar}))` }}
                    >
                      {pt.displayValue}
                    </span>

                    {/* Animated Bar Column */}
                    <div className="w-full max-w-[48px] bg-white/[0.04] rounded-t-xl overflow-hidden flex items-end h-[160px] p-1 border border-white/5">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full rounded-t-lg transition-all duration-300 group-hover:brightness-125"
                        style={{
                          backgroundImage: `linear-gradient(to top, rgba(var(${accentVar}), 0.4), rgb(var(${accentVar})))`,
                          boxShadow: isHovered ? `0 0 25px rgba(var(${accentVar}), 0.8)` : `0 0 15px rgba(var(${accentVar}), 0.3)`,
                        }}
                      />
                    </div>

                    {/* Label */}
                    <span className="text-xs font-medium text-slate-300 mt-3 text-center truncate max-w-[80px]">
                      {pt.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Render Smooth Area / Line Trend Graph */}
          {chartType !== "bar" && (
            <div className="flex-1 flex flex-col justify-end pt-4 pb-2 relative">
              <svg viewBox="0 0 500 180" className="w-full h-[180px] overflow-visible">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(var(--theme-primary))" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="rgb(var(--theme-primary))" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

                {/* Calculate SVG Coordinates */}
                {(() => {
                  const paddingX = 40;
                  const availableWidth = 500 - paddingX * 2;
                  const stepX = availableWidth / (parsedPoints.length - 1 || 1);

                  const coords = parsedPoints.map((pt, i) => {
                    const x = paddingX + i * stepX;
                    const y = 160 - (pt.value / maxValue) * 130;
                    return { x, y, pt };
                  });

                  // Build smooth path
                  const pathData = coords.reduce((acc, curr, i, arr) => {
                    if (i === 0) return `M ${curr.x} ${curr.y}`;
                    const prev = arr[i - 1];
                    const cx = (prev.x + curr.x) / 2;
                    return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
                  }, "");

                  const areaPath = `${pathData} L ${coords[coords.length - 1].x} 170 L ${coords[0].x} 170 Z`;

                  return (
                    <>
                      {/* Area Fill */}
                      <path d={areaPath} fill="url(#areaGradient)" />

                      {/* Glowing Line */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke="rgb(var(--theme-primary))"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_12px_rgba(var(--theme-primary),0.8)]"
                      />

                      {/* Interactive Nodes */}
                      {coords.map((c, i) => (
                        <g key={i} className="cursor-pointer">
                          <circle
                            cx={c.x}
                            cy={c.y}
                            r="6"
                            fill="rgb(var(--theme-secondary))"
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            className="transition-transform duration-300 hover:scale-150"
                          />
                          <text
                            x={c.x}
                            y={c.y - 12}
                            textAnchor="middle"
                            fill="rgb(var(--theme-text))"
                            fontSize="11"
                            fontWeight="bold"
                          >
                            {c.pt.displayValue}
                          </text>
                          <text
                            x={c.x}
                            y={178}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.6)"
                            fontSize="11"
                          >
                            {c.pt.label}
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
