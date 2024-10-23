import { useState } from 'react'

// testing desktop import { useAuth } from "./auth/SessionProvider"; make session provider for authentication? ~davis 
import reactLogo from './assets/react.svg'
//import './styles/test.css'
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { BrowserRouter } from 'react-router-dom';
//import './styles/App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    /*
    <>
    
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    
      
    </>
    */
      <main className="App">
        <Home />
      </main>
      
  )
}

export default App
