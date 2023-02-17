import React, { useContext, useState } from 'react';
import { NavLink as RRNavLink } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import { CredentialsContext } from '../context/CredentialsContext';
import { logout } from '../modules/authManager';

export default function Header({ isLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const { credentials } = useContext(CredentialsContext);

  return (
    <div id="header-component">
      <Navbar className="px-3" color="success" dark expand="md">
        <NavbarBrand id="nav-brand" tag={RRNavLink} to="/">NutriHelp</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar justified>
            { /* When isLoggedIn === true, we will render the Home link */}
            {isLoggedIn && credentials.role !== "Admin" &&
              <>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/">Home</NavLink>
                </NavItem>
              </>
            }
            {credentials.role === "User" &&
              <>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/profile">Profile</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/daily">Daily</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/support">Support</NavLink>
                </NavItem>
              </>
            }
            {credentials.role === "Admin" &&
              <>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/">Users</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/tickets">Tickets</NavLink>
                </NavItem>
              </>
            }
            {isLoggedIn &&
              <>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/login" onClick={logout}>{isOpen ? `Logout ${credentials.email}` : "Logout"}</NavLink>
                </NavItem>
              </>
            }
            {!isLoggedIn &&
              <>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/login">Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/register">Register</NavLink>
                </NavItem>
              </>
            }
          </Nav>
        </Collapse>
        {!isOpen && isLoggedIn &&
          <span className="white">{credentials.email}</span>
        }
      </Navbar>
    </div>
  );
}
