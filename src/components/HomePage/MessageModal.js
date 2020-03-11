import React, { useState, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { MessageContext } from '../../context/MessageContext';

const MessageModal = () => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [receiver, setReceiver] = useState('');
  const [validated, setValidated] = useState(false);
  const [messages, setMessages] = useContext(MessageContext);

  // controls Modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function getMessages() {
    try {
      const response = await axios.get('https://messaging-test.bixly.com/messages/');
      setMessages(response.data);
      // console.log(response.data);
    } catch (err) {
      throw err;
    }
  }

  const resetModal = () => {
    setShow(false);
    setTitle('');
    setBody('');
    setReceiver('');
    setValidated(false);
  };

  const handleSend = async event => {
    setValidated(true);
    event.preventDefault();
    if (body.length === 0 || receiver.length === 0 || title.length === 0) {
      event.preventDefault();
    } else {
      try {
        const response = await axios.post(`https://messaging-test.bixly.com/messages/`, {
          body: `${body}`,
          receiver: `${receiver}`,
          title: `${title}`,
        });
        resetModal();
        getMessages(); // updates messages for rendering
        // console.log(response);
      } catch (err) {
        resetModal();
        // console.log(err);
        alert('Failed to send message');
        throw err;
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Button variant="primary" onClick={handleShow}>
        Compose
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Form noValidate validated={validated} onSubmit={handleSend}>
          <Modal.Header closeButton>
            <Modal.Title>Create Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Recipient</Form.Label>
              <Form.Control
                type="text"
                placeholder="Recipient"
                onChange={e => setReceiver(e.target.value)}
                value={receiver}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a recipient
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title"
                onChange={e => setTitle(e.target.value)}
                value={title}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide a title</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                placeholder="Enter a message"
                onChange={e => setBody(e.target.value)}
                value={body}
                required
              />
              <Form.Control.Feedback type="invalid">Please provide a message</Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Send
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MessageModal;
