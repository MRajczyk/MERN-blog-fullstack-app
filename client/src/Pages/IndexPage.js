import Post from '../components/Post'
import {useEffect, useState} from 'react';
import { API_URL } from '../secrets'

export default function IndexPage() {
  const [postss, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  useEffect(() => {
      fetch(`${API_URL}/post`, {credentials: 'include'}).then(response => {
        response.json().then(posts => {
          setPosts(posts);
          setFilteredPosts(posts);
        });
      });
  }, []);

  function filterPosts(event) {
    if(event.target.value === "") {
      setFilteredPosts(postss);
    } else {
      setFilteredPosts(postss.filter(post =>
        post.title.includes(event.target.value)
      ))
    }
  }

  return (
    <>
      <input onChange={filterPosts} style={{marginBottom: "20px"}} placeholder={"Filter recipes"}/>
      {filteredPosts.length > 0 && filteredPosts.map(post => (
        <Post {...post} />
      ))}
    </>
  );
}
