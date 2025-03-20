import { useCallback, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();

    const handleChange = useCallback((e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }, []);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/signup", formData, { withCredentials: true });
            
            if(res.status === 201){
            navigate("/login");
            }
        } catch(err) {
            setError(err.response.data.message)
            console.log("Signup failed",err);
        }
    };

    return(
        <div>
            <br />
            <h2>Signup</h2>
            <br />
            <form onSubmit={handleSubmit}>

                <label className="input">
                <input
                type="text"
                name="name"
                className="grow"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                />
                </label>

                
                <label className="input">
                <input
                type="text"
                name="email"
                className="grow"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                />
                </label>

                <label className="input">
                <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="grow"
                placeholder="Password"
                value={formData.password}
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
                <br />
                
                <button className="btn btn-primary" type="submit">Submit</button><br />
                
                {(error) ? <p style={{color: "red", fontWeight: "bold"}}>{error}</p> : null}
            </form>
        </div>
    );
};

export default Signup