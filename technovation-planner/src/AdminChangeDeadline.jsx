import { useState, useEffect } from 'react'
import { db, doc, setDoc, getDoc } from './configuration'
import { useNavigate } from 'react-router-dom'
import './AdminChangeDeadline.css'

function AdminChangeDeadline ()
{
    const [ newDeadline, setNewDeadline ] = useState('')
    const [ currentDeadline, setCurrentDeadline ] = useState(null)
    const [ error, setError ] = useState('')
    const [ changeSaved, setChangeSaved ] = useState(null);

    useEffect(() => {
        const fetchDate = async () => {
            try {
                const deadlineRef = doc(db, 'submission', 'deadline');
                const deadlineSnap = await getDoc(deadlineRef);
                if (deadlineSnap.exists()) {
                    const deadlineData = deadlineSnap.data();
                    const deadline = deadlineData.date;

                    setCurrentDeadline(new Date(deadline + 'T17:00:00-07:00'));
                } else {
                    console.log('Error getting current deadline.')
                }
            } catch (err) {
                setError('Error displaying current deadline: ', err)
            }
        }

        fetchDate();
    })

    const handleSaveNewDeadline = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(db, 'submission', 'deadline')
            await setDoc(docRef, { 
                date : newDeadline 
            })
            console.log('Date successfully saved!')
            setChangeSaved(true)
        } catch (error) {
            console.error('Error saving new submission deadline: ', error)
            setChangeSaved(false)
        }
    }

    const navigate = useNavigate();

    return (
        <div className='changeDeadlinePage'>
            <div className='back_button_container'>
                <button className='back_button' onClick={() => navigate(-1)}>
                    {'<'} Back
                </button>
            </div>
            <div className='box_changeDeadline'>
                <h1 className='h1_changeDeadline'> 
                    Please enter the new submission deadline. 
                </h1>
                <form className='form_changeDeadline' onSubmit={handleSaveNewDeadline}>
                    <p>
                        The current submission deadline is {currentDeadline ? currentDeadline.toLocaleDateString() : 'Current deadline cannot be displayed'}.
                    </p>
                    { error && <p className='error'> {error}</p> }
                    <label>
                        <input 
                            type="date"
                            id="deadline"
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                            required
                        />
                    </label>
                    <button 
                        className='button_saveDeadline' 
                        type="submit">
                        Save New Deadline
                    </button>
                </form>
            </div>
        </div>
    )
}


export default AdminChangeDeadline