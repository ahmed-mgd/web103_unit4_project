import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import PCVisualizer from '../components/PCVisualizer'
import { getBuildById, deleteBuild } from '../services/BuildsAPI'
import { formatPrice } from '../utilities/calcPrice'
import '../App.css'

const COMPONENT_ROWS = [
  { key: 'cpu',         label: 'CPU',         icon: '⚡', specsKey: 'cpu_specs',         idKey: 'cpu_id',         priceKey: 'cpu_price',         nameKey: 'cpu_name'         },
  { key: 'motherboard', label: 'Motherboard',  icon: '🔌', specsKey: 'motherboard_specs', idKey: 'motherboard_id', priceKey: 'motherboard_price', nameKey: 'motherboard_name' },
  { key: 'gpu',         label: 'GPU',          icon: '🎮', specsKey: 'gpu_specs',         idKey: 'gpu_id',         priceKey: 'gpu_price',         nameKey: 'gpu_name'         },
  { key: 'ram',         label: 'RAM',          icon: '💾', specsKey: 'ram_specs',         idKey: 'ram_id',         priceKey: 'ram_price',         nameKey: 'ram_name'         },
  { key: 'storage',     label: 'Storage',      icon: '💿', specsKey: 'storage_specs',     idKey: 'storage_id',     priceKey: 'storage_price',     nameKey: 'storage_name'     },
  { key: 'case',        label: 'Case',         icon: '🖥️', specsKey: 'case_specs',        idKey: 'case_id',        priceKey: 'case_price',        nameKey: 'case_name'        },
]

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [build, setBuild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const data = await getBuildById(id)
        setBuild(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBuild()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${build.build_name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await deleteBuild(id)
      navigate('/customcars')
    } catch (err) {
      alert('Failed to delete: ' + err.message)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>Loading build...</p>
      </div>
    )
  }

  if (!build) {
    return (
      <div className="page-loading">
        <p>Build not found.</p>
        <Link to="/customcars" className="new-build-btn">Back to Builds</Link>
      </div>
    )
  }

  const caseObj = {
    name: build.case_name,
    specs: build.case_specs,
    form_factor: build.case_form_factor,
  }
  const gpuObj = { name: build.gpu_name }
  const ramObj = { name: build.ram_name, specs: build.ram_specs }

  return (
    <div className="details-page">
      <div className="details-header">
        <div className="details-title-row">
          <Link to="/customcars" className="back-link">← All Builds</Link>
          <div className="details-actions">
            <Link to={`/edit/${id}`} className="btn-edit">Edit Build</Link>
            <button className="btn-delete" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Build'}
            </button>
          </div>
        </div>
        <h1 className="details-build-name">{build.build_name}</h1>
        <p className="details-date">
          Saved {new Date(build.created_at).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      <div className="details-body">
        <div className="details-left">
          <PCVisualizer
            selectedCase={caseObj}
            selectedGpu={gpuObj}
            selectedRam={ramObj}
          />
          <div className="total-price-card">
            <span className="total-label">Total Build Cost</span>
            <span className="total-amount">{formatPrice(build.total_price)}</span>
          </div>
        </div>

        <div className="details-right">
          <h2 className="components-title">Components</h2>
          <div className="components-table">
            {COMPONENT_ROWS.map(({ label, icon, specsKey, priceKey, nameKey }) => {
              const specs = build[specsKey]
              return (
                <div key={label} className="component-row">
                  <div className="comp-row-header">
                    <span className="comp-icon">{icon}</span>
                    <span className="comp-label">{label}</span>
                    <span className="comp-name">{build[nameKey]}</span>
                    <span className="comp-price">{formatPrice(build[priceKey])}</span>
                  </div>
                  {specs && (
                    <div className="comp-specs">
                      {Object.entries(specs).map(([k, v]) => (
                        <span key={k} className="comp-spec-tag">
                          <span className="spec-k">{k.replace(/_/g, ' ')}</span>: {String(v)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails
