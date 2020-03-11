import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card, Button, Accordion, OverlayTrigger, Popover } from 'react-bootstrap';
import moment from 'moment';
import { MessageContext } from '../../context/MessageContext';

const Sent = () => {
  const [sentMessages, setSentMessages] = useState([]);
  const [messages] = useContext(MessageContext);

  async function handleDelete(id) {
    try {
      const response = await axios.delete(`https://messaging-test.bixly.com/messages/sent/${id}`);
      // console.log(response);
      setSentMessages(response.data);
    } catch (err) {
      // console.log(err.response);
      alert(err.response.data.detail);
      throw err;
    }
  }

  async function getSentMessages() {
    try {
      const response = await axios.get('https://messaging-test.bixly.com/messages/sent/');
      setSentMessages(response.data);
      // console.log(response.data);
    } catch (err) {
      throw err;
    }
  }

  useEffect(() => {
    getSentMessages();
  }, [messages]);

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
      <h2>Sent Messages</h2>
      {messages.length === 0 ? (
        <h4>Inbox is Empty </h4>
      ) : (
        sentMessages.reverse().map(message => (
          <Accordion key={message.id}>
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
                    style={{ position: 'relative', float: 'right' }}
                    onClick={() => handleDelete(message.id)}
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

export default Sent;
