'use client'

import { useState } from 'react'

type ConditionState = 'ok' | 'no' | 'wait'
type SignalType = 'BUY' | 'SELL' | 'WAITING'

interface Conditions {
  c1: ConditionState; c2: ConditionState; c3: ConditionState
  c4: ConditionState; c5: ConditionState; c6: ConditionState
}

const defaultConditions: Conditions = {
  c1: 'wait', c2: 'wait', c3: 'wait',
  c4: 'wait', c5: 'wait', c6: 'wait',
}

const CheckIcon = ({ state }: { state: ConditionState }) => {
  const styles: Record<ConditionState, React.CSSProperties> = {
    ok:   { background: '#E1F5EE', color: '#0F6E56' },
    no:   { background: '#FAECE7', color: '#993C1D' },
    wait: { background: 'var(--bg2)', color: 'var(--txt3)' },
  }
  return (
    <div style={{
      width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
      ...styles[state],
    }}>
      {state === 'ok' ? '✓' : state === 'no' ? '✗' : '?'}
    </div>
  )
}

export default function SignalsTab() {
  const [signal, setSignal]         = useState<SignalType>('WAITING')
  const [signalMsg, setSignalMsg]   = useState('No signal detected')
  const [conds, setConds]           = useState<Conditions>(defaultConditions)
  const [ema14]    = useState(6248.3)
  const [ema50]    = useState(6231.8)
  const [stochVal] = useState(34.2)

  function simulateSignal() {
    const scenarios = [
      { type: 'BUY'  as SignalType, c1:'ok', c2:'ok', c3:'ok', c4:'no', c5:'no', c6:'no', msg: 'All 3 buy conditions met — 15m candle' },
      { type: 'SELL' as SignalType, c1:'no', c2:'no', c3:'no', c4:'ok', c5:'ok', c6:'ok', msg: 'All 3 sell conditions met — 15m candle' },
      { type: 'WAITING' as SignalType, c1:'ok', c2:'no', c3:'no', c4:'no', c5:'no', c6:'no', msg: 'Confluence incomplete — stay out' },
    ] as const
    const s = scenarios[Math.floor(Math.random() * scenarios.length)]
    setSignal(s.type)
    setSignalMsg(s.msg)
    setConds({ c1: s.c1, c2: s.c2, c3: s.c3, c4: s.c4, c5: s.c5, c6: s.c6 } as Conditions)
  }

  const signalClass = signal === 'BUY' ? 'badge-buy' : signal === 'SELL' ? 'badge-sell' : 'badge-wait'

  const Dot = ({ color }: { color: string }) => (
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 6 }} />
  )

  return (
    <div className="grid2">
      <div className="card">
        <div className="section-title">Current Signal</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span className={`signal-badge ${signalClass}`}>{signal}</span>
          <span style={{ fontSize: 13, color: 'var(--txt2)' }}>{signalMsg}</span>
        </div>

        <div className="section-title" style={{ marginTop: 8 }}>Buy Conditions</div>
        {([
          ['c1', 'EMA 10 below 20 (oversold zone)'],
          ['c2', 'Market structure: CHoCH — broke prior Lower High'],
          ['c3', 'EMA 14 crossed above EMA 50 (Golden Cross)'],
        ] as [keyof Conditions, string][]).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', fontSize: 13 }}>
            <CheckIcon state={conds[key]} />
            <span style={{ color: 'var(--txt2)' }}>{label}</span>
          </div>
        ))}

        <div className="section-title" style={{ marginTop: 16 }}>Sell Conditions</div>
        {([
          ['c4', 'EMA 10 above 80 (overbought zone)'],
          ['c5', 'Market structure: price breaks prior Higher Low'],
          ['c6', 'EMA 14 crossed below EMA 50 (Death Cross)'],
        ] as [keyof Conditions, string][]).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', fontSize: 13 }}>
            <CheckIcon state={conds[key]} />
            <span style={{ color: 'var(--txt2)' }}>{label}</span>
          </div>
        ))}

        <button className="btn-primary" style={{ marginTop: 16 }} onClick={simulateSignal}>
          Simulate Signal Scan
        </button>
      </div>

      <div className="card">
        <div className="section-title">Indicator Status</div>
        {[
          { dot: '#1D9E75', label: 'EMA 14 (Main chart)', value: ema14.toFixed(1) },
          { dot: '#D85A30', label: 'EMA 50 (Main chart)', value: ema50.toFixed(1) },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid var(--border)', fontSize: 13 }}>
            <span><Dot color={row.dot} />{row.label}</span>
            <span style={{ fontWeight: 500 }}>{row.value}</span>
          </div>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid var(--border)', fontSize: 13 }}>
          <span><Dot color="#1D9E75" />EMA Cross</span>
          <span className="signal-badge badge-buy">Bullish</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid var(--border)', fontSize: 13 }}>
          <span><Dot color="#444" />Stoch EMA 10</span>
          <span style={{ fontWeight: 500 }}>{stochVal}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid var(--border)', fontSize: 13 }}>
          <span><Dot color="#1D9E75" />Stoch Zone</span>
          <span className="signal-badge badge-wait">Neutral ({stochVal})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', fontSize: 13 }}>
          <span><Dot color="var(--txt3)" />Market Structure</span>
          <span className="signal-badge badge-wait">Ranging</span>
        </div>

        <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius-md)', padding: 12, fontSize: 13, color: 'var(--txt2)', lineHeight: 1.6, marginTop: 16 }}>
          <strong style={{ color: 'var(--txt)' }}>Timeframe:</strong> 15-minute candles<br />
          <strong style={{ color: 'var(--txt)' }}>Asset:</strong> Volatility 75 Index (V75)<br />
          <strong style={{ color: 'var(--txt)' }}>Strategy:</strong> Triple confluence — Stoch zone + Structure + EMA cross
        </div>
      </div>
    </div>
  )
}
