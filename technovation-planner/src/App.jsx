import { useState } from 'react'
import {Routes, Route } from 'react-router-dom';
import './App.css'
import Signup from './Signup'
import Login from './Login'
import NavBar from './NavBar'
import Calendar from './Calendar'
import Account from './Account'
import Progress from './Progress'
import WeeklySchedule from './WeeklySchedule';

const App = () => {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/account" element={<Account />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/" element={<Login />} />
        <Route path="/weeklyschedule" element={<WeeklySchedule />} />
      </Routes>
    </div>
  );
}

export default App;
