import React, { useState, createContext } from 'react';

export const MessageContext = createContext();

export const MessageProvider = props => {
  const [messages, setMessages] = useState([{}]);

  const [show, setShow] = useState();
  const [alertMessage, setAlertMessage] = useState([{}]);

  return (
    <MessageContext.Provider
      value={[messages, setMessages, show, setShow, alertMessage, setAlertMessage]}
    >
      {props.children}
    </MessageContext.Provider>
  );
};
