import React from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
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
 * RenewableChart — ComposedChart with actual (bar) vs expected (line) per asset/period
 */
export default function RenewableChart({ data, height = 280 }) {
  if (!data || data.length === 0) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data</div>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          interval={7}
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
        <Bar dataKey="solarGeneration" name="Solar Actual" fill="rgba(255,193,7,0.5)" radius={[2,2,0,0]} />
        <Bar dataKey="windGeneration" name="Wind Actual" fill="rgba(33,150,243,0.5)" radius={[2,2,0,0]} />
        <Line
          dataKey="expectedSolar"
          name="Solar Expected"
          stroke="#ffc107"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={false}
        />
        <Line
          dataKey="expectedWind"
          name="Wind Expected"
          stroke="#2196f3"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/**
 * AssetPerformanceChart — horizontal bar chart comparing 6 assets by performance ratio
 */
export function AssetPerformanceBarChart({ assets, height = 260 }) {
  if (!assets || assets.length === 0) return null;

  const data = assets.map(a => ({
    name: a.name.replace('Solar Farm ', 'SF ').replace('Wind Farm ', 'WF '),
    performance: Math.round(a.performanceRatio * 100),
    availability: Math.round(a.availability),
    type: a.type,
  }));

  const CustomTooltip2 = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="custom-tooltip">
        <div className="tooltip-label">{label}</div>
        {payload.map((e, i) => (
          <div className="tooltip-row" key={i}>
            <span style={{ color: e.color }}>{e.name}</span>
            <span className="tooltip-value">{e.value}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
        <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          tickFormatter={v => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip2 />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
          formatter={(value) => <span style={{ color: 'var(--text-secondary)' }}>{value}</span>}
        />
        <Bar dataKey="performance" name="Performance Ratio %" fill="#2196f3" radius={[0, 3, 3, 0]} opacity={0.8} />
        <Bar dataKey="availability" name="Availability %" fill="#00e676" radius={[0, 3, 3, 0]} opacity={0.6} />
        <ReferenceLine x={80} stroke="rgba(255,193,7,0.4)" strokeDasharray="3 3" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
