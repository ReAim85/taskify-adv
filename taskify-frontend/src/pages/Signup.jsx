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
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                name="name"
                placeholder='Name'
                value={formData.name} 
                onChange={handleChange}
                required
                style={{paddingRight: "35px", height: "20px", fontSize: "16px"}}
                />

                <input
                type="email"
                name="email"
                placeholder='Email'
                value={formData.email.toLowerCase()}
                onChange={handleChange}
                required
                style={{paddingRight: "35px", height: "20px", fontSize: "16px"}}
                />

                <input
                type={showPassword ? "text" : "password" }
                name="password"
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                required
                style={{paddingRight: "35px", height: "20px", fontSize: "16px"}}
                />
                <span
                onClick={() => setShowPassword(prev => !prev)}
                style={{cursor: "pointer",
                border: "1px solid grey",
                paddingTop: "3.9px",
                position: 'absolute',
                borderRadius: "2px"}}>
                    {showPassword ? <FaEyeSlash/> : <FaEye/>}
                </span>
                <br />
                <br />
                
                <button type="submit">Submit</button><br />
                
                {(error) ? <p style={{color: "red", fontWeight: "bold"}}>{error}</p> : null}
            </form>
        </div>
    );
};

export default Signup