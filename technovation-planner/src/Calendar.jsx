import React, { useState, useEffect, useMemo } from 'react';
import './Calendar.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './configuration';
import { lessons as seniorLessons} from './senior.js';
import { lessons as juniorLessons } from './junior.js';
import { lessons as beginnerLessons} from './beginner.js';
import { deliverables as seniorDeliverables} from './senior.js';
import { deliverables as juniorDeliverables } from './junior.js';
import { deliverables as beginnerDeliverables} from './beginner.js';

export function distributeLessons(lessons, totalWeeks, startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const totalMinutes = lessons.reduce((sum, l) => sum + l.length_int, 0);
  const targetPerWeek = totalMinutes / totalWeeks;

  const weeks = Array.from({ length: totalWeeks }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * 7);
    return { date, modules: [], totalMinutes: 0 };
  });

  let weekIdx = 0;
  const scheduled = [];

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];

    // Find first week that can fit this lesson
    while (weekIdx < weeks.length) {
      const week = weeks[weekIdx];
      const available = targetPerWeek - week.totalMinutes;

      if (available >= lesson.length_int || weekIdx === weeks.length - 1) {
        const part = {
          ...lesson,
          length_int: lesson.length_int,
          partial: false,
          date: new Date(week.date),
        };

        week.modules.push(part);
        week.totalMinutes += lesson.length_int;
        scheduled.push(part);

        break;
      } else {
        // If this week is too full, move to next week
        weekIdx++;
      }
    }
  }

  // Rebalance forward and backward, but preserve order
  let changed = true;
