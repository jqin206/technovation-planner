import { useState } from 'react'
import {Routes, Route } from 'react-router-dom';
import './App.css'
import Signup from './Signup'
import Login from './Login'
import NavBar from './NavBar'
import Calendar from './Calendar'

const App = () => {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </div>
  );
}

export default App;
