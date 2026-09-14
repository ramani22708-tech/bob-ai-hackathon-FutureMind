import React from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ReferenceLine, ResponsiveContainer, ReferenceArea,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((entry, i) => (
        entry.value !== null && entry.value !== undefined && (
          <div className="tooltip-row" key={i}>
            <span style={{ color: entry.color }}>{entry.name}</span>
            <span className="tooltip-value">{Math.round(entry.value).toLocaleString()} MW</span>
          </div>
        )
      ))}
    </div>
  );
};

/**
 * DemandChart — historical actual (solid) + forecast (dashed) + confidence band (area)
 */
export default function DemandChart({ data, peakDemand, showConfidence = true, height = 300 }) {
  if (!data || data.length === 0) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data</div>;

  // Find transition index
  const transitionIdx = data.findIndex(p => p.isForecast);
  const transitionLabel = transitionIdx >= 0 ? data[transitionIdx]?.label : null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2196f3" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#2196f3" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="label"
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          interval={11}
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          domain={['auto', 'auto']}
          tickFormatter={v => `${(v / 1000).toFixed(1)}k`}
        />

        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
          formatter={(value) => <span style={{ color: 'var(--text-secondary)' }}>{value}</span>}
        />

        {/* Confidence band */}
        {showConfidence && (
          <Area
            dataKey="upper"
            name="Upper CI"
            fill="url(#ciGradient)"
            stroke="transparent"
            legendType="none"
            dot={false}
            activeDot={false}
            connectNulls={false}
          />
        )}
        {showConfidence && (
          <Area
            dataKey="lower"
            name="Lower CI"
            fill="var(--bg-primary)"
            stroke="transparent"
            legendType="none"
            dot={false}
            activeDot={false}
            connectNulls={false}
          />
        )}

        {/* Actual historical demand */}
        <Line
          dataKey="actual"
          name="Actual Demand"
          stroke="#2196f3"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, stroke: '#2196f3', fill: '#0a0f1e' }}
          connectNulls={false}
        />

        {/* Forecast demand */}
        <Line
          dataKey="forecast"
          name="Forecast Demand"
          stroke="#00e676"
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={false}
          activeDot={{ r: 4, stroke: '#00e676', fill: '#0a0f1e' }}
          connectNulls={false}
        />

        {/* Peak demand reference line */}
        {peakDemand && (
          <ReferenceLine
            y={peakDemand}
            stroke="var(--accent-amber)"
            strokeDasharray="4 2"
            label={{ value: `Peak ${peakDemand.toLocaleString()}MW`, position: 'insideTopRight', fill: 'var(--accent-amber)', fontSize: 10 }}
          />
        )}

        {/* Forecast start line */}
        {transitionLabel && (
          <ReferenceLine
            x={transitionLabel}
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 2"
            label={{ value: 'Forecast →', position: 'insideTopLeft', fill: 'var(--text-muted)', fontSize: 10 }}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
