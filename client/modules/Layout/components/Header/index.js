import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { IndexLinkContainer } from 'react-router-bootstrap';
import LangChanger from 'modules/Intl/LangChanger';

import logo from './logo.png';
import styles from './styles.css';

class Header extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/" className={styles.logoLink}>
              <img alt="logo" src={logo} className={styles.logoImg} />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <IndexLinkContainer to={{ pathname: '/' }}>
              <NavItem eventKey={1}><FormattedMessage id="header.home" /></NavItem>
            </IndexLinkContainer>
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
