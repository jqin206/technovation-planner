import { useState } from 'react'
import {Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './Signup'
import NavBar from './NavBar'
import Calendar from './Calendar'
import Account from './Account'

const App = () => {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </div>
  );
}

export default App;
