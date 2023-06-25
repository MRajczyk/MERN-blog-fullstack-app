import { Link, Navigate } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { OPEN_WEATHER_API_KEY, API_URL } from '../secrets'
import axios from "axios";

export default function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/profile`, {
      credentials: 'include',
    }).then(res => {
      res.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    })

    navigator.geolocation.getCurrentPosition(
      function(position) {
        console.log(position);

        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${OPEN_WEATHER_API_KEY}`).then((response) => {
          setData(response.data)
          console.log(response.data)
        })
      }, function(error) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=51.76&lon=19.46&appid=${OPEN_WEATHER_API_KEY}`).then((response) => {
        setData(response.data)
        console.log(response.data)
        })
      }
    );

  }, []);

  async function logout() {
    await fetch(`${API_URL}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;
  let weatherSpan = (<span>Waiting for weather api... </span>);
  if(data.weather) {
    weatherSpan = (<span>Weather for: {data.name} - {data.weather[0].main}, {(data.main.temp - 273.15).toFixed(2)}℃ </span>)
  }
  return (
    <header>
      <Link to="/" className="logo">
        My Culinary Blog!
      </Link>
      {weatherSpan}
      <nav>
        {username && (
          <>
            <span className="welcome-text">Hi, {username}!</span>
            <Link to="/create">Create new post</Link>
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
