import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Login from './components/LoginPage/Login';
import Home from './components/HomePage/Home';
import Messages from './components/HomePage/Messages';
import Sent from './components/HomePage/Sent';
import ProtectedRoute from './ProtectedRoute';
import appStyles from './app.module.scss';
import { AuthContext } from './context/AuthContext';
import Nav from './components/HomePage/Nav';
import { MessageProvider } from './context/MessageContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [authTokens, setAuthTokens] = useState();
  const [username, setUsername] = useState('');

  const history = useHistory();

  const handleLogout = () => {
    localStorage.clear('token');
    setAuthTokens('');
  };

  const setTokens = data => {
    localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('tokens'));
    setAuthTokens(token);
    if (token) {
      axios.defaults.headers.common.Authorization = `Token ${token}`;
      history.push('/home');
    } else {
      history.push('/login');
    }
  }, [history, authTokens]);
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens, username, setUsername }}>
      <MessageProvider>
        <h1 style={{ paddingLeft: '5vw' }}>Send It</h1>
        <div className={appStyles.container}>
          <div className={appStyles.navigate}>{authTokens ? <Nav /> : <span />}</div>
          <div className={appStyles.inbox}>
            <Switch>
              <Route path="/login" component={Login} />
              <ProtectedRoute exact path="/home" component={Home} />
              <ProtectedRoute path="/home/messages" component={Messages} />
              <ProtectedRoute path="/home/sent" component={Sent} />
              <Route component={Login} />
            </Switch>
          </div>
          <div className={appStyles.userInfo}>
            {authTokens ? (
              <div>
                <Button variant="outline-primary" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </MessageProvider>
    </AuthContext.Provider>
  );
};
export default App;
