import {format} from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({_id, title, summary, cover, content, createdAt, author}) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img
            src={'http://localhost:4000/' + cover}
            alt="obrazek"
          ></img>
        </Link>
      </div>
      <div className="texts">
        <h2>
          <Link to={`/post/${_id}`}>
            {title}
          </Link>
        </h2>
        <p className="info">
          <a href="/" className="author">{author.username}</a>
          <time>{format(new Date(createdAt), 'd MMM yyyy HH:mm')}</time>
        </p>
        <p className="summary">
          {summary}
        </p>
      </div>
    </div>
  )
}
