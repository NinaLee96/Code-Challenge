import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { Card, Button, Accordion, Popover, OverlayTrigger } from 'react-bootstrap';
import moment from 'moment';
import { MessageContext } from '../../context/MessageContext';

const Messages = () => {
  const [messages, setMessages] = useContext(MessageContext);

  async function getMessages() {
    try {
      const response = await axios.get('https://messaging-test.bixly.com/messages/');
      setMessages(response.data);
      // console.log(response.data);
    } catch (err) {
      throw err;
    }
  }

  async function handleDelete(id) {
    try {
      const response = await axios.delete(`https://messaging-test.bixly.com/messages/${id}`);
      setMessages(
        messages.filter(message => {
          return message.id !== id;
        })
      );

      // console.log(response.data);
    } catch (err) {
      alert('Failed to delete message');
      throw err;
    }
  }

  useEffect(() => {
    getMessages();
  }, []);

  function parseDate(date) {
    if (date) {
      let newDate = date.slice(0, date.search('T'));
      newDate = moment(newDate).format('MM-DD-YYYY');
      let time = date.slice(date.search('T') + 1, date.search('Z'));
      time = moment(time, 'h:mm:ss A').format('LT');
      date = `${newDate} ${time}`;
      return date;
    }
  }

  return (
    <div>
      <h2>Inbox</h2>
      {messages.length === 0 ? (
        <h4>Inbox is Empty </h4>
      ) : (
        messages.reverse().map((message, id) => (
          <Accordion key={id}>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  {message.sender}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <Card.Title>{message.title}</Card.Title>
                  <Card.Text>{message.body}</Card.Text>
                  <OverlayTrigger
                    trigger="focus"
                    placement="right"
                    overlay={
                      <Popover id="popover-basic">
                        <Popover.Title as="h3"></Popover.Title>
                        <Popover.Content>
                          <p>From: {message.sender}</p>
                          <p>To: {message.receiver}</p>
                          <p>Date : {parseDate(message.sent)}</p>
                        </Popover.Content>
                      </Popover>
                    }
                  >
                    <Button variant="primary">Details</Button>
                  </OverlayTrigger>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(message.id)}
                    style={{ position: 'relative', float: 'right' }}
                  >
                    Delete Message
                  </Button>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        ))
      )}
    </div>
  );
};

export default Messages;
