import { Link, Navigate } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { OPEN_WEATHER_API_KEY, API_URL } from '../secrets'

export default function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/profile`, {
      credentials: 'include',
    }).then(res => {
      res.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    })
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=51.76&lon=19.46&appid=${OPEN_WEATHER_API_KEY}`, {
    }).then(res => {
      res.json().then(x => {
        console.log(x)
      });
    })
  }, []);

  async function logout() {
    await fetch(`${API_URL}/logout`, {
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
