import { Link } from 'react-router-dom'
import { useAuth } from '../context/authContext.jsx'

const Navbar = () => {
    const { user} = useAuth();
    const { logout } = useAuth();

    return (
        <nav
        style={{ display:
        'flex',
        justifyContent:
        "space-between",
        padding: "1rem",
        background: "#333",
        color: "#fff" }}>
            <h2 style={{marginLeft: "2rem"}}>Task Manager</h2>
            <div
            style={{alignContent: 'center',
            marginRight: "2rem",
            fontSize: "17px"}}>

                <Link to={"/"}
                style={{ color: "#fff",
                marginRight: "1rem"}}>
                    Home
                </Link>
                {!user ? (
                    <>
                    <Link
                    to={"/login"}
                    style={{ color: "#fff", marginRight: "1rem" }}>
                        Login
                    </Link>
                    <Link
                    to={"/signup"}
                    style={{ color: "#fff" }}>
                    Signup
                    </Link>
                    </>
                ): (
                    <>
                    <Link
                    to={"/dashboard"}
                    style={{ color: "#fff", marginRight: "1rem" }}>
                    Dashboard
                    </Link>

                    <button 
                    onClick={logout}
                    style={{ color: "#fff",
                    background: "red",
                    border: "none",
                    padding: "0.5rem 1rem",
                    cursor: "pointer"}}>
                    Logout
                    </button>
                    </>
                )}
            </div>

        </nav>
    )
}

export default Navbar;