import React, { Component, PropTypes } from 'react';
import {Navbar, Nav, NavDropdown, NavItem, MenuItem} from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class Header extends Component {
  render() {
    return (
      <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>Flight-inventory</Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <AccountsUIWrapper />
        </Nav>
      </Navbar>
    );
  }
}

Header.propTypes = {
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
  };
}, Header);
