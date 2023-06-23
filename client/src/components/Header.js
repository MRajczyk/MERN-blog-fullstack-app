import { Link, Navigate } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';

export default function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/profile', {
      credentials: 'include',
    }).then(res => {
      res.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    })
  }, []);

  async function logout() {
    await fetch('http://localhost:3000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        My Culinary Blog!
      </Link>
      <nav>
        {username && (
          <>
            <span className="welcome-text">Hi, {username}!</span>
            <Link to ="/create">Create new post</Link>
            <Link onClick={logout}>Logout</Link>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}
