import React, { useState, useEffect } from 'react'
import AppShell from './components/AppShell'

// Existing pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AIQuery from './pages/AIQuery'
import Recommendations from './pages/Recommendations'
import ExportReport from './pages/ExportReport'
import Landing from './LandingPage/Landing.jsx'

// NEW components
import HomePage from './components/HomePage'
import LinkedInConnect from './components/LinkedInConnect'
import CompanyTables from './components/CompanyTables'
import CompanyDashboard from './components/CompanyDashboard'
import CompanyCards from './components/CompanyCards'
import LinkedInDashboard from './components/LinkedInDashboard'
import EngagementAnalysis from './components/EngagementAnalysis'
import CompanyAnalysis from './components/CompanyAnalysis'

import './styles/App.css'

const INITIAL_SCREEN = 'landing'
const VALID_SCREENS = new Set([
  'landing',
  'login',
  'dashboard',
  'ai-query',
  'recommendations',
  'export',
  'home',
  'linkedin-connect',
  'company-tables',
  'company-dashboard',
  'company-cards',
  'linkedin-dashboard',
  'engagement-analysis',
  'company-analysis'
])

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

const normalizeScreen = (screen) =>
  VALID_SCREENS.has(screen) ? screen : INITIAL_SCREEN

const readInitialScreen = () =>
  normalizeScreen(readStorageValue('currentScreen') || INITIAL_SCREEN)

const readInitialHistory = (currentScreen) => {
  const saved = readJsonStorage('screenHistory', [currentScreen])
  const history = Array.isArray(saved)
    ? saved.filter((screen) => VALID_SCREENS.has(screen))
    : []

  if (history.length === 0) return [currentScreen]
  if (history[history.length - 1] !== currentScreen) {
    return [currentScreen]
  }

  return history
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
    if (prevProps.screen !== this.props.screen && this.state.hasError) {
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

function ScreenView({
  currentScreen,
  navigateTo,
  goBack,
  connectedPlatforms,
  setConnectedPlatforms,
  companies,
  setCompanies,
  selectedCompany,
  setSelectedCompany
}) {
  switch (currentScreen) {
    case 'landing':
      return <Landing onNavigate={navigateTo} />

    case 'login':
      return (
        <Login
          onConnect={(platforms) => {
            setConnectedPlatforms(platforms)
            navigateTo('home')
          }}
          onBack={goBack}
        />
      )

    case 'dashboard':
      return (
        <Dashboard
          onNavigate={navigateTo}
          onBack={goBack}
          connectedPlatforms={connectedPlatforms}
        />
      )

    case 'ai-query':
      return <AIQuery onNavigate={navigateTo} onBack={goBack} connectedPlatforms={connectedPlatforms} />

    case 'recommendations':
      return <Recommendations onNavigate={navigateTo} onBack={goBack} connectedPlatforms={connectedPlatforms} />

    case 'export':
      return <ExportReport onNavigate={navigateTo} onBack={goBack} />

    case 'home':
      return <HomePage onNavigate={navigateTo} onBack={goBack} onConnect={(platforms) => setConnectedPlatforms(platforms)} />

    case 'linkedin-connect':
      return <LinkedInConnect onNavigate={navigateTo} onBack={goBack} onSetCompanies={setCompanies} />

    case 'company-tables':
      return <CompanyTables companies={companies} onNavigate={navigateTo} onBack={goBack} />

    case 'company-dashboard':
      return <CompanyDashboard onNavigate={navigateTo} onBack={goBack} />

    case 'company-cards':
      return <CompanyCards onNavigate={navigateTo} onBack={goBack} />

    case 'linkedin-dashboard':
      return <LinkedInDashboard onNavigate={navigateTo} onBack={goBack} />

    case 'engagement-analysis':
      return <EngagementAnalysis onNavigate={navigateTo} onBack={goBack} selectedCompany={selectedCompany} />

    case 'company-analysis':
      return <CompanyAnalysis onNavigate={navigateTo} onBack={goBack} companies={companies} onSetSelectedCompany={setSelectedCompany} />

    default:
      return <Landing onNavigate={navigateTo} />
  }
}

function App() {
  const [currentScreen, setCurrentScreen] = useState(() => {
    return readInitialScreen()
  })
  const [screenHistory, setScreenHistory] = useState(() => {
    return readInitialHistory(currentScreen)
  })
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
    writeStorageValue('currentScreen', currentScreen)
  }, [currentScreen])

  useEffect(() => {
    writeStorageValue('screenHistory', JSON.stringify(screenHistory))
  }, [screenHistory])

  useEffect(() => {
    writeStorageValue('connectedPlatforms', JSON.stringify(connectedPlatforms))
  }, [connectedPlatforms])

  useEffect(() => {
    writeStorageValue('companies', JSON.stringify(companies))
  }, [companies])

  const navigateTo = (screen) => {
    const nextScreen = normalizeScreen(screen)
    setScreenHistory(prev => {
      const history = Array.isArray(prev)
        ? prev.filter((item) => VALID_SCREENS.has(item))
        : [currentScreen]

      return [...history, nextScreen]
    })
    setCurrentScreen(nextScreen)
  }

  const goBack = () => {
    const history = Array.isArray(screenHistory)
      ? screenHistory.filter((screen) => VALID_SCREENS.has(screen))
      : []

    if (history.length > 1) {
      const newHistory = [...history]
      newHistory.pop()
      setScreenHistory(newHistory)
      setCurrentScreen(newHistory[newHistory.length - 1])
      return
    }

    setScreenHistory([INITIAL_SCREEN])
    setCurrentScreen(INITIAL_SCREEN)
  }

  return (
    <div className="app">
      <ScreenErrorBoundary screen={currentScreen} onReset={() => navigateTo(INITIAL_SCREEN)}>
        <ScreenView
          currentScreen={currentScreen}
          navigateTo={navigateTo}
          goBack={goBack}
          connectedPlatforms={connectedPlatforms}
          setConnectedPlatforms={setConnectedPlatforms}
          companies={companies}
          setCompanies={setCompanies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
        />
      </ScreenErrorBoundary>
    </div>
  )
}

export default App
