import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ReferenceLine, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((entry, i) => (
        entry.value !== null && entry.value !== undefined && (
          <div className="tooltip-row" key={i}>
            <span style={{ color: entry.color || entry.stroke }}>{entry.name}</span>
            <span className="tooltip-value">{Math.round(entry.value).toLocaleString()} MW</span>
          </div>
        )
      ))}
    </div>
  );
};

/**
 * GridBalanceChart — stacked area chart: demand vs generation components
 */
export default function GridBalanceChart({ data, height = 300 }) {
  if (!data || data.length === 0) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data</div>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f44336" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#f44336" stopOpacity={0.03} />
          </linearGradient>
          <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffc107" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#ffc107" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2196f3" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#2196f3" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9c27b0" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#9c27b0" stopOpacity={0.03} />
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
          tickFormatter={v => `${(v / 1000).toFixed(1)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
          formatter={(value) => <span style={{ color: 'var(--text-secondary)' }}>{value}</span>}
        />

        {/* Generation stacked areas */}
        <Area
          type="monotone"
          dataKey="conventionalGeneration"
          name="Conventional"
          stackId="gen"
          fill="url(#convGrad)"
          stroke="#9c27b0"
          strokeWidth={1}
        />
        <Area
          type="monotone"
          dataKey="windGeneration"
          name="Wind"
          stackId="gen"
          fill="url(#windGrad)"
          stroke="#2196f3"
          strokeWidth={1}
        />
        <Area
          type="monotone"
          dataKey="solarGeneration"
          name="Solar"
          stackId="gen"
          fill="url(#solarGrad)"
          stroke="#ffc107"
          strokeWidth={1}
        />

        {/* Demand line */}
        <Area
          type="monotone"
          dataKey="demand"
          name="Demand"
          fill="url(#demandGrad)"
          stroke="#f44336"
          strokeWidth={2.5}
          dot={false}
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/**
 * GenerationMixDonut — PieChart showing generation mix
 */
export function GenerationMixDonut({ solar, wind, conventional, height = 220 }) {
  const data = [
    { name: 'Solar', value: solar || 0, color: '#ffc107' },
    { name: 'Wind', value: wind || 0, color: '#2196f3' },
    { name: 'Conventional', value: conventional || 0, color: '#9c27b0' },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const DonutTooltip = ({ active, payload }) => {
    if (!active || !payload) return null;
    return (
      <div className="custom-tooltip">
        <div className="tooltip-row">
          <span style={{ color: payload[0]?.payload?.color }}>{payload[0]?.name}</span>
          <span className="tooltip-value">{Math.round(payload[0]?.value).toLocaleString()} MW</span>
        </div>
        <div className="tooltip-row">
          <span style={{ color: 'var(--text-muted)' }}>Share</span>
          <span>{total > 0 ? Math.round(payload[0]?.value / total * 100) : 0}%</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={height * 0.28}
            outerRadius={height * 0.42}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={<CustomLabel />}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px' }}
            formatter={(value) => <span style={{ color: 'var(--text-secondary)' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
          {total.toLocaleString()}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MW Total</div>
      </div>
    </div>
  );
}
