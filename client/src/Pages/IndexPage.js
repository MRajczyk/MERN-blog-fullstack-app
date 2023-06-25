import Post from '../components/Post'
import {useEffect, useState} from 'react';
import { API_URL } from '../secrets'

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  useEffect(() => {
      fetch(`${API_URL}/post`, {credentials: 'include'}).then(response => {
        response.json().then(posts => {
          setPosts(posts);
        });
      });
  }, []);

  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post {...post} />
      ))}
    </>
  );
}
