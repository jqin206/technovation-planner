import React, { useState, useEffect, useMemo } from 'react';
import './WeeklySchedule.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './configuration';
import { distributeLessons } from './Calendar.jsx';
import { lessons as seniorLessons} from './senior.js';
import { lessons as juniorLessons } from './junior.js';
import { lessons as beginnerLessons} from './beginner.js';

function generateBoxes(lessons, numberOfBoxes, start, submission) {
  const colors = ['blue', 'pink', 'green', 'yellow'];
  return Array.from({ length: numberOfBoxes }, (_, week) => {
    const colorClass = colors[week % colors.length];
    week++;
    const subDate = new Date(submission);
    const startDateObj = new Date(start); // make a Date object
    const startDate = new Date(startDateObj.getTime() + (7 * (week - 1)) * 24 * 60 * 60 * 1000);
    var endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    if (startDate > subDate) {
      endDate = startDate;
    }
    if (endDate > subDate) {
      endDate = subDate;
    }
    if (week === numberOfBoxes) {
      endDate = new Date(subDate.getTime()); // last box ends the day before submission
    }

    const lessonUnits = [];
    const lessonTitles = [];
    const lessonLengths = [];
    let lessonsLength = 0;
    const weekStartDate = new Date(startDate);
    

    for (let i = 0; i < lessons.length; i++) {
      const lessonDate = new Date(lessons[i].date)
      if (lessonDate >= weekStartDate && lessonDate <= endDate && lessons[i].type != 'unit-complete') {
        lessonUnits.push(lessons[i].unit);
        lessonTitles.push(lessons[i].title);
        lessonLengths.push(lessons[i].length);
        lessonsLength += lessons[i].length_int;
      }
    }
    const totalHours = Math.floor(lessonsLength / 60);
    const totalMinutes = lessonsLength % 60;

    return (
      <div className={`box ${colorClass}`} key={week}>
        <p className='week' >
          Week {week}
        </p>
          <p className='date' >
            Dates: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </p>
          <p className='time' >
            Expected time: {totalHours} hours {totalMinutes} mins
          </p>
          <p className='schedule'>
            Timeline:
            {lessonTitles.map((line, idx) => (
              <React.Fragment key={idx}>
                <br />
                Unit {lessonUnits[idx]}: {line} ({lessonLengths[idx]})
                
              </React.Fragment>
            ))}
          </p>
        </div>
      );
    });
}

export default function WeeklySchedule() {
  const numCols = 3;
  const [start, setStart] = useState('');
    const [submission, setSubmission] = useState('');
    const [division, setDivision] = useState('');
  
    useEffect(() => {
      const fetchData = async () => {
        const user = auth.currentUser;
        if (!user) return;
  
        const q = query(collection(db, 'users'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setStart(data.start);
          setSubmission(data.submission);
          setDivision(data.division);
        }
      };
  
      fetchData();
    }, []);


 // calculate num rows 
  const startDate = new Date(start);
  const adjustedEnd = new Date(submission);
  adjustedEnd.setDate(adjustedEnd.getDate() - 1);

  adjustedEnd.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const msPerWeek = msPerDay * 7;

  const diff = adjustedEnd.getTime() - startDate.getTime();

  const totalWeeks = Math.ceil(diff / msPerWeek);


  const lessons = useMemo(() => {
  switch (division){
          case 'senior':
            return seniorLessons;
            break;
          case 'junior':
            return juniorLessons;
            break;
          case 'beginner':
            return beginnerLessons;
            break;
          default:
            return seniorLessons;
        }
    });

   const scheduled = useMemo(() => {
    return distributeLessons(lessons, totalWeeks, start, submission);
  }, [lessons, totalWeeks, start, submission]);


  return (
      <div className="weekly_schedule">
        <h1 className="countdown">Weekly Schedule</h1>
        <div className="container">
          { generateBoxes(scheduled, totalWeeks, start, submission)}
        </div>
      </div>
    );
    
}