import { Link } from 'react-router-dom';
import "./Admin.css";

function Admin ()
{
    return (
        <div className="adminPage">
            <div className="box_admin">
                <h1>
                What would you like to edit today?
                </h1>
                <Link to="/admin/changedeadline">
                    <button className="submissionButton">
                        Submission Deadline
                    </button>
                </Link>
                <Link to="/admin/curriculumdivisions">
                    <button className="curriculumButton">
                        Curriculum
                    </button>
                </Link>
            </div>
        </div>
    );
}


export default Admin;