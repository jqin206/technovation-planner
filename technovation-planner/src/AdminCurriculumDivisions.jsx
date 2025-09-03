import { Link } from 'react-router-dom';
import "./AdminCurriculumDivisions.css";

function AdminCurriculumDivisions ()
{
    return (
        <div className="adminPage">
            <div className="box_admin">
                <h1>
                Which division's curriculum would you like to edit?
                </h1>
                <Link to="/admin/curriculumdivisions/beginner">
                    <button className="beginnerButton">
                        Beginner
                    </button>
                </Link>
                <Link to="/admin/curriculumdivisions/junior">
                    <button className="juniorButton">
                        Junior
                    </button>
                </Link>
                <Link to="/admin/curriculumdivisions/senior">
                    <button className="seniorButton">
                        Senior
                    </button>
                </Link>
            </div>
        </div>
    );
}


export default AdminCurriculumDivisions;