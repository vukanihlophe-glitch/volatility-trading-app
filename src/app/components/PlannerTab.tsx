'use client'

import { useState } from 'react'

export default function PlannerTab() {
  const [balance, setBalance]   = useState(1000)
  const [riskPct, setRiskPct]   = useState(2)
  const [stopLoss, setStopLoss] = useState(50)
  const [pipValue, setPipValue] = useState(0.01)

  const riskAmt = balance * (riskPct / 100)
  const lotSize = riskAmt / (stopLoss * pipValue * 100)
  const dailyLimit  = balance * 0.03
  const weeklyGoal  = balance * 0.10

  return (
    <div>
      <div className="grid2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="section-title">Position Calculator</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div>
              <label>Account Balance ($)</label>
              <input
                type="number"
                value={balance}
                onChange={e => setBalance(Number(e.target.value))}
                min={0}
              />
            </div>

            <div>
              <label>Risk per Trade: {riskPct}%</label>
              <input
                type="range"
                min={0.5} max={5} step={0.5}
                value={riskPct}
                onChange={e => setRiskPct(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--txt3)', marginTop: 2 }}>
                <span>0.5%</span><span style={{ fontWeight: 500, color: 'var(--txt)' }}>{riskPct}%</span><span>5%</span>
              </div>
            </div>

            <div>
              <label>Stop Loss (points)</label>
              <input
                type="number"
                value={stopLoss}
                onChange={e => setStopLoss(Number(e.target.value))}
                min={1}
              />
            </div>

            <div>
              <label>Instrument</label>
              <select value={pipValue} onChange={e => setPipValue(Number(e.target.value))}>
                <option value={0.01}>V75 (pip = $0.01)</option>
                <option value={0.10}>V25 (pip = $0.10)</option>
                <option value={1.00}>V100 (pip = $1.00)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Results</div>

          <div className="result-row">
            <span className="result-label">Risk Amount</span>
            <span className="result-value">${riskAmt.toFixed(2)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Lot Size</span>
            <span className="result-value">{lotSize.toFixed(2)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Max Loss</span>
            <span className="result-value pnl-neg">-${riskAmt.toFixed(2)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">1:2 Target</span>
            <span className="result-value pnl-pos">+${(riskAmt * 2).toFixed(2)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">1:3 Target</span>
            <span className="result-value pnl-pos">+${(riskAmt * 3).toFixed(2)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Portfolio Risk</span>
            <span className="result-value">{riskPct.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="grid4">
        {[
          { label: 'Recommended Max Risk', value: '1–2%',             sub: 'Per trade guideline' },
          { label: 'Daily Loss Limit',      value: `$${dailyLimit.toFixed(0)}`,  sub: '3% of balance' },
          { label: 'Weekly Goal',           value: `$${weeklyGoal.toFixed(0)}`,  sub: '10% of balance' },
          { label: 'Breakeven Winrate',     value: '34%',              sub: 'At 1:2 R:R ratio' },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={m.label === 'Recommended Max Risk' ? { color: 'var(--accent)' } : {}}>{m.value}</div>
            <div className="metric-sub">{m.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
