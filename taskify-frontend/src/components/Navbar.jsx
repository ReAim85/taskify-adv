import { Link } from 'react-router-dom'
import { useAuth } from '../context/authContext.jsx'

const Navbar = () => {
    const { user} = useAuth();
    const { logout } = useAuth();

    return (
            <nav className='navbar justify-around bg-base-300'>
            <div className='text-2xl'>
            <h2 className='w-4'>TASKIFY</h2>
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
            
                <ul className=" hidden menu sm:menu-horizontal gap-2">
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
            </nav>
    )
}

export default Navbar;