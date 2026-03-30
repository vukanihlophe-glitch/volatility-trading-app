'use client'

import { useRef, useEffect, useCallback } from 'react'

function ema(arr: number[], n: number): number[] {
  const k = 2 / (n + 1)
  let e = arr[0]
  return arr.map(v => { e = v * k + e * (1 - k); return e })
}

export default function ChartTab() {
  const mainRef  = useRef<HTMLCanvasElement>(null)
  const stochRef = useRef<HTMLCanvasElement>(null)
  const ema14Ref = useRef<HTMLSpanElement>(null)
  const ema50Ref = useRef<HTMLSpanElement>(null)
  const stochRef2 = useRef<HTMLSpanElement>(null)
  const crossRef = useRef<HTMLSpanElement>(null)
  const zoneRef  = useRef<HTMLSpanElement>(null)

  const draw = useCallback(() => {
    const mc = mainRef.current
    const sc = stochRef.current
    if (!mc || !sc) return

    mc.width  = mc.parentElement?.clientWidth  ?? 600
    mc.height = mc.parentElement?.clientHeight ?? 200
    sc.width  = sc.parentElement?.clientWidth  ?? 600
    sc.height = sc.parentElement?.clientHeight ?? 100

    const ctx  = mc.getContext('2d')!
    const sctx = sc.getContext('2d')!
    const W = mc.width, H = mc.height
    const SW = sc.width, SH = sc.height
    const N = 40

    let price = 6200 + Math.random() * 100
    const closes: number[] = [], highs: number[] = [], lows: number[] = [], opens: number[] = []
    for (let i = 0; i < N; i++) {
      const o = price
      const change = (Math.random() - 0.48) * 30
      const c = o + change
      const h = Math.max(o, c) + Math.random() * 10
      const l = Math.min(o, c) - Math.random() * 10
      opens.push(o); closes.push(c); highs.push(h); lows.push(l)
      price = c
    }

    const minP = Math.min(...lows), maxP = Math.max(...highs)
    const pY = (p: number) => H - ((p - minP) / (maxP - minP)) * (H - 20) - 10
    const cw = W / N

    ctx.clearRect(0, 0, W, H)

    for (let i = 0; i < N; i++) {
      const x = i * cw + cw * 0.3
      const bw = cw * 0.4
      const isUp = closes[i] >= opens[i]
      ctx.strokeStyle = isUp ? '#1D9E75' : '#D85A30'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(x + bw / 2, pY(highs[i])); ctx.lineTo(x + bw / 2, pY(lows[i])); ctx.stroke()
      ctx.fillStyle = isUp ? '#9FE1CB' : '#F5C4B3'
      const top = pY(Math.max(opens[i], closes[i]))
      const barH = Math.abs(pY(opens[i]) - pY(closes[i])) || 1
      ctx.fillRect(x, top, bw, barH)
      ctx.strokeRect(x, top, bw, barH)
    }

    const ema14 = ema(closes, 14)
    const ema50 = ema(closes, 50)

    const drawLine = (data: number[], color: string) => {
      ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.beginPath()
      data.forEach((v, i) => {
        const x = i * cw + cw / 2
        const y = pY(v)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.stroke()
    }
    drawLine(ema14, '#1D9E75')
    drawLine(ema50, '#D85A30')

    const stoch = closes.map((c, i) => {
      const slice = closes.slice(Math.max(0, i - 13), i + 1)
      const lo = Math.min(...slice), hi = Math.max(...slice)
      return hi === lo ? 50 : ((c - lo) / (hi - lo)) * 100
    })
    const stochEma = ema(stoch, 10)
    const sY = (v: number) => SH - (v / 100) * SH

    sctx.clearRect(0, 0, SW, SH)
    sctx.strokeStyle = 'rgba(29,158,117,0.3)'; sctx.lineWidth = 0.5
    sctx.beginPath(); sctx.moveTo(0, sY(20)); sctx.lineTo(SW, sY(20)); sctx.stroke()
    sctx.strokeStyle = 'rgba(216,90,48,0.3)'
    sctx.beginPath(); sctx.moveTo(0, sY(80)); sctx.lineTo(SW, sY(80)); sctx.stroke()

    sctx.strokeStyle = '#444'; sctx.lineWidth = 1.5; sctx.beginPath()
    stochEma.forEach((v, i) => {
      const x = i * (SW / N) + (SW / N) / 2
      i === 0 ? sctx.moveTo(x, sY(v)) : sctx.lineTo(x, sY(v))
    })
    sctx.stroke()

    const last14 = ema14[ema14.length - 1]
    const last50 = ema50[ema50.length - 1]
    const lastS  = stochEma[stochEma.length - 1]

    if (ema14Ref.current)  ema14Ref.current.textContent  = last14.toFixed(1)
    if (ema50Ref.current)  ema50Ref.current.textContent  = last50.toFixed(1)
    if (stochRef2.current) stochRef2.current.textContent = lastS.toFixed(1)

    const bull = last14 > last50
    if (crossRef.current) {
      crossRef.current.textContent = bull ? 'Bullish' : 'Bearish'
      crossRef.current.className   = `signal-badge ${bull ? 'badge-buy' : 'badge-sell'}`
    }
    if (zoneRef.current) {
      if (lastS < 20)      { zoneRef.current.textContent = `Oversold (${lastS.toFixed(1)})`;   zoneRef.current.className = 'signal-badge badge-buy' }
      else if (lastS > 80) { zoneRef.current.textContent = `Overbought (${lastS.toFixed(1)})`; zoneRef.current.className = 'signal-badge badge-sell' }
      else                 { zoneRef.current.textContent = `Neutral (${lastS.toFixed(1)})`;    zoneRef.current.className = 'signal-badge badge-wait' }
    }
  }, [])

  useEffect(() => { draw() }, [draw])

  const Dot = ({ color }: { color: string }) => (
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 6 }} />
  )

  return (
    <div className="card">
      <div className="section-title">Price + EMA 14 / EMA 50</div>
      <div style={{ position: 'relative', height: 200, background: 'var(--bg2)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 12 }}>
        <canvas ref={mainRef} style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="section-title">Stochastic Oscillator (EMA 10 applied)</div>
      <div style={{ position: 'relative', height: 100, background: 'var(--bg2)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 12 }}>
        <canvas ref={stochRef} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, height: '0.5px', background: 'rgba(216,90,48,0.4)' }} />
        <div style={{ position: 'absolute', top: '80%', left: 0, right: 0, height: '0.5px', background: 'rgba(29,158,117,0.4)' }} />
        <span style={{ position: 'absolute', top: '18%', right: 8, fontSize: 10, color: 'var(--txt3)' }}>80</span>
        <span style={{ position: 'absolute', top: '80%', right: 8, fontSize: 10, color: 'var(--txt3)' }}>20</span>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: 'var(--txt2)' }}><Dot color="#1D9E75" /> EMA 14: <strong ref={ema14Ref}>—</strong></span>
        <span style={{ fontSize: 12, color: 'var(--txt2)' }}><Dot color="#D85A30" /> EMA 50: <strong ref={ema50Ref}>—</strong></span>
        <span style={{ fontSize: 12, color: 'var(--txt2)' }}><Dot color="#444" /> Stoch EMA10: <strong ref={stochRef2}>—</strong></span>
        <span ref={crossRef} className="signal-badge badge-wait" style={{ fontSize: 12 }}>—</span>
        <span ref={zoneRef}  className="signal-badge badge-wait" style={{ fontSize: 12 }}>—</span>
      </div>

      <button className="btn-primary" style={{ maxWidth: 220 }} onClick={draw}>
        Generate New Candles
      </button>
    </div>
  )
}
