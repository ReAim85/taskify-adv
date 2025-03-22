import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import { useAuth } from './context/authContext.jsx'
import Signup from './pages/Signup.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/authContext.jsx'


const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/"/> : children
};


export default function App () {

  return(
      <Router>
        <AuthProvider>
          <Navbar/>
            <Routes>
              <Route path={"/"} element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
              <Route path={"/login"} element={<AuthRoute><Login/></AuthRoute>}/>
              <Route path={"/signup"} element={<AuthRoute><Signup/></AuthRoute>}/>
            </Routes>
        </AuthProvider>
      </Router>
    
  )
}
