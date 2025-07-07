import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import Timer from './Timer'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='timer-container'>
      <Timer/>
    </div>
    
  </StrictMode>,
)
