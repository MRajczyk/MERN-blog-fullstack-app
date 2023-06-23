import Post from '../components/Post'
import {useEffect, useState} from 'react';

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  useEffect(() => {
      fetch('http://localhost:3000/post', {credentials: 'include'}).then(response => {
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
