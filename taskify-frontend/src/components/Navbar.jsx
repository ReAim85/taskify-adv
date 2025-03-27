import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext.jsx'

const Navbar = () => {
    const { user } = useAuth();
    const { logout } = useAuth();

    return (
            <nav className='navbar justify-around bg-base-300'>
            <div className='text-2xl'>
            <h2>TASKIFY</h2>
            </div>

            {/* for phone */}

            <div className='dropdown dropdown-end sm:hidden'>
                <button className='btn btn-soft'>
                    <i className='fa-solid fa-bars text-lg'></i>
                </button>
                <ul
                tabIndex="0"
                className="dropdown-content menu z-[1] bg-base-200 p-6 rounded-box shadow w-56 gap-2"
                >
                <li> <Link to={"/"}> Home </Link> </li> 
                {!user ? (
                    <>
                    <li> <Link to={"/login"}> Login </Link> </li>
                    <li> <Link to={"/signup"}>Signup </Link> </li>
                    </>
                ) : (
                    <>
                    <li> <Link to={"/dashboard"}>Dashboard</Link></li>
                    <button 
                    onClick={logout}
                    className="btn btn-dash btn-error">
                    Logout
                    </button>
                    </>
                )}
                </ul>
            </div>

            {/* for pc */}

            <div className="navbar-center">
            {location.pathname === "/" && (
                    user ? <p className='flex justify-center pl-43 text-xl'>Welcome, {user}!</p> : <p>Loading...</p>
                )}
                <div className="text-xl cursor-pointer hover:animate-wiggle">👋</div>
            
            </div>
            
                <ul className=" hidden menu sm:menu-horizontal gap-2">
                <li className='text-lg'> <Link to={"/"}> Home </Link> </li> 
                {!user ? (
                    <>
                    <li> <Link to={"/login"}> Login </Link> </li>
                    <li> <Link to={"/signup"}>Signup </Link> </li>
                    </>
                ) : (
                    <>
                    <li className='text-lg'> <Link to={"/dashboard"}>Dashboard</Link></li>
                    <button 
                    onClick={logout}
                    className="btn btn-dash btn-error">
                    Logout
                    </button>
                    </>
                )}
                </ul>
            </nav>
    )
}

export default Navbar;