import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

class Header extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a>Giftest</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#"><FormattedMessage id="header.home" /></NavItem>
            <NavItem eventKey={2} href="#">Language Changer</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Header.propTypes = {
};

export default Header;
