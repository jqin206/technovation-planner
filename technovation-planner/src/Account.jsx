import './Account.css';
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "./configuration";
import { onAuthStateChanged } from "firebase/auth"
import { useNavigate } from 'react-router-dom';
  
export default function Account() {
    const [username, setName] = useState("");
    const [team, setTeam] = useState("");
    const [email, setEmail] = useState("");
    const [division, setDivision] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
          if (!user) return;
      
          const q = query(collection(db, "users"), where("email", "==", user.email));
          const querySnapshot = await getDocs(q);
      
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
        setName(data.username);
        setTeam(data.team);
        setEmail(data.email);
        setDivision(data.division);
      };
    };
    fetchData();
  }, []);
  
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Clean up subscription
  }, [auth]);

  const buttonText = user ? 'Logout' : 'Login';

  return (
    <div className="account">
      <h1 className="countdown">My Account</h1>
        <div className="inline1">
            <div className="username">
                <p className="info">Username:</p>
                <p className="field">{username}</p>
            </div>  
            <div className="team"> 
                <p className="info">Team:</p> 
                <p className="field">{team}</p>
            </div>
        </div> 
        <div className="inline2">
            <div className="email">  
                <p className="info">Email Address:</p>
                <p className="field">{email}</p>
            </div>
            <div className="division">  
                <p className="info">Division:</p>
                <p className="field">{division}</p>
            </div>
        </div>
        <div>
        <button className='button' onClick={() => {
          if (user) {
            auth.signOut();
            navigate('/login')
          } else {
            navigate('/login')
        }
    }}>
      {buttonText}
    </button>
        </div>
    </div>
  );
}