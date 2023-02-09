import React, { useEffect, useState } from 'react';
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
import { getEmail, logout } from '../modules/authManager';

export default function Header({ isLoggedIn, role }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      setEmail(getEmail())
    }
  }, [isLoggedIn])

  return (
    <div id="header-component">
      <Navbar className="px-3" color="success" dark expand="md">
        <NavbarBrand id="nav-brand" tag={RRNavLink} to="/">NutriHelp</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar justified>
            { /* When isLoggedIn === true, we will render the Home link */}
            {isLoggedIn &&
              <>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/">Home</NavLink>
                </NavItem>
              </>
            }
            {role === "User" &&
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
            {role === "Admin" &&
              <>
                {/* <NavItem>
                  <NavLink tag={RRNavLink} to="/users">Users</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/tickets">Tickets</NavLink>
                </NavItem> */}
              </>
            }
            {isLoggedIn &&
              <>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/login" onClick={logout}>{isOpen ? `Logout ${email}` : "Logout"}</NavLink>
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
          <span className="white">{email}</span>
        }
      </Navbar>
    </div>
  );
}
