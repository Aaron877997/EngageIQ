import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell'

// Existing pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AIQuery from './pages/AIQuery'
import Recommendations from './pages/Recommendations'
import ExportReport from './pages/ExportReport'
import Landing from './LandingPage/Landing.jsx'

// Components
import HomePage from './components/HomePage'
import LinkedInConnect from './components/LinkedInConnect'
import CompanyTables from './components/CompanyTables'
import CompanyDashboard from './components/CompanyDashboard'
import CompanyCards from './components/CompanyCards'
import LinkedInDashboard from './components/LinkedInDashboard'
import EngagementAnalysis from './components/EngagementAnalysis'
import CompanyAnalysis from './components/CompanyAnalysis'

import './styles/App.css'

const ROUTE_MAP = {
  landing: '/',
  login: '/login',
  home: '/home',
  dashboard: '/dashboard',
  'ai-query': '/ai-query',
  recommendations: '/recommendations',
  export: '/export',
  'linkedin-connect': '/linkedin-connect',
  'company-tables': '/company-tables',
  'company-dashboard': '/company-dashboard',
  'company-cards': '/company-cards',
  'linkedin-dashboard': '/linkedin-dashboard',
  'engagement-analysis': '/engagement-analysis',
  'company-analysis': '/company-analysis',
}

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const readStorageValue = (key) => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn(`Unable to read localStorage key "${key}"`, error)
    return null
  }
}

const writeStorageValue = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.warn(`Unable to write localStorage key "${key}"`, error)
  }
}

const readJsonStorage = (key, fallback) => {
  const saved = readStorageValue(key)
  if (!saved) return fallback

  try {
    return JSON.parse(saved)
  } catch (error) {
    console.warn(`Ignoring malformed localStorage key "${key}"`, error)
    return fallback
  }
}

const readConnectedPlatforms = () => {
  const saved = readJsonStorage('connectedPlatforms', [])

  if (Array.isArray(saved)) {
    return saved.filter((platform) => typeof platform === 'string')
  }

  if (isPlainObject(saved)) {
    return Object.keys(saved).filter((key) => saved[key] === 'connected')
  }

  return []
}

const readCompanies = () => {
  const saved = readJsonStorage('companies', [])
  return Array.isArray(saved) ? saved : []
}

const readSelectedCompany = () => {
  const saved = readJsonStorage('selectedCompany', null)
  return isPlainObject(saved) ? saved : null
}

class ScreenErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Screen render failed', error, info)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location?.pathname !== this.props.location?.pathname && this.state.hasError) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="screen-fallback">
          <AppShell size="sm">
            <div className="app-shell__body screen-fallback__panel">
              <h1>EngageIQ</h1>
              <p>We could not restore that screen, so start from the landing page.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  this.props.onReset()
                }}
              >
                Go to Landing
              </button>
            </div>
          </AppShell>
        </div>
      )
    }

    return this.props.children
  }
}

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()

  const [connectedPlatforms, setConnectedPlatforms] = useState(() => {
    return readConnectedPlatforms()
  })
  const [companies, setCompanies] = useState(() => {
    return readCompanies()
  })
  const [selectedCompany, setSelectedCompany] = useState(() => {
    return readSelectedCompany()
  })

  useEffect(() => {
    writeStorageValue('connectedPlatforms', JSON.stringify(connectedPlatforms))
  }, [connectedPlatforms])

  useEffect(() => {
    writeStorageValue('companies', JSON.stringify(companies))
  }, [companies])

  useEffect(() => {
    writeStorageValue('selectedCompany', JSON.stringify(selectedCompany))
  }, [selectedCompany])

  const navigateTo = (screen, options = {}) => {
    if (typeof screen !== 'string') return
    const path = screen.startsWith('/') ? screen : (ROUTE_MAP[screen] || `/${screen}`)
    navigate(path, { state: options })
  }

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="app">
      <ScreenErrorBoundary location={location} onReset={() => navigate('/')}>
        <Routes>
          <Route path="/" element={<Landing onNavigate={navigateTo} />} />
          <Route
            path="/login"
            element={
              <Login
                onConnect={(platforms) => {
                  setConnectedPlatforms(platforms)
                  navigateTo('home')
                }}
                onBack={goBack}
              />
            }
          />
          <Route
            path="/home"
            element={
              <HomePage
                onNavigate={navigateTo}
                onBack={goBack}
                onConnect={(platforms) => setConnectedPlatforms(platforms)}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                onNavigate={navigateTo}
                onBack={goBack}
                connectedPlatforms={connectedPlatforms}
              />
            }
          />
          <Route
            path="/ai-query"
            element={
              <AIQuery
                onNavigate={navigateTo}
                onBack={goBack}
                connectedPlatforms={connectedPlatforms}
              />
            }
          />
          <Route
            path="/recommendations"
            element={
              <Recommendations
                onNavigate={navigateTo}
                onBack={goBack}
                connectedPlatforms={connectedPlatforms}
              />
            }
          />
          <Route
            path="/export"
            element={<ExportReport onNavigate={navigateTo} onBack={goBack} />}
          />
          <Route
            path="/linkedin-connect"
            element={
              <LinkedInConnect
                onNavigate={navigateTo}
                onBack={goBack}
                onSetCompanies={setCompanies}
              />
            }
          />
          <Route
            path="/company-tables"
            element={
              <CompanyTables
                companies={companies}
                onNavigate={navigateTo}
                onBack={goBack}
              />
            }
          />
          <Route
            path="/company-dashboard"
            element={<CompanyDashboard onNavigate={navigateTo} onBack={goBack} />}
          />
          <Route
            path="/company-cards"
            element={<CompanyCards onNavigate={navigateTo} onBack={goBack} />}
          />
          <Route
            path="/linkedin-dashboard"
            element={<LinkedInDashboard onNavigate={navigateTo} onBack={goBack} />}
          />
          <Route
            path="/engagement-analysis"
            element={
              <EngagementAnalysis
                onNavigate={navigateTo}
                onBack={goBack}
                selectedCompany={selectedCompany}
              />
            }
          />
          <Route
            path="/company-analysis"
            element={
              <CompanyAnalysis
                onNavigate={navigateTo}
                onBack={goBack}
                companies={companies}
                onSetSelectedCompany={setSelectedCompany}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ScreenErrorBoundary>
    </div>
  )
}

function App() {
  return <AppContent />
}

export default App