while (changed) {
  changed = false;

  // Forward balancing
  for (let j = 0; j < weeks.length - 1; j++) {
    const curr = weeks[j];
    const next = weeks[j + 1];

    if (curr.modules.length > 0) {
      const movable = curr.modules[curr.modules.length - 1];
      if (curr.totalMinutes > next.totalMinutes + movable.length_int) {
        
        curr.modules.pop();
        curr.totalMinutes -= movable.length_int;

        movable.date = new Date(next.date);
        next.modules.push(movable); // use push() to preserve order
        next.totalMinutes += movable.length_int;
        changed = true;
      }
    }
  }

  // Backward balancing
  for (let j = weeks.length - 1; j > 0; j--) {
    const curr = weeks[j];
    const prev = weeks[j - 1];

    if (curr.modules.length > 0) {
      const movable = curr.modules[0]; // peek at first module in current week
      if (curr.totalMinutes >= prev.totalMinutes + movable.length_int) {
        // Now actually move it:
        curr.modules.shift();
        curr.totalMinutes -= movable.length_int;

        movable.date = new Date(prev.date);
        prev.modules.push(movable); // use push() to preserve order
        prev.totalMinutes += movable.length_int;
        changed = true;
      }
    }
  }
}
  
  scheduled.sort((a, b) => a.date - b.date);

  const uniqueScheduled = [];
  const seen = new Set();
  for (const item of scheduled) {
    const key = `${item.title}-${item.date.toISOString()}-${item.length_int}`;
    if (!seen.has(key) || item.type === "unit-complete") { 
      seen.add(key);
      uniqueScheduled.push(item);
    }

  }
  const finalscheduled = []; // Clear the original array
  finalscheduled.push(...uniqueScheduled);
  // Sort by date
  finalscheduled.sort((a, b) => a.date - b.date);

  const completedUnits = new Set();

  for (let i = 0; i < scheduled.length; i++) {
    const l = scheduled[i];
    const next = scheduled[i + 1];
    const isUnitEnd = !next || next.unit !== l.unit;
    let weekEndDate;
    if (endDate < new Date(l.date).setDate(new Date(l.date).getDate() + 13)) {
      weekEndDate = new Date(endDate);
    } else {
      weekEndDate = new Date(new Date(l.date).setDate(new Date(l.date).getDate() + 6));
    }

    if (isUnitEnd && !completedUnits.has(l.unit)) {
      
      const unitComplete = {
        type: "unit-complete",
        unit: l.unit,
        date: weekEndDate,
      };
      finalscheduled.push(unitComplete);
      completedUnits.add(l.unit);
    }
  }
  finalscheduled.sort((a, b) => a.unit - b.unit || a.date - b.date);
  return finalscheduled;
  
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

    const deliverables = useMemo(() => {
  switch (division){
          case 'senior':
            return seniorDeliverables;
            break;
          case 'junior':
            return juniorDeliverables;
            break;
          case 'beginner':
            return beginnerDeliverables;
            break;
          default:
            return seniorDeliverables;
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
    const startDate = new Date(start);
    const endDate = new Date(submission);
    const totalWeeks = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));

  return distributeLessons(lessons, totalWeeks, start, submission);
  })

  return (
    <div className="calendar">
        <h1 className= "countdown">COUNTDOWN!</h1>
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
                    <div>
                      {day.getDate() && day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() && day.getFullYear() === new Date().getFullYear() ? (
                        <span className="today">{day.getDate()}</span>) : <span>{day.getDate()}</span>}
                    </div>
                    {submission &&
                      new Date(submission).toISOString().slice(0, 10) ===
                      day.toISOString().slice(0, 10) && (
                        <div className={'subDate'}>Submission Date</div>
                    )}
                  </>
                ) : ''}
                {lessonOnDay.map((lesson, idx) => {
                  if (lesson.type === "unit-complete") {
                    return (
                      <div key={lesson.id || lesson.name || idx} className={`complete unit${lesson.unit}u`}>
                        ✅ Unit {lesson.unit} Completed!
                      </div>
                    );
                  }
                  if (lesson.title === 'Positive Impact' || lesson.title === 'Positive Impact (Optional)') {
                    return (
                      <div key={lesson.id || lesson.name || idx} className={`deliverable num1`}>
                        🌟 Deliverable: {deliverables[0]} Due!
                      </div>
                    );
                  }
                  else if (lesson.title === 'Business Canvas') {
                    return (
                      <div key={lesson.id || lesson.name || idx} className={`deliverable num2`}>
                        🌟 Deliverable: {deliverables[1]} Due!
                      </div>
                    );
                  }
                  else if (lesson.title === 'User Adoption Plan') {
                    return (
                      <div key={lesson.id || lesson.name || idx} className={`deliverable num2`}>
                        🌟 Deliverable: {deliverables[1]}  Due!
                      </div>
                    );
                  }
                  else if (lesson.title === 'Planning your Videos') {
                    return (
                      <div key={lesson.id || lesson.name || idx} className={`deliverable num2`}>
                        🌟 Deliverable: {deliverables[1]} Due!
                      </div>
                    );
                  }
                  if (lesson.title === 'Outline Pitch and Technical Videos') {
                    return (
                      <div key={lesson.id || lesson.name || idx} className={`deliverable num3`}>
                        Deliverable: {deliverables[2]} Due!
                      </div>
                    );
                  }
                  if (lesson.title === 'Editing Videos' || lesson.title === 'Editing your Videos') {
                    if (division === 'senior') {
                      return (
                        <div>
                          <div key={lesson.id || lesson.name || idx} className={`deliverable num4`}>
                            🌟 Deliverable: {deliverables[3]} Due!
                          </div>
                          <div key={lesson.id || lesson.name || idx} className={`deliverable num5`}>
                            🌟 Deliverable: {deliverables[4]} Due!
                          </div>
                        </div>
                      );
                    }
                    else if (division === 'junior' || division === 'beginner') {
                      return (
                        <div>
                          <div key={lesson.id || lesson.name || idx} className={`deliverable num3`}>
                            🌟 Deliverable: {deliverables[2]} Due!
                          </div>
                          <div key={lesson.id || lesson.name || idx} className={`deliverable num4`}>
                            🌟 Deliverable: {deliverables[3]} Due!
                          </div>
                        </div>
                      );
                    }
                  }
                  if (lesson.title === 'Learning Journey') {
                    let idx = 0;
                    division === 'senior' ? idx = 5 : idx = 4; 
                    return (
                      <div key={lesson.id || lesson.name || idx} className={`deliverable num${idx+1}`}>
                        🌟 Deliverable: {deliverables[idx]} Due!
                      </div>
                    );
                  }
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;