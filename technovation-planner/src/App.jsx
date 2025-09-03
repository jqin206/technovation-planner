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
import Schedule from './Schedule';
import Temp from './Temp'
import Admin from './Admin'
import AdminChangeDeadline from './AdminChangeDeadline'
import AdminCurriculumDivisions from './AdminCurriculumDivisions'
import AdminBeginner from './AdminBeginner'
import AdminJunior from './AdminJunior'
import AdminSenior from './AdminSenior'
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
        <Route path="/" element={<GenerateSchedule />} />
        <Route path="/weeklyschedule" element={<WeeklySchedule />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/temp" element={<Temp />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/changedeadline" element={<AdminChangeDeadline />} />
        <Route path="/admin/curriculumdivisions" element={<AdminCurriculumDivisions />} />
        <Route path="/admin/curriculumdivisions/beginner" element={<AdminBeginner />} />
        <Route path="/admin/curriculumdivisions/junior" element={<AdminJunior />} />
        <Route path="/admin/curriculumdivisions/senior" element={<AdminSenior />} />
      </Routes>
  </AuthProvider>
  );
}

export default App;
