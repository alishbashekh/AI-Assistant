import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Toaster} from 'react-hot-toast';
import { Authprovider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authprovider>
      <Toaster position='top-right' toastOptions={{duration:3000}}/>
       <App />
    </Authprovider>
  </StrictMode>,
)
