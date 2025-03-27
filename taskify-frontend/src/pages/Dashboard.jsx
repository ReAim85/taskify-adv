import {KanbanBoard} from '../components/TodoBoard.jsx'
import AddTask from '../components/AddTask.jsx'
const Dashboard = () => {
    return(
        <div>
            <br />
            <KanbanBoard>
                <AddTask/>
            </KanbanBoard>
            </div>
    );
};

export default Dashboard    