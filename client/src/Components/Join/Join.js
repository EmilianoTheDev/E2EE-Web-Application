import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import queryString from 'query-string';

import './Join.css';

export default function SignIn() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  useEffect(() => {
    const { room } = queryString.parse(window.location.search);

    if (typeof room === 'string') {
      setRoom(room);
    }
  }, []);

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Encrypted Messaging</h1>
        <div>
          <input placeholder="Name" className="joinInput" type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <input placeholder="Room" className="joinInput mt-20" type="text" value={room} onChange={(event) => setRoom(event.target.value)} />
        </div>
        <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?${queryString.stringify({ name, room })}`}>
          <button className={'button mt-20'} type="submit">Join Chat</button>
        </Link>
      </div>
    </div>
  );
}
