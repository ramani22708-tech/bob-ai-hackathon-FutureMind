import React, { useState, useRef, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { answerQuestion, EXAMPLE_QUESTIONS, generateDemandInsight, generateLoadBalancingRecommendations } from '../utils/aiInsights';

export default function AIInsights() {
  const {
    kpis,
    gridBalance,
    anomalies,
    allAlerts,
    forecastResult,
    curtailmentPlan,
  } = useSimulation();

  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: '👋 Hello! I\'m the GridWise AI advisor — a rule-based system that answers questions using live simulation data. Ask me about demand, solar/wind performance, grid balance, curtailment, anomalies, or recommendations.\n\nAll my responses are derived from real data computations — not a generative AI model.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const allData = { kpis, gridBalance, anomalies, allAlerts, forecastMeta: forecastResult?.metadata };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = (question) => {
    if (!question.trim()) return;
    const q = question.trim();
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = answerQuestion(q, allData);
      setMessages(prev => [...prev, { role: 'ai', text: answer }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk(input);
    }
  };

  const demandInsight = forecastResult?.metadata
    ? generateDemandInsight(forecastResult.metadata, forecastResult.forecast)
    : '';

  const recs = gridBalance
    ? generateLoadBalancingRecommendations(gridBalance, allAlerts)
    : [];

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">🤖 AI Insights</h1>
            <p className="page-subtitle">Rule-based AI advisor — data-driven analysis of live simulation state</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="sim-tag">Simulated Data</span>
            <span className="ai-tag">Rule-Based AI</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        background: 'rgba(156,39,176,0.07)',
        border: '1px solid rgba(156,39,176,0.2)',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '20px',
        fontSize: '12px',
        color: '#ce93d8',
      }}>
        ℹ️ <strong>Rule-Based AI:</strong> All responses are generated using deterministic, transparent rule-based logic operating on simulated grid data. This is NOT a generative AI model. All outputs are traceable to data and rules.
      </div>

      <div className="grid-2" style={{ marginBottom: '20px', alignItems: 'start' }}>
        {/* Chat Interface */}
        <div className="card">
          <div className="chart-header">
            <div>
              <div className="chart-title">💬 AI Advisor Chat</div>
              <div className="chart-sub">Ask questions about the current grid state</div>
            </div>
            <span className="ai-tag">Rule-Based AI</span>
          </div>

          {/* Messages */}
          <div className="chat-container" style={{ marginBottom: '12px' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}
                style={{ whiteSpace: 'pre-line' }}
              >
                {msg.role === 'ai' && (
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    GRIDWISE AI · RULE-BASED
                  </span>
                )}
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble-ai">
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>GRIDWISE AI</span>
                <span style={{ color: 'var(--text-muted)' }}>Analysing data</span>
                <span style={{ animation: 'pulse-dot 1s infinite', display: 'inline-block', marginLeft: '4px' }}>...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-row">
            <input
              type="text"
              className="form-input"
              placeholder="Ask about the grid..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className="btn btn-primary"
              onClick={() => handleAsk(input)}
              disabled={!input.trim() || isTyping}
            >
              Ask
            </button>
          </div>

          {/* Example Questions */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>Example questions:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {EXAMPLE_QUESTIONS.slice(0, 5).map((q, i) => (
                <button
                  key={i}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '11px', padding: '4px 10px' }}
                  onClick={() => handleAsk(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Insight Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Demand Insight */}
          <div className="card">
            <div className="chart-header">
              <div className="chart-title">📈 Demand Narrative</div>
              <span className="ai-tag">Auto-Generated</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              {demandInsight || 'Loading insight...'}
            </p>
          </div>

          {/* Grid Balance Insight */}
          <div className="card">
            <div className="chart-header">
              <div className="chart-title">⚖️ Grid Balance Assessment</div>
              <span className="ai-tag">Auto-Generated</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              <p>Current demand: <strong style={{ color: 'var(--text-primary)' }}>{kpis.currentDemand?.toLocaleString()} MW</strong> · Generation: <strong style={{ color: 'var(--text-primary)' }}>{kpis.totalGeneration?.toLocaleString()} MW</strong></p>
              <p style={{ marginTop: '4px' }}>Grid balance: <strong style={{ color: kpis.gridBalance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>{kpis.gridBalance >= 0 ? '+' : ''}{kpis.gridBalance} MW</strong> · Reserve margin: <strong style={{ color: kpis.reserveMargin < 8 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{kpis.reserveMargin}%</strong></p>
              <p style={{ marginTop: '4px' }}>Renewable fraction: <strong style={{ color: 'var(--accent-green)' }}>{kpis.renewablePct}%</strong> · Carbon intensity: <strong style={{ color: 'var(--accent-purple)' }}>{kpis.carbonIntensity} gCO₂e/kWh</strong></p>
            </div>
          </div>

          {/* Anomaly Insight */}
          <div className="card">
            <div className="chart-header">
              <div className="chart-title">🔍 Anomaly Summary</div>
              <span className="badge badge-warning">{anomalies.length} detected</span>
            </div>
            {anomalies.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No anomalies detected in the current monitoring period.</p>
            ) : (
              anomalies.slice(0, 3).map((a, i) => (
                <div key={i} style={{ marginBottom: '8px', padding: '8px 10px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{a.assetName}</span>
                    <span className={`badge badge-${a.severity}`}>{a.severity.toUpperCase()}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {a.label} · Actual: {a.actual} MW vs Expected: {a.expected} MW (−{a.deviation}%)
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Likely cause: {a.possibleCauses?.[0]?.cause}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Panel */}
      <div className="card">
        <div className="chart-header">
          <div>
            <div className="chart-title">🎯 Load Balancing Recommendations</div>
            <div className="chart-sub">Rule-based prioritised action plan — derived from current grid state</div>
          </div>
          <span className="ai-tag">Rule-Based AI</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recs.map((rec, i) => (
            <div key={i} style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: '1.65',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}>
              <span style={{ background: 'var(--border)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: 'var(--text-primary)', flexShrink: 0 }}>
                {i + 1}
              </span>
              <span>{rec}</span>
            </div>
          ))}
          {recs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              ✅ No recommendations — grid is operating normally
            </div>
          )}
        </div>
      </div>

      {/* More example questions */}
      <div className="card" style={{ marginTop: '16px' }}>
        <div className="chart-title" style={{ marginBottom: '12px' }}>💡 More Questions to Try</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {EXAMPLE_QUESTIONS.slice(5).map((q, i) => (
            <button
              key={i}
              className="btn btn-secondary btn-sm"
              onClick={() => handleAsk(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
