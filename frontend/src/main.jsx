import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'

import { CurrencyProvider } from './components/utils/CurrencyContext'
import initNative from './native/initNative'

initNative()

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <CurrencyProvider>
        <App />
     </CurrencyProvider>
  </StrictMode>,
)
