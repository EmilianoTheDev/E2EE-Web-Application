import React, { useEffect, useState } from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

import { decryptMessage } from '../../../Encryption'; 

const Message = ({ message: { text, user }, name, room }) => {
  const [displayText, setDisplayText] = useState(text);
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  useEffect(() => {
    let isMounted = true;

    const setMessageText = async () => {
      if (user.toLowerCase() === 'admin') {
        setDisplayText(text);
        return;
      }

      try {
        const decrypted = await decryptMessage(text, room);

        if (isMounted) {
          setDisplayText(decrypted);
        }
      } catch (error) {
        if (isMounted) {
          setDisplayText('Unable to decrypt message');
        }
      }
    };

    setMessageText();

    return () => {
      isMounted = false;
    };
  }, [room, text, user]);

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(displayText)}</p>
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(displayText)}</p>
            </div>
            <p className="sentText pl-10 ">{user}</p>
          </div>
        )
  );
}

export default Message;
