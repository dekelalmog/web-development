import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from './App.tsx'
import './index.css'


ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="179195132285-dqj43jg22th2lepi4ic5amt4eb4khhnl.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
