import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import Messages from './Messages';

const Home = props => {
  const { path } = useRouteMatch('/home');

  return (
    <div>
      <Route path={path} component={Messages} />
      {props.children}
    </div>
  );
};

export default Home;
