import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import loginStyles from './login.module.scss';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [token, setToken] = useState('');
  // const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);

  const { setAuthTokens, username, setUsername } = useAuth();
  const history = useHistory();

  const handleSubmit = async event => {
    setValidated(true);
    event.preventDefault();
    if (username.length <= 0 || password.length <= 0) {
      event.preventDefault();
    } else {
      try {
        const response = await axios.post('https://messaging-test.bixly.com/api-token-auth/', {
          username,
          password,
        });

        setToken(response.data.token);
        setValidated(true);
        if (response.status === 200) {
          setShowErrorMessage(false);
          setTimeout(() => {
            setAuthenticated(true);
          }, 1000);
        }
        // console.log(response);
      } catch (err) {
        setShowErrorMessage(true);
        // console.log(err);
      }
    }
  };

  useEffect(() => {
    if (authenticated) {
      setAuthTokens(token);
      axios.defaults.headers.common.Authorization = `Token ${token}`;
      history.push('/home');
      // console.log('pushed new url');
    }
  }, [history, authenticated, token, setAuthTokens]);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Login</h1>
      <Form
        noValidate
        validated={validated}
        className={loginStyles.formContainer}
        onSubmit={handleSubmit}
      >
        {showErrorMessage ? (
          <Alert variant="danger" onClose={() => setShowErrorMessage(false)} dismissible>
            <h6>Wrong username or password</h6>
          </Alert>
        ) : (
          <span />
        )}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter username"
            onChange={e => setUsername(e.target.value)}
            value={username}
            required
          />
          <Form.Control.Feedback type="invalid">Please provide a username</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            required
          />
          <Form.Control.Feedback type="invalid">Please provide a password</Form.Control.Feedback>
        </Form.Group>
        <div className={loginStyles.divContainer}>
          <Button variant="primary" type="submit" style={{ marginRight: '60px' }}>
            Login
          </Button>
          <Button variant="secondary" disabled>
            Sign up
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
