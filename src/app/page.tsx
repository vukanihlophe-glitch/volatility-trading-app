'use client'

import { useState } from 'react'
import PlannerTab from './components/PlannerTab'
import SignalsTab from './components/SignalsTab'
import ChartTab from './components/ChartTab'
import JournalTab from './components/JournalTab'
import MonetizeTab from './components/MonetizeTab'

const TABS = ['Planner', 'Signals', 'Chart', 'Journal', 'Monetization'] as const
type Tab = typeof TABS[number]

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('Planner')

  return (
    <div className="app-shell">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>V75 Trading Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--txt2)' }}>Volatility 75 Index — 15-minute strategy engine</p>
      </div>

      <div style={{
        display: 'flex',
        gap: 4,
        borderBottom: '0.5px solid var(--border)',
        marginBottom: '1.5rem',
      }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              color: activeTab === tab ? 'var(--accent)' : 'var(--txt2)',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1,
              transition: 'all 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Planner'      && <PlannerTab />}
      {activeTab === 'Signals'      && <SignalsTab />}
      {activeTab === 'Chart'        && <ChartTab />}
      {activeTab === 'Journal'      && <JournalTab />}
      {activeTab === 'Monetization' && <MonetizeTab />}
    </div>
  )
}
