import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VersionSelector from './VersionSelector.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VersionSelector />
  </StrictMode>,
)
