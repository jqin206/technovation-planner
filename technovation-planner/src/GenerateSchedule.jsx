import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, collection, getDocs, getDoc, doc } from './configuration';
import './GenerateSchedule.css'
import { limit } from 'firebase/firestore';

function GenerateSchedule() {
    
    const [team, setTeam] = useState('');
    const [division, setDivision] = useState('');
    const [start, setStart] = useState('');
    const [submission, setSubmission] = useState('');
    const [dateError, setDateError] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [showOriginalButton, setShowOriginalButton] = useState(true);

    useEffect(() => {
    const getTeams = async () => {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        const teamsArr = snapshot.docs
        .map(doc => doc.data().team)
        .filter(Boolean);
        setTeams(teamsArr);
    };

    getTeams();
    }, []);

    const handleChange = () => {
        setError('');
        setShowOriginalButton(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const deadlineRef = doc(db, 'submission', 'deadline');
        const deadlineSnap = await getDoc(deadlineRef);
        if (deadlineSnap.exists()) {
            const deadlineData = deadlineSnap.data();
            const deadline = deadlineData.date;

            const limitDate = new Date(deadline + 'T17:00:00-07:00');
            const enteredDate = new Date(submission + 'T17:00:00-07:00');

            if (enteredDate > limitDate) {
                setDateError(`Your team submission date must be before the program submission deadline of: ${ limitDate.toDateString() }.`);
                return; 
            }
            setDateError('');
        } else {
            console.log("No such document!")
        }

        const match = teams.find(curr => curr.trim().toLowerCase() === team.trim().toLowerCase());
        if (match) {
            setError('This team already exists. Please choose a different team name or view existing schedule.');
            setShowOriginalButton(false);
            return;
        }
        setError('');
            navigate('/weeklyschedule', { state: { division, start, submission } });
        };


    return (
        <div className='page'>
            <div className='box_generate_schedule'>
                <h1 className='generate_schedule'> Generate Schedule </h1>
                <form className='form_generate_schedule' onSubmit={handleSubmit}>
                    <label> 
                        Team
                        <input 
                            type="text"
                            id="team"
                            placeholder="Team"
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                            onChangeCapture={handleChange}
                        />
                    </label>
                    <label>
                    Division
                    <div className="radio-group">
                        <div className="radio-item">
                            <input 
                                type="radio" 
                                name="division" 
                                value="beginner" 
                                id="beginner"
                                checked={division === 'beginner'}
                                onChange={(e) => setDivision(e.target.value)}
                            />
                            <label htmlFor="beginner">Beginner (ages 8-12)</label>
                        </div>
                        <div className="radio-item">
                            <input 
                                type="radio" 
                                name="division" 
                                value="junior" 
                                id="junior"
                                checked={division === 'junior'}
                                onChange={(e) => setDivision(e.target.value)} 
                            />
                            <label htmlFor="junior">Junior (ages 13-15)</label>
                        </div>
                        <div className="radio-item">
                            <input 
                                type="radio" 
                                name="division" 
                                value="senior" 
                                id="senior" 
                                checked={division === 'senior'}
                                onChange={(e) => setDivision(e.target.value)}
                            />
                            <label htmlFor="senior">Senior (ages 16-18)</label>
                        </div>
                    </div>
                </label>
                    <label> 
                        Start Date
                        <input 
                            type="date"
                            id="start"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                        />
                    </label>
                    <label> 
                        Submission Date
                        <input 
                            type="date"
                            id="submission"
                            value={submission}
                            onChange={(e) => setSubmission(e.target.value)}
                        />
                    </label>
                    {dateError && <p className="error">{dateError}</p>}
                    {error && <p className="error">{error}</p>}
                    {showOriginalButton && (
                        <button className="button" type="submit" >Generate Schedule</button>
                    )}
                    {!showOriginalButton && (
                        <button className="button" type="button" onClick={() => navigate('/weeklyschedule')}>View Schedule</button>
                    )}
                    {useEffect(() => {
                    if (showOriginalButton) {
                        <button className="button" type="submit">Generate Schedule</button>
                    } else {
                        <button className="button" type="button" onClick={() => navigate('/weeklyschedule')}>View Schedule</button>
                    }
                }, [showOriginalButton])}
                    <div className="link-container">
                        <Link className="link" to="/login">Already have an account? Log in here!</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default GenerateSchedule;
