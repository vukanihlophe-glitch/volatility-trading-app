'use client'

const TRADES = [
  { date: 'Mar 28', type: 'BUY',  entry: 6211.2, exit: 6244.8, lots: 0.04, pnl:  134 },
  { date: 'Mar 27', type: 'SELL', entry: 6318.5, exit: 6295.0, lots: 0.03, pnl:   70 },
  { date: 'Mar 26', type: 'BUY',  entry: 6189.4, exit: 6175.2, lots: 0.04, pnl:  -57 },
  { date: 'Mar 25', type: 'BUY',  entry: 6152.0, exit: 6201.5, lots: 0.05, pnl:  247 },
  { date: 'Mar 24', type: 'SELL', entry: 6270.3, exit: 6258.8, lots: 0.04, pnl:   46 },
  { date: 'Mar 22', type: 'BUY',  entry: 6098.7, exit: 6081.2, lots: 0.03, pnl:  -52 },
]

const totalTrades = TRADES.length
const wins        = TRADES.filter(t => t.pnl > 0).length
const winRate     = ((wins / totalTrades) * 100).toFixed(1)
const netPnl      = TRADES.reduce((s, t) => s + t.pnl, 0)
const grossWin    = TRADES.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0)
const grossLoss   = Math.abs(TRADES.filter(t => t.pnl < 0).reduce((s, t) => s + t.pnl, 0))
const profitFactor = (grossWin / grossLoss).toFixed(1)

export default function JournalTab() {
  return (
    <div>
      <div className="grid4" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Trades',  value: totalTrades },
          { label: 'Win Rate',      value: `${winRate}%`,    color: 'var(--pnl-green)' },
          { label: 'Net P&L',       value: `+$${netPnl}`,    color: 'var(--pnl-green)' },
          { label: 'Profit Factor', value: profitFactor },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={m.color ? { color: m.color } : {}}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-title">Trade History</div>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 56px 72px 72px 52px 80px', gap: 8, padding: '8px 0', borderBottom: '0.5px solid var(--border)', fontSize: 12, fontWeight: 500, color: 'var(--txt2)' }}>
          <span>Date</span><span>Type</span><span>Entry</span><span>Exit</span><span>Lots</span><span>P&L</span>
        </div>
        {TRADES.map((t, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 56px 72px 72px 52px 80px', gap: 8, padding: '9px 0', borderBottom: '0.5px solid var(--border)', fontSize: 13, alignItems: 'center' }}>
            <span style={{ color: 'var(--txt2)' }}>{t.date}</span>
            <span className={`signal-badge ${t.type === 'BUY' ? 'badge-buy' : 'badge-sell'}`} style={{ fontSize: 11, padding: '2px 6px' }}>{t.type}</span>
            <span>{t.entry.toFixed(1)}</span>
            <span>{t.exit.toFixed(1)}</span>
            <span style={{ color: 'var(--txt2)' }}>{t.lots}</span>
            <span style={{ fontWeight: 500, color: t.pnl >= 0 ? 'var(--pnl-green)' : 'var(--pnl-red)' }}>
              {t.pnl >= 0 ? '+' : ''}${t.pnl}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
