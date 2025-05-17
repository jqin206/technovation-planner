import { useState } from 'react'
import {Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './Signup'

const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default App;
