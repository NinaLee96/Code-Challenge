import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import MessageModal from './MessageModal';
import navStyles from './nav.module.scss';

const Nav = () => {
  const { path } = useRouteMatch('/home');
  return (
    <div>
      <ul className={navStyles.list}>
        <li className={navStyles.box}>
          <Link to={`${path}/messages`}>Inbox</Link>
        </li>
        <li>
          <Link to={`${path}/sent`}>Sent Messages</Link>
        </li>
      </ul>
      <MessageModal style={{ textAlign: 'center' }} />
    </div>
  );
};

export default Nav;
