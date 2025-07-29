import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './configuration';
import { collection, getDocs, addDoc } from 'firebase/firestore';

import './GenerateSchedule.css'

function GenerateSchedule() {
    const [team, setTeam] = useState('');
    const [division, setDivision] = useState('');
    const [start, setStart] = useState('');
    const [submission, setSubmission] = useState('');
    const [dateError, setDateError] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);

    useEffect(() => {
    const getTeams = async () => {
        const usersRef = collection(db, "users"); // or "accounts" if that's your collection name
        const snapshot = await getDocs(usersRef);

        const teamsArr = snapshot.docs
        .map(doc => doc.data().team)
        .filter(Boolean); // filters out undefined/null in case some users don't have a team
        setTeams(teamsArr);
    };

    getTeams();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const limitDate = new Date('2025-05-05');
        const enteredDate = new Date(submission);

        if (enteredDate > limitDate) {
            setDateError('Your team submission date must be before the program submission deadline of May 5th, 2025.');
            return; 
        }
        setDateError('');

        
        const match = teams.find(curr => curr.trim().toLowerCase() === team.trim().toLowerCase());
        if (match) {
            setError('This team already exists. Please choose a different team name or view existing schedule.');
            return;
        }
        setError('');

            navigate('/weeklyschedule'); 
        };

    return (
        <div className='page'>
            <div className='box_generate_schedule'>
                <h1> Generate Schedule </h1>
                <form className='form_generate_schedule' onSubmit={handleSubmit}>
                    <label> 
                        Team
                        <input 
                            type="text"
                            id="team"
                            placeholder="Team"
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
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
                    {error && (
                        <button className="button" type="button" onClick={() => navigate('/weeklyschedule')}>View Schedule</button>
                    )}
                    {!error && (
                        <button className="button" type="submit">Generate Schedule</button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default GenerateSchedule;
