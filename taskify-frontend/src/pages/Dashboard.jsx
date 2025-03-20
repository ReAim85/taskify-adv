import { useAuth } from '../context/authContext.jsx'

const Dashboard = () => {
    const { user } = useAuth();

    return(
        <div>
            <h2>Dashboard</h2>
            {user ? <p>Welcome, {user}!</p> : <p>Loading...</p>}
        </div>
    );
};

export default Dashboard