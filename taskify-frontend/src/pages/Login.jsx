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
        <div className="flex flex-col justify-center items-center h-200">
            <div className='card bg-base-200 w-full max-w-sm shrink-0 shadow-2xl p-3'>
            <h2 className='text-center text text-2xl'>Login</h2>

            <form onSubmit={handleSubmit} className='card-body'>
            
            <label className="fieldset-label">Email</label>
            <label className="input">
            <input
            type="text"
            name="email"
            className="grow"
            placeholder="Email"
            value={loginData.email.toLowerCase()}
            onChange={handleChange}
            required
            />
            </label>
            
            <label className="fieldset-label">Password</label>
            <label className="input">
            <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="grow"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
            />
            <span
            className="cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </span>
            </label>

            <br />

            <button className="btn btn-primary" type="submit">Login</button>

            {(error) ? <p style={{color: "red", fontWeight: "bold"}}>{error}</p> : null}
            </form>
            </div>
        </div>
    );
};

export default Login