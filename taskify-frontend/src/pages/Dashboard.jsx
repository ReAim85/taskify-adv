import { useAuth } from '../context/authContext.jsx'
import KanbanBoard from '../components/TodoBoard.jsx'
import AddTask from '../components/AddTask.jsx'
const Dashboard = () => {
    const { user } = useAuth();

    return(
        <div>
            {user ? <p className='flex justify-center text-xl'>Welcome, {user}!</p> : <p>Loading...</p>}
            <br />
            <div className='flex justify-center'>
            <AddTask/>
            </div>
            <KanbanBoard/>
        </div>
    );
};

export default Dashboard