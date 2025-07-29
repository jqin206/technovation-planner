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
import GenerateSchedule from './GenerateSchedule';
import Temp from './Temp'
import './index.css';
import { AuthProvider } from './AuthContext';

const App = () => {
  return (
  <AuthProvider>
      <NavBar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/generateschedule" element={<GenerateSchedule />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/account" element={<Account />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/" element={<Login />} />
        <Route path="/weeklyschedule" element={<WeeklySchedule />} />
        <Route path="/temp" element={<Temp />} />
      </Routes>
  </AuthProvider>
  );
}

export default App;
