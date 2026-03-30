'use client'

import Link from 'next/link'

const PLANS = [
  {
    name: 'Free', price: 0, featured: false,
    features: ['Position calculator', 'Basic signal alerts', '1 watchlist asset', 'Community access'],
  },
  {
    name: 'Pro', price: 19, featured: true,
    features: ['Full signal engine (V25/V75/V100)', 'Live alerts + notifications', 'Trade journal + stats', 'Strategy backtesting', 'Advanced risk calculator'],
  },
  {
    name: 'Elite', price: 49, featured: false,
    features: ['Everything in Pro', 'AI signal explanations', '1-on-1 strategy review', 'Custom indicator settings', 'White-label access'],
  },
]

const ProgressBar = ({ pct, color = 'var(--accent)' }: { pct: number; color?: string }) => (
  <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden', marginTop: 8 }}>
    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: color }} />
  </div>
)

export default function MonetizeTab() {
  return (
    <div>
      <div className="grid3" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-card">
          <div className="metric-label">Total Users</div>
          <div className="metric-value">1,248</div>
          <ProgressBar pct={62} />
          <div className="metric-sub" style={{ marginTop: 4 }}>Goal: 2,000</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Monthly Revenue</div>
          <div className="metric-value" style={{ color: 'var(--accent)' }}>$3,720</div>
          <ProgressBar pct={74} color="var(--accent)" />
          <div className="metric-sub" style={{ marginTop: 4 }}>Goal: $5,000</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Premium Users</div>
          <div className="metric-value">186</div>
          <ProgressBar pct={38} color="#3B6D11" />
          <div className="metric-sub" style={{ marginTop: 4 }}>14.9% conversion</div>
        </div>
      </div>

      <div className="grid3" style={{ marginBottom: '1.5rem' }}>
        {PLANS.map(plan => (
          <div key={plan.name} style={{
            border: plan.featured ? '1.5px solid var(--accent)' : '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            background: 'var(--bg)',
          }}>
            {plan.featured && (
              <div style={{ background: '#E1F5EE', color: '#0F6E56', fontSize: 11, padding: '3px 8px', borderRadius: 'var(--radius-md)', fontWeight: 500, display: 'inline-block', marginBottom: 8 }}>
                Most popular
              </div>
            )}
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{plan.name}</div>
            <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 14 }}>
              {plan.price === 0 ? 'Free' : `$${plan.price}`}
              {plan.price > 0 && <span style={{ fontSize: 13, color: 'var(--txt2)', fontWeight: 400 }}>/mo</span>}
            </div>
            {plan.features.map(f => (
              <div key={f} style={{ fontSize: 13, color: 'var(--txt2)', padding: '4px 0', display: 'flex', gap: 6 }}>
                <span style={{ color: 'var(--accent)', fontWeight: 500 }}>✓</span>{f}
              </div>
            ))}
            <Link href="/checkout" style={{
              display: 'block', marginTop: 16, padding: '9px 0', textAlign: 'center',
              background: plan.featured ? 'var(--accent)' : 'transparent',
              color: plan.featured ? 'white' : 'var(--accent)',
              border: plan.featured ? 'none' : '0.5px solid var(--accent)',
              borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
              textDecoration: 'none', transition: 'opacity 0.15s',
            }}>
              {plan.price === 0 ? 'Get started free' : `Subscribe — $${plan.price}/mo`}
            </Link>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-title">Revenue Breakdown</div>
        {[
          { label: 'Pro subscribers (186 × $19)',  value: '+$3,534', pos: true },
          { label: 'Elite subscribers (3 × $49)',  value: '+$147',   pos: true },
          { label: 'Processing fees (est. 2.9%)',  value: '−$107',   pos: false },
          { label: 'Net monthly revenue',           value: '$3,574',  pos: true, bold: true },
        ].map(row => (
          <div key={row.label} className="result-row">
            <span className="result-label">{row.label}</span>
            <span className="result-value" style={{ fontSize: row.bold ? 17 : 15, color: row.pos ? 'var(--accent)' : 'var(--pnl-red)' }}>{row.value}</span>
          </div>
        ))}
        <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius-md)', padding: 12, fontSize: 13, color: 'var(--txt2)', lineHeight: 1.7, marginTop: 12 }}>
          <strong style={{ color: 'var(--txt)' }}>Payment integration:</strong> Connect Stripe — add your API keys from stripe.com,
          enable the recurring billing product, and point your checkout page to Stripe Elements or Stripe Payment Links.
          Handles card storage, PCI compliance, invoices, and refunds automatically.
        </div>
      </div>
    </div>
  )
}
