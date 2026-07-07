import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import { encryptMessage } from '../../Encryption';
import '../Chat/chat.css';

const ENDPOINT = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(window.location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
}, []);

  const sendMessage = async (event) => {
    event.preventDefault();

    if(message) {
      const encrypted = await encryptMessage(message, room);
      socket.emit('sendMessage', encrypted, () => setMessage(''));
    }
  }

  const copyChatUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <div className="outerContainer">
        <div className="chatStage">
          <div className="chatHeader">
            <h1>Your_Secure_<br />Chat</h1>
            <button className="copyButton" type="button" onClick={copyChatUrl}>Click to copy chat URL</button>
          </div>
          <div className="container">
            <InfoBar room={room} />
            <Messages messages={messages} name={name} room={room} />
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
          </div>
        </div>
      </div>
    </>

  );
}

export default Chat;
