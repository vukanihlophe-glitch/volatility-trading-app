'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

const PLANS = {
  Free:  { price: 0,  features: ['Position calculator', 'Basic signal alerts', '1 watchlist asset', 'Community access'] },
  Pro:   { price: 19, features: ['Full signal engine (V25/V75/V100)', 'Live alerts + notifications', 'Trade journal + stats', 'Strategy backtesting', 'Advanced risk calculator'] },
  Elite: { price: 49, features: ['Everything in Pro', 'AI signal explanations', '1-on-1 strategy review', 'Custom indicator settings', 'White-label access'] },
} as const

type PlanName = keyof typeof PLANS

function detectCard(num: string): string {
  const n = num.replace(/\s/g, '')
  if (/^4/.test(n))        return 'VISA'
  if (/^5[1-5]/.test(n))   return 'MC'
  if (/^3[47]/.test(n))    return 'AMEX'
  if (/^6(?:011|5)/.test(n)) return 'DISC'
  return ''
}

function validateEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }

export default function CheckoutPage() {
  const [plan, setPlan]         = useState<PlanName>('Pro')
  const [name, setName]         = useState('')
  const [cardNum, setCardNum]   = useState('')
  const [expiry, setExpiry]     = useState('')
  const [cvv, setCvv]           = useState('')
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const [touched, setTouched]   = useState<Record<string, boolean>>({})

  const price   = PLANS[plan].price
  const fee     = price > 0 ? parseFloat((price * 0.029 + 0.30).toFixed(2)) : 0
  const total   = parseFloat((price + fee).toFixed(2))
  const cardType = detectCard(cardNum)

  const formatCardNum = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4)
    return digits.length >= 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits
  }

  const validate = useCallback(() => {
    const e: Record<string, string> = {}
    if (name.trim().length < 2)                     e.name    = 'Enter cardholder name'
    if (cardNum.replace(/\s/g, '').length < 15)     e.cardNum = 'Invalid card number'
    if (expiry.replace(/\D/g, '').length < 4)       e.expiry  = 'Invalid expiry'
    if (cvv.length < 3)                              e.cvv     = 'Invalid CVV'
    if (!validateEmail(email))                       e.email   = 'Invalid email address'
    return e
  }, [name, cardNum, expiry, cvv, email])

  const errs = validate()
  const isValid = Object.keys(errs).length === 0

  function blur(field: string) { setTouched(t => ({ ...t, [field]: true })) }
  function showErr(field: string) { return touched[field] ? errs[field] : '' }

  async function submit() {
    setTouched({ name: true, cardNum: true, expiry: true, cvv: true, email: true })
    setErrors(errs)
    if (!isValid) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setSuccess(true)
  }

  const nextBill = new Date()
  nextBill.setMonth(nextBill.getMonth() + 1)

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ maxWidth: 380, width: '100%', textAlign: 'center', padding: '2rem' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L19 7" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Payment successful</h2>
        <p style={{ fontSize: 13, color: 'var(--txt2)', lineHeight: 1.7, marginBottom: 20 }}>
          Your <strong>{plan}</strong> plan is now active. A receipt has been sent to <span style={{ color: 'var(--accent)' }}>{email}</span>.
        </p>
        <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius-md)', padding: 12, fontSize: 13, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: 'var(--txt2)' }}>Amount charged</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--txt2)' }}>Next billing</span>
            <strong>{nextBill.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
          </div>
        </div>
        <Link href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'block', padding: 12, textAlign: 'center', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: 'white', fontWeight: 500, fontSize: 14 }}>
          Go to dashboard
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '24px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>← Back</Link>
          <h1 style={{ fontSize: 20, fontWeight: 500 }}>Subscribe to V75 Trading</h1>
        </div>

        <div className="grid2">
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-title">Choose your plan</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                {(Object.keys(PLANS) as PlanName[]).map(p => (
                  <div key={p} onClick={() => setPlan(p)} style={{
                    border: plan === p ? '1.5px solid var(--accent)' : '0.5px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '10px 8px', cursor: 'pointer',
                    textAlign: 'center', transition: 'all 0.15s',
                    background: plan === p ? '#E1F5EE' : 'var(--bg)',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: plan === p ? '#0F6E56' : 'var(--txt)' }}>{p}</div>
                    <div style={{ fontSize: 12, color: 'var(--txt2)', marginTop: 2 }}>
                      {PLANS[p].price === 0 ? 'Free' : `$${PLANS[p].price}/mo`}
                    </div>
                  </div>
                ))}
              </div>

              <div className="section-title">Order summary</div>
              {[
                { label: 'Plan',       value: <span style={{ background: '#E1F5EE', color: '#0F6E56', fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 500 }}>{plan}</span> },
                { label: 'Subtotal',   value: price === 0 ? 'Free' : `$${price.toFixed(2)}` },
                { label: 'Processing', value: `$${fee.toFixed(2)}` },
              ].map(row => (
                <div key={row.label} className="result-row">
                  <span className="result-label">{row.label}</span>
                  <span style={{ fontSize: 13 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontWeight: 500, fontSize: 15, borderTop: '0.5px solid var(--border2)', marginTop: 4 }}>
                <span>Total today</span>
                <span style={{ color: 'var(--accent)' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="card">
              <div className="section-title">What you get</div>
              {PLANS[plan].features.map(f => (
                <div key={f} style={{ fontSize: 13, color: 'var(--txt2)', padding: '4px 0', display: 'flex', gap: 8 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 500 }}>✓</span>{f}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-title">Payment details</div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {['VISA', 'MC', 'AMEX', 'DISC'].map(c => (
                <div key={c} style={{
                  padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 500,
                  border: '0.5px solid var(--border)',
                  background: cardType === c ? '#E1F5EE' : 'var(--bg2)',
                  color:      cardType === c ? '#0F6E56' : 'var(--txt2)',
                }}>{c}</div>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label>Cardholder name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} onBlur={() => blur('name')} placeholder="John Smith" className={touched.name ? (errs.name ? 'error' : 'valid') : ''} />
              {showErr('name') && <div className="err-msg">{showErr('name')}</div>}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label>Card number</label>
              <div style={{ position: 'relative' }}>
                <input type="text" value={cardNum} onChange={e => setCardNum(formatCardNum(e.target.value))} onBlur={() => blur('cardNum')} placeholder="1234 5678 9012 3456" maxLength={19} className={touched.cardNum ? (errs.cardNum ? 'error' : 'valid') : ''} />
                {cardType && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 500, color: 'var(--accent)' }}>{cardType}</span>}
              </div>
              {showErr('cardNum') && <div className="err-msg">{showErr('cardNum')}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <label>Expiry</label>
                <input type="text" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} onBlur={() => blur('expiry')} placeholder="MM / YY" maxLength={7} className={touched.expiry ? (errs.expiry ? 'error' : 'valid') : ''} />
                {showErr('expiry') && <div className="err-msg">{showErr('expiry')}</div>}
              </div>
              <div>
                <label>CVV</label>
                <input type="text" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} onBlur={() => blur('cvv')} placeholder="123" maxLength={4} className={touched.cvv ? (errs.cvv ? 'error' : 'valid') : ''} />
                {showErr('cvv') && <div className="err-msg">{showErr('cvv')}</div>}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>Email (receipt)</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => blur('email')} placeholder="you@email.com" className={touched.email ? (errs.email ? 'error' : 'valid') : ''} />
              {showErr('email') && <div className="err-msg">{showErr('email')}</div>}
            </div>

            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? 'Processing…' : price === 0 ? 'Activate free plan' : `Pay $${total.toFixed(2)} — activate ${plan}`}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 12 }}>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="var(--txt3)" strokeWidth="1" />
                <path d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="var(--txt3)" strokeWidth="1" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 11, color: 'var(--txt3)' }}>256-bit SSL — powered by Stripe</span>
            </div>

            <div style={{ marginTop: 16, padding: 12, background: 'var(--bg2)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--txt2)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--txt)' }}>To connect real payments:</strong> Replace this form with{' '}
              <a href="https://stripe.com/docs/stripe-js" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>Stripe Elements</a>
              {' '}or{' '}
              <a href="https://stripe.com/docs/payment-links" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>Stripe Payment Links</a>.
              Add your <code style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, background: 'var(--bg3)', padding: '1px 4px', borderRadius: 3 }}>NEXT_PUBLIC_STRIPE_KEY</code> to <code style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, background: 'var(--bg3)', padding: '1px 4px', borderRadius: 3 }}>.env.local</code>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
