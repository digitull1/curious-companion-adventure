
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Mic } from 'lucide-react'

// Make Mic available globally as MicrophoneIcon for components that need it
window.MicrophoneIcon = Mic;

createRoot(document.getElementById("root")!).render(<App />);
