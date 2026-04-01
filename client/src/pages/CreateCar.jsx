import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PCVisualizer from '../components/PCVisualizer'
import { getAllComponents } from '../services/ComponentsAPI'
import { createBuild } from '../services/BuildsAPI'
import { calculateTotal, formatPrice } from '../utilities/calcPrice'
import { validateBuild } from '../utilities/validation'
import '../App.css'

const COMPONENT_TYPES = [
  { key: 'cpu', label: 'CPU', icon: '⚡' },
  { key: 'motherboard', label: 'Motherboard', icon: '🔌' },
  { key: 'gpu', label: 'GPU', icon: '🎮' },
  { key: 'ram', label: 'RAM', icon: '💾' },
  { key: 'storage', label: 'Storage', icon: '💿' },
  { key: 'case', label: 'Case', icon: '🖥️' },
]

const SpecsList = ({ specs }) => {
  if (!specs) return null
  return (
    <ul className="specs-list">
      {Object.entries(specs).map(([k, v]) => (
        <li key={k}><span className="spec-key">{k.replace(/_/g, ' ')}</span><span className="spec-val">{String(v)}</span></li>
      ))}
    </ul>
  )
}

const CreateCar = () => {
  const navigate = useNavigate()
  const [components, setComponents] = useState({})
  const [selected, setSelected] = useState({
    cpu: null, motherboard: null, gpu: null, ram: null, storage: null, case: null
  })
  const [buildName, setBuildName] = useState('')
  const [activeTab, setActiveTab] = useState('cpu')
  const [errors, setErrors] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const all = await getAllComponents()
        const grouped = {}
        all.forEach(c => {
          if (!grouped[c.type]) grouped[c.type] = []
          grouped[c.type].push(c)
        })
        setComponents(grouped)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchComponents()
  }, [])

  const handleSelect = (type, component) => {
    setSelected(prev => ({ ...prev, [type]: component }))
    setErrors([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!buildName.trim()) {
      setErrors(['Please enter a name for your build.'])
      return
    }
    const validationErrors = validateBuild(selected)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    setSubmitting(true)
    try {
      const result = await createBuild({
        build_name: buildName.trim(),
        cpu_id: selected.cpu.id,
        gpu_id: selected.gpu.id,
        ram_id: selected.ram.id,
        storage_id: selected.storage.id,
        case_id: selected.case.id,
        motherboard_id: selected.motherboard.id,
      })
      navigate(`/customcars/${result.id}`)
    } catch (err) {
      setErrors([err.message])
    } finally {
      setSubmitting(false)
    }
  }

  const total = calculateTotal(selected)
  const completedCount = Object.values(selected).filter(Boolean).length

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>Loading components...</p>
      </div>
    )
  }

  return (
    <div className="builder-page">
      <div className="builder-left">
        <div className="visualizer-card">
          <h2 className="visualizer-title">PC Preview</h2>
          <PCVisualizer
            selectedCase={selected.case}
            selectedGpu={selected.gpu}
            selectedRam={selected.ram}
          />
          <div className="price-display">
            <span className="price-label">Estimated Total</span>
            <span className="price-value">{formatPrice(total)}</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${(completedCount / 6) * 100}%` }} />
            </div>
            <span className="progress-label">{completedCount}/6 components selected</span>
          </div>
        </div>

        {/* Selected summary */}
        <div className="selected-summary">
          {COMPONENT_TYPES.map(({ key, label, icon }) => (
            <div key={key} className={`summary-row ${selected[key] ? 'selected' : 'empty'}`}>
              <span className="summary-icon">{icon}</span>
              <span className="summary-label">{label}</span>
              <span className="summary-name">{selected[key]?.name || '—'}</span>
              <span className="summary-price">{selected[key] ? formatPrice(selected[key].price) : ''}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="builder-right">
        <div className="builder-header">
          <h1 className="builder-title">Build Your PC</h1>
          <p className="builder-subtitle">Select components to customize your perfect machine</p>
        </div>

        <div className="component-tabs">
          {COMPONENT_TYPES.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`tab-btn ${activeTab === key ? 'active' : ''} ${selected[key] ? 'done' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <span>{icon}</span>
              <span>{label}</span>
              {selected[key] && <span className="tab-check">✓</span>}
            </button>
          ))}
        </div>

        <div className="component-grid">
          {(components[activeTab] || []).map(comp => (
            <div
              key={comp.id}
              className={`component-card ${selected[activeTab]?.id === comp.id ? 'selected' : ''}`}
              onClick={() => handleSelect(activeTab, comp)}
            >
              <div className="component-card-header">
                <span className="component-name">{comp.name}</span>
                {comp.brand && (
                  <span className={`brand-badge brand-${comp.brand}`}>{comp.brand.toUpperCase()}</span>
                )}
              </div>
              <SpecsList specs={comp.specs} />
              <div className="component-card-footer">
                <span className="component-price">{formatPrice(comp.price)}</span>
                {selected[activeTab]?.id === comp.id && (
                  <span className="selected-badge">Selected</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {errors.length > 0 && (
          <div className="error-box">
            {errors.map((err, i) => (
              <p key={i} className="error-msg">{err}</p>
            ))}
          </div>
        )}

        <form className="build-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="build-name" className="form-label">Build Name</label>
            <input
              id="build-name"
              type="text"
              className="form-input"
              placeholder="e.g. Gaming Beast, Workstation Pro..."
              value={buildName}
              onChange={e => setBuildName(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Saving Build...' : 'Save Build'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateCar
