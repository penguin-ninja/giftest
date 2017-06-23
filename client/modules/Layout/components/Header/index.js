import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import LangChanger from 'modules/Intl/LangChanger';

import logo from './logo.png';
import styles from './styles.css';

class Header extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/" className={styles.logoLink}>
              <img alt="logo" src={logo} className={styles.logoImg} />
            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#"><FormattedMessage id="header.home" /></NavItem>
            <LangChanger />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Header.propTypes = {
};

export default Header;
