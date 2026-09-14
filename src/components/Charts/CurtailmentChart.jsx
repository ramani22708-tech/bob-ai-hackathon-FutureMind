import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((entry, i) => (
        entry.value !== null && entry.value !== undefined && (
          <div className="tooltip-row" key={i}>
            <span style={{ color: entry.color || entry.fill }}>{entry.name}</span>
            <span className="tooltip-value">{Math.round(entry.value).toLocaleString()} MW</span>
          </div>
        )
      ))}
    </div>
  );
};

/**
 * CurtailmentChart — BarChart showing available vs utilised vs curtailed renewable
 */
export default function CurtailmentChart({ data, height = 280 }) {
  if (!data || data.length === 0) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data</div>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barSize={6}>
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
          tickFormatter={v => `${v}MW`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
          formatter={(value) => <span style={{ color: 'var(--text-secondary)' }}>{value}</span>}
        />
        <Bar dataKey="utilised" name="Utilised Renewable" fill="#00e676" opacity={0.7} stackId="a" />
        <Bar dataKey="curtailed" name="Curtailed" fill="#f44336" opacity={0.75} stackId="a" radius={[2,2,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * CurtailmentTrendLine — simple line chart of curtailment % over time
 */
import { LineChart, Line } from 'recharts';

export function CurtailmentTrendLine({ data, height = 80 }) {
  if (!data || data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
        <YAxis hide domain={[0, 'auto']} />
        <XAxis dataKey="label" hide />
        <Line
          type="monotone"
          dataKey="curtailmentPct"
          stroke="#f44336"
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
