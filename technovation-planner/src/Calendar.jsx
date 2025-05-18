import React, { useState, useEffect, useMemo } from 'react';
import './Calendar.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './configuration';
import { lessons as seniorLessons} from './senior.js';
import { lessons as juniorLessons } from './junior.js';
import {lessons as beginnerLessons} from './beginner.js';

function distributeLessons(lessons, startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const totalMinutes = lessons.reduce((sum, l) => sum + l.length_int, 0);
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const minutesPerDay = totalMinutes / totalDays;

  const days = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return { date, modules: [], totalMinutes: 0 };
  });

  let dayIdx = 0;
  const scheduled = [];

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    let remaining = lesson.length_int;
    let lastDate = null;

    while (remaining > 0 && dayIdx < days.length) {
      const day = days[dayIdx];
      const available = minutesPerDay - day.totalMinutes;
      const timeUsed = Math.min(remaining, available > 0 ? available : remaining);

      const partial = timeUsed < lesson.length_int;
      const part = {
        ...lesson,
        length_int: timeUsed,
        partial,
        date: new Date(day.date),
      };

      day.modules.push(part);
      day.totalMinutes += timeUsed;
      scheduled.push(part);

      remaining -= timeUsed;
      lastDate = new Date(day.date);

      if (day.totalMinutes >= minutesPerDay) dayIdx++;
    }

    const next = lessons[i + 1];
    const isUnitEnd = !next || next.unit !== lesson.unit;
    if (isUnitEnd && lastDate) {
      scheduled.push({
        type: "unit-complete",
        unit: lesson.unit,
        date: lastDate,
      });
    }
  }

  // Step 3: Rebalancing across days
  for (let i = 0; i < days.length - 1; i++) {
    const curr = days[i];
    const next = days[i + 1];

    const moveCondition =
      (curr.totalMinutes > next.totalMinutes &&
        curr.modules.length > next.modules.length) ||
      (curr.totalMinutes === next.totalMinutes &&
        curr.modules.length - next.modules.length > 1);

    if (moveCondition) {
      // Move the last movable module from curr to next
      const movable = [...curr.modules]
        .reverse()
        .find((m) => !m.type && !m.partial); // only whole, non-unit-complete

      if (movable) {
        // Remove from curr
        const index = curr.modules.lastIndexOf(movable);
        curr.modules.splice(index, 1);
        curr.totalMinutes -= movable.length_int;

        // Reassign date
        const moved = {
          ...movable,
          date: new Date(next.date),
        };
        next.modules.push(moved);
        next.totalMinutes += moved.length_int;

        // Update scheduled array (find and update by original reference)
        const sIndex = scheduled.findIndex(
          (s) =>
            !s.type &&
            s.title === movable.title &&
            s.date.getTime() === curr.date.getTime() &&
            s.length_int === movable.length_int
        );

        if (sIndex !== -1) {
          scheduled.splice(sIndex, 1); // remove the old
        }
        scheduled.push(moved);
      }
    }
  }
  return scheduled;
}


