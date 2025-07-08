import React, { useEffect, useState } from 'react';
import './Temp.css'

function Curriculum() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5050/curriculum/senior')
    .then(response => {
      if (!response.ok) throw new Error('Network response not ok');
      return response.json();
    })
    .then(data => setMessage(JSON.stringify(data))) // or handle data properly
    .catch(error => console.error('Fetch error:', error));
}, []);

  return (
    <div>
      <h1>Curriculum</h1>
      <p>{JSON.stringify(message, null, 2)}</p>
    </div>
  );
}

export default Curriculum;