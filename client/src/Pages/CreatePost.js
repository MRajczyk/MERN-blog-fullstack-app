import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';
import Editor from '../components/Editor';
import { API_URL } from '../secrets'

export default function CreatePost() {
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  
  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();
    const response = await fetch(`${API_URL}/post`, {
      method: 'POST',
      body: data,
      credentials: 'include',
    })
    if(response.ok) {
      setRedirect(true);
    }
  }

  if(redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <form onSubmit={createNewPost}>
      <input type="title" placeholder={'Title'} value={title} onChange={ev => setTitle(ev.target.value)}></input>
      <input type="summary" placeholder={'Summary'} value={summary} onChange={ev => setSummary(ev.target.value)}></input>
      <input type="file" onChange={ev => setFiles(ev.target.files)} ></input>
      <Editor onChange={setContent} value={content}/>
      <button style={{marginTop: '10px'}}>Create post</button>
    </form>
  )
}