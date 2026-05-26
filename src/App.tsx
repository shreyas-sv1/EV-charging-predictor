import React, { useState, useCallback } from 'react';
import './App.css';
import SliderInput from './components/SliderInput';
import ToggleGroup from './components/ToggleGroup';
import DemandGauge from './components/DemandGauge';
import HourlyChart from './components/HourlyChart';
import FeatureChart from './components/FeatureChart';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { predict, CLUSTERS } from './utils/prediction';
import type { PredictionInputs, PredictionResult } from './utils/prediction';

const DEFAULT_INPUTS: PredictionInputs = {
  station_load: 60,
  time_slot_index: 1,
  traffic_density_index: 0.5,
  hour_of_day: 9,
  renewable_energy_ratio: 35,
};

function App() {
  const [inputs, setInputs] = useState<PredictionInputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'analytics'>('results');
  const [predictCount, setPredictCount] = useState(0);

  const set = (key: keyof PredictionInputs) => (val: number) =>
    setInputs((prev) => ({ ...prev, [key]: val }));

  const handlePredict = useCallback(() => {
    setIsLoading(true);
    // Simulate model inference delay
    setTimeout(() => {
      const res = predict(inputs);
      setResult(res);
      setIsLoading(false);
      setPredictCount((c) => c + 1);
    }, 600);
  }, [inputs]);

  const resultColor = result?.color ?? '#00e5ff';

  return (
    <div className="app-root">
      {/* Header */}
      <header className="app-header">
        <div className="header-glow" />
        <div className="header-inner">
          <div className="header-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div>
              <h1 className="header-title">EV Charging Demand Predictor</h1>
              <p className="header-subtitle">Apache PySpark MLlib · Random Forest · Big Data Analytics</p>
            </div>
          </div>
          <div className="header-chips">
            <div className="chip">
              <div className="chip-dot" style={{ background: '#00e676' }} />
              R² = 0.9861
            </div>
            <div className="chip">
              <div className="chip-dot" style={{ background: '#00e5ff' }} />
              100 Trees · Depth 10
            </div>
            <div className="chip">
              <div className="chip-dot" style={{ background: '#7c3aed' }} />
              8,354 Records
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="app-main">
        {/* ===== LEFT COLUMN: Input Form ===== */}
        <section className="col-inputs panel">
          <div className="section-header">
            <div className="section-icon" style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--accent-cyan)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
            </div>
            <h2 className="section-title">Prediction Parameters</h2>
            <span className="section-badge">5 Key Features</span>
          </div>

          {/* Weight coverage note */}
          <div className="weight-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            These 5 features account for <strong>98.8%</strong> of the model's predictive weight
          </div>

          <div className="inputs-grid">
            {/* Station Load — #1 weight: 0.535 */}
            <div className="input-row">
              <SliderInput id="station_load" label="Station Load" min={0} max={100} value={inputs.station_load}
                unit="%" badge="w: 0.535" badgeColor="#00e676" onChange={set('station_load')} />
            </div>

            {/* Time Slot — #2 weight: 0.208 */}
            <div className="input-row">
              <label className="field-label">Time Slot <span className="field-badge" style={{ borderColor: '#00e5ff', color: '#00e5ff' }}>w: 0.208</span></label>
              <ToggleGroup
                options={[{ label: 'Off-Peak', value: 0 }, { label: 'Peak', value: 1 }]}
                value={inputs.time_slot_index}
                onChange={set('time_slot_index')}
                activeColor="#00e5ff"
              />
            </div>

            {/* Traffic Density — #3 weight: 0.168 */}
            <div className="input-row">
              <label className="field-label">Traffic Density <span className="field-badge" style={{ borderColor: '#2979ff', color: '#2979ff' }}>w: 0.168</span></label>
              <ToggleGroup
                options={[
                  { label: 'Low', value: 0 },
                  { label: 'Medium', value: 0.5 },
                  { label: 'High', value: 1 },
                ]}
                value={inputs.traffic_density_index}
                onChange={set('traffic_density_index')}
                activeColor="#2979ff"
              />
            </div>

            {/* Hour of Day — #4 weight: 0.052 */}
            <div className="input-row">
              <SliderInput id="hour_of_day" label="Hour of Day" min={0} max={23} value={inputs.hour_of_day}
                badge="w: 0.052" badgeColor="#7c3aed" onChange={set('hour_of_day')} />
            </div>

            {/* Renewable Ratio — #5 weight: 0.025 */}
            <div className="input-row">
              <SliderInput id="renewable_energy_ratio" label="Renewable Energy Ratio" min={0} max={100} value={inputs.renewable_energy_ratio}
                unit="%" badge="w: 0.025" badgeColor="#ff9100" onChange={set('renewable_energy_ratio')} />
            </div>
          </div>

          <button
            className={`predict-btn ${isLoading ? 'loading' : ''}`}
            onClick={handlePredict}
            disabled={isLoading}
          >
            {isLoading ? (
              <><div className="btn-spinner" /> Running Model Inference…</>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Run Prediction
              </>
            )}
          </button>
          {predictCount > 0 && (
            <p className="predict-hint">Prediction #{predictCount} complete</p>
          )}
        </section>

        {/* ===== RIGHT COLUMN: Results ===== */}
        <section className="col-results">
          {/* Tabs */}
          <div className="tabs">
            <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
              Model Results
            </button>
            <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
              Analytics
            </button>
          </div>

          {activeTab === 'results' && (
            <div className="results-content">
              {/* Gauge + Metrics */}
              <div className="results-top panel">
                <div className="gauge-section">
                  <div className="results-section-label">Predicted Charging Demand</div>
                  {result ? (
                    <DemandGauge
                      demand={result.demand}
                      color={result.color}
                      level={result.level}
                      confidence={result.confidence}
                    />
                  ) : (
                    <div className="empty-gauge">
                      <div className="empty-gauge-ring" />
                      <p>Click "Run Prediction"</p>
                    </div>
                  )}
                </div>

                <div className="metrics-section">
                  <div className="results-section-label">Model Metrics</div>
                  <div className="metrics-grid">
                    {[
                      { label: 'R² Score', val: '0.9861', color: '#00e676', desc: 'Variance explained' },
                      { label: 'MAE', val: '2.74', color: '#00e5ff', desc: 'Mean Absolute Error' },
                      { label: 'RMSE', val: '3.26', color: '#2979ff', desc: 'Root Mean Sq Error' },
                      { label: 'Trees', val: '100', color: '#7c3aed', desc: 'Random Forest estimators' },
                    ].map((m) => (
                      <div key={m.label} className="metric-card">
                        <div className="metric-val" style={{ color: m.color }}>{m.val}</div>
                        <div className="metric-label">{m.label}</div>
                        <div className="metric-desc">{m.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* K-Means Clusters */}
              <div className="clusters-panel panel">
                <div className="results-section-label">K-Means Cluster Assignment (k=4)</div>
                <div className="clusters-grid">
                  {CLUSTERS.map((cl) => {
                    const isActive = result?.cluster === cl.id;
                    return (
                      <div
                        key={cl.id}
                        className={`cluster-card ${isActive ? 'active' : ''}`}
                        style={isActive ? {
                          borderColor: cl.color,
                          boxShadow: `0 0 18px ${cl.color}33`,
                          background: `${cl.color}08`,
                        } : {}}
                      >
                        <div className="cluster-icon">{cl.icon}</div>
                        <div className="cluster-info">
                          <div className="cluster-label" style={isActive ? { color: cl.color } : {}}>{cl.label}</div>
                          <div className="cluster-pct">{cl.pct}% of sessions</div>
                        </div>
                        <div className="cluster-id" style={isActive ? { color: cl.color } : {}}>#{cl.id}</div>
                        {isActive && <div className="cluster-match-badge" style={{ background: cl.color }}>✓ Match</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feature Importance */}
              <div className="panel">
                <div className="results-section-label">RF Feature Importances</div>
                <FeatureChart />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-content">
              <AnalyticsDashboard />
            </div>
          )}
        </section>
      </main>

      {/* Hourly Chart — full width */}
      <section className="hourly-section panel">
        <div className="section-header">
          <div className="section-icon" style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--accent-cyan)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <h2 className="section-title">24-Hour Demand Trend</h2>
          {result && (
            <span className="section-badge" style={{ background: `${resultColor}22`, color: resultColor, borderColor: `${resultColor}66` }}>
              Hour {inputs.hour_of_day}: {result.demand.toFixed(1)} units
            </span>
          )}
        </div>
        <HourlyChart
          selectedHour={inputs.hour_of_day}
          predictedDemand={result?.demand ?? null}
          demandColor={resultColor}
        />
      </section>

      <footer className="app-footer">
        <p>EV Charging Demand Predictor · Built on Apache PySpark MLlib · RandomForestRegressor (100 trees, maxDepth=10, seed=42) · Dataset: ev_usage.xlsx (8,354 rows)</p>
      </footer>
    </div>
  );
}

export default App;
