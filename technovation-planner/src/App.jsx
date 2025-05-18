import { useState } from 'react'
import {Routes, Route } from 'react-router-dom';
import './App.css'
import Signup from './Signup'
import Login from './Login'
import NavBar from './NavBar'
import Calendar from './Calendar'
<<<<<<< HEAD
import Account from './Account'
=======
>>>>>>> fe91de221f096c2d96bbc9ce1e705cac7fb07d50

const App = () => {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/calendar" element={<Calendar />} />
<<<<<<< HEAD
        <Route path="/account" element={<Account />} />
=======
>>>>>>> fe91de221f096c2d96bbc9ce1e705cac7fb07d50
      </Routes>
    </div>
  );
}

export default App;
