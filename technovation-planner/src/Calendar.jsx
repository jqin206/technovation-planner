import React, { useState } from 'react';
import './Calendar.css';


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

  return (

    <div className="calendar">
        <h1 className= "countdown">Countdown!</h1>
        <div className="inline-text">
            <h2>100</h2>
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
            {day ? day.getDate() : ''}
        </div>
        ))}

      </div>
      </div>
    </div>
  );
};

export default Calendar;
            