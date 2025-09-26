import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { Signup } from './components/auth/Signup'
import { Signin } from './components/auth/SignIn'
import GenerateReport from './components/GenerateReport'

function App() {

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/signin" element={<Signin/>}/>
            <Route path="/generate-report" element={<GenerateReport/>}/>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
