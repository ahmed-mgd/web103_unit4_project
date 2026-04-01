import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAllBuilds, deleteBuild } from '../services/BuildsAPI'
import { formatPrice } from '../utilities/calcPrice'
import '../App.css'

const ViewCars = () => {
  const navigate = useNavigate()
  const [builds, setBuilds] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const fetchBuilds = async () => {
    try {
      const data = await getAllBuilds()
      setBuilds(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBuilds()
  }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await deleteBuild(id)
      setBuilds(prev => prev.filter(b => b.id !== id))
    } catch (err) {
      alert('Failed to delete build: ' + err.message)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>Loading builds...</p>
      </div>
    )
  }

  return (
    <div className="view-page">
      <div className="view-header">
        <div>
          <h1 className="page-title">Saved Builds</h1>
          <p className="page-subtitle">{builds.length} build{builds.length !== 1 ? 's' : ''} saved</p>
        </div>
        <Link to="/" className="new-build-btn">+ New Build</Link>
      </div>

      {builds.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🖥️</div>
          <h2>No builds yet</h2>
          <p>Create your first PC build to get started.</p>
          <Link to="/" className="new-build-btn">Build a PC</Link>
        </div>
      ) : (
        <div className="builds-grid">
          {builds.map(build => (
            <div key={build.id} className="build-card">
              <div className="build-card-header">
                <h3 className="build-name">{build.build_name}</h3>
                <span className="build-price">{formatPrice(build.total_price)}</span>
              </div>

              <div className="build-specs-preview">
                <div className="spec-row">
                  <span className="spec-icon">⚡</span>
                  <span className="spec-text">{build.cpu_name}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-icon">🎮</span>
                  <span className="spec-text">{build.gpu_name}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-icon">💾</span>
                  <span className="spec-text">{build.ram_name}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-icon">💿</span>
                  <span className="spec-text">{build.storage_name}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-icon">🔌</span>
                  <span className="spec-text">{build.motherboard_name}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-icon">🖥️</span>
                  <span className="spec-text">{build.case_name}</span>
                </div>
              </div>

              <div className="build-card-footer">
                <span className="build-date">
                  {new Date(build.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
                <div className="build-actions">
                  <Link to={`/customcars/${build.id}`} className="btn-view">View</Link>
                  <Link to={`/edit/${build.id}`} className="btn-edit">Edit</Link>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(build.id, build.build_name)}
                    disabled={deleting === build.id}
                  >
                    {deleting === build.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewCars
