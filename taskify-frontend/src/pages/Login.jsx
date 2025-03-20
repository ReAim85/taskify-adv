import { useCallback, useState } from 'react'
import { useAuth } from '../context/authContext'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const { login, error } = useAuth();

    const handleChange = useCallback((e) => {
            setLoginData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value
            }));
        }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await login(loginData);
            console.log(error)
        }catch(err){
            console.log(err)
        }
    };

    return(
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                type="email"
                name="email"
                placeholder='Email'
                value={loginData.email.toLowerCase()}
                onChange={handleChange}
                required
                style={{paddingRight: "35px", height: "20px", fontSize: "16px"}}/>

                <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleChange}
                required
                style={{paddingRight: "35px", height: "20px", fontSize: "16px"}}/>
                <span
                onClick={() => setShowPassword(!showPassword)}
                style={{cursor: "pointer",
                border: "1px solid grey",
                paddingTop: "3.9px",
                position: 'absolute',
                borderRadius: "2px"}}>
                    {showPassword ? <FaEyeSlash/> : <FaEye/>}
                </span>
                <br />
                <br />

                <button type="submit">Login</button>

                {(error) ? <p style={{color: "red", fontWeight: "bold"}}>{error}</p> : null}
            </form>
        </div>
    );
};

export default Login