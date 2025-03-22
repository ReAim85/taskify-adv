import { createContext, useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true)
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
                setUser(res.data.name);
            } catch(err) {
                console.log("not logged in");

            } finally {
                setLoading(false)
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if(user) {
            navigate("/");
        }
    }, [user, navigate])

    if(loading) return <div>Loading...</div>;

    const login = async ( loginData ) => {
        try{
        const res = await axios.post("http://localhost:5000/api/auth/login", loginData, { withCredentials: true });
        
        if(res.status === 200 && res.data.user) {
            setUser(res.data.user);
        }
    } catch(err){
        setError(err.response.data.message)
        console.log(error)
        console.log("Login failed: ", err)
    }
    };


    const logout = async () => {
        try {
        await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
        setUser(null);
    }catch(err) {
        console.log("Logout failed", err)
    }
    };

    return(
        <AuthContext.Provider value={{ user, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    )
}