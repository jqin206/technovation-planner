import React, { useState, useEffect, useMemo } from 'react';
import './WeeklySchedule.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './configuration';

function generateBoxes(numberOfBoxes, columnIndex, numCols) {
  const colors = ['blue', 'pink', 'green', 'yellow'];
  return Array.from({ length: numberOfBoxes }, (_, rowIndex) => {
    const colorIndex = (rowIndex * numCols + columnIndex) % colors.length;
    const colorClass = colors[colorIndex];
    return (
      <div className={`box ${colorClass}`} key={rowIndex}>
        <p className='week' >
          Week {rowIndex*numCols + columnIndex + 1}
        </p>
        <p className='date' >
          Dates: 
        </p>
        <p className='time' >
          Expected time: 
        </p>
        <p className='schedule'>
          Timeline:
        </p>
      </div>
    );
  });
}

export default function WeeklySchedule() {
  const numCols = 3;
  const numRows = 3;  
  return (
      <div className="weekly_schedule">
        <h1 className="countdown">Weekly Schedule</h1>
        <div className="container">
          <div className="column" id="column1">
              {generateBoxes(numRows, 0, numCols)}
          </div> 
          <div className="column" id="column2">
              {generateBoxes(numRows, 1, numCols)}
          </div>
          <div className="column" id="column3">
              {generateBoxes(numRows, 2, numCols)}
          </div>
        </div>
      </div>
    );
}