const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const getLastDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const getDaysInMonth = (date) => {
    const firstDay = getFirstDayOfMonth(date);
    const lastDay = getLastDayOfMonth(date);
    const days = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    return days;
  };

  const getCalendarGrid = (date) => {
    const firstDayIndex = getFirstDayOfMonth(date).getDay();
    const days = getDaysInMonth(date);
    const paddedDays = Array.from({ length: firstDayIndex }, () => null).concat(days);
    return paddedDays;
  };

  const daysInMonth = getCalendarGrid(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
    })

  const daysDiff = useMemo(() => {
    if (!submission) return 0;
    const diff = Math.ceil((new Date(submission) - new Date()) / (1000 * 60 * 60 * 24));
    return diff < 0 ? 0 : diff;
  }, [submission]);

  const scheduledLessons = useMemo(() => {
    if (!start || !submission) return [];

    const totalDays = Math.ceil(
      (new Date(submission) - new Date(start)) / (1000 * 60 * 60 * 24)
    );

    if (totalDays <= 0) return [];

    const totalMinutes = lessons.reduce((sum, l) => sum + l.length_int, 0);
    if (totalMinutes === 0 || totalDays <= 0) return [];
    const minutesPerDay = totalMinutes / totalDays;

  return distributeLessons(lessons, start, submission);
  })

  return (
    <div className="calendar">
        <h1 className= "countdown">Countdown!</h1>
        <div className="inline-text">
            <h2>
              {daysDiff ? daysDiff : '0'}
            </h2>
            <p>days till project submission</p>
        </div>
        <div className="calendar-frame">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2 className="monthName">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-day-names">
        {dayNames.map((dayName) => (
          <div key={dayName}>{dayName}</div>
        ))}
      </div>
        <div className="calendar-grid">
          {daysInMonth.map((day, index) => {
            const lessonOnDay = scheduledLessons.filter(
              (l) => day && l.date.toDateString() === day.toDateString()
            );

            return (
              <div key={index} className="calendar-day">
                {day ? (
                  <>
                    <div>{day.getDate()}</div>
                    {submission &&
                      new Date(submission).toISOString().slice(0, 10) ===
                      day.toISOString().slice(0, 10) && (
                        <div className="subDate">Submission Deadline</div>
                    )}
                  </>
                ) : ''}
                {lessonOnDay.map((lesson, idx) => (
                  lesson.type === "unit-complete" ? (
                    <div key={lesson.id} className={`complete unit${lesson.unit}u`}>
                      ✅ Unit {lesson.unit} Completed!
                    </div>
                  ) : (
                  <div key={lesson.id}
                    className={`lesson-box unit${lesson.unit}`}>
                      <div className="lesson-title">
                        {lesson.title + ' ' + lesson.length}
                      </div>
                  </div>
                )))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;


/*import React, { useState, useEffect, useMemo } from 'react';
import './Calendar.css';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth} from "./configuration";
<<<<<<< HEAD
import {lessons} from './senior.js';
=======
import beginner_curriculum from './beginner.json'
import junior_curriculum from './junior.json'
import senior_curriculum from './senior.json'

>>>>>>> 5fcc1b144e2ad5900de06c710b82b9b8321d851e

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const getLastDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const getDaysInMonth = (date) => {
    const firstDay = getFirstDayOfMonth(date);
    const lastDay = getLastDayOfMonth(date);
    const days = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

    const getCalendarGrid = (date) => {
    const getfirstDay = getFirstDayOfMonth(date).getDay(); // Sunday=0, Monday=1...
    const temp_days = getDaysInMonth(date);

    // Prepend empty slots for alignment
    const paddedDays = Array.from({ length: getfirstDay }, () => null).concat(temp_days);
    return paddedDays;
    };

  const daysInMonth = getCalendarGrid(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const user = auth.currentUser;

  const [start, setStart] = useState("");
  const [submission, setSubmission] = useState("");
  const [division, setDivision] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "users"), where("email", "==", user.email));
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

  // Calculate the difference in days between the current date and the project submission date
  const daysDiff = Math.ceil((new Date(submission) - new Date()) / (1000 * 60 * 60 * 24));

  // calculate difference between start date and submission date
  const startAndSubDiff = Math.ceil((new Date(submission) - new Date(start)) / (1000 * 60 * 60 * 24));

  
  

  const scheduledLessons = useMemo(() => {
    if (!start || !submission || lessons.length === 0) return [];
    if (startAndSubDiff <= 0) return [];
    const totalMinutes = lessons.reduce((sum, lesson) => sum + lesson.length_int, 0);
    const minutesPerDay = totalMinutes / startAndSubDiff;
  const result = [];
  let currentDay = new Date(start);
  let accumulated = 0;

  for (let lesson of lessons) {
    accumulated += lesson.length_int;
    result.push({
      ...lesson,
      date: new Date(currentDay),
    });

    if (accumulated >= minutesPerDay) {
      currentDay.setDate(currentDay.getDate() + 1);
      accumulated = 0;
    }
  }

  return result;
}, [start, submission, lessons]);

{daysInMonth.map((day, index) => {
  const lessonOnDay = scheduledLessons.filter(
    (l) => day && l.date.toDateString() === day.toDateString()
  );
}
  return (

    <div className="calendar">
        <h1 className= "countdown">Countdown!</h1>
        <div className="inline-text">
            <h2>
              {daysDiff ? daysDiff : '0'}
            </h2>
            <p>days till project submission</p>
        </div>
        <div className="calendar-frame">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2 className="monthName">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-day-names">
        {dayNames.map((dayName) => (
          <div key={dayName}>{dayName}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {daysInMonth.map((day, index) => (
        <div key={index} className="calendar-day">
            {day ? (
            <>
              <div>{day.getDate()}</div>
              {submission &&
                new Date(submission).toISOString().slice(0, 10) ===
                day.toISOString().slice(0, 10) && (
                  <div className="subDate">Submission Deadline</div>
              )}
            </>
          ) : ''}
          {lessonOnDay.map((lesson, idx) => (
            <div
              key={idx}
              className={'lesson-box unit{lesson.unit}'}
              title={lesson.title}
            >
              {lesson.title}
            </div>
          ))}
        </div>
        ))}

      </div>
      </div>
    </div>
  );
})}
export default Calendar; */