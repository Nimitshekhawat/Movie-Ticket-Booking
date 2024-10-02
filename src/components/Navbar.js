import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "./Navbar.css";

export default function Navbar() {
  const firebase = useFirebase();
  const auth = getAuth();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu
  const detailsRef = useRef(null); // Reference to the <details> element

  // Function to toggle hamburger menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to close dropdown when an item is clicked
  const handleDropdownClose = () => {
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
  };

  const handleClickOutside = (event) => {
    if (detailsRef.current && !detailsRef.current.contains(event.target)) {
      handleDropdownClose();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const getUserData = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        try {
          const userDetails = await firebase.fetchUserDetails(uid);
          setName(userDetails.name);
          setEmail(userDetails.email);
          setIsLoggedIn(true);
          setIsAdmin(userDetails.isAdmin);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => getUserData();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <>
      <link rel="stylesheet" href="Navbar.css" />
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
      />

      <nav className="nav">
        <a href="/" className="logo">
          Ticketify
        </a>
        <button className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <li>
            <NavLink exact to="/" className={({ isActive }) => (isActive ? "active-link" : "inactive-link")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/AboutUs" className={({ isActive }) => (isActive ? "active-link" : "inactive-link")}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/ContactUs" className={({ isActive }) => (isActive ? "active-link" : "inactive-link")}>
              Contact Us
            </NavLink>
          </li>
          {!isLoggedIn && (
            <li>
              <NavLink to="/Login" className={({ isActive }) => (isActive ? "active-link" : "inactive-link")}>
                Login
              </NavLink>
            </li>
          )}
          {isAdmin && (
            <li>
              <NavLink to="/AddMovie" className={({ isActive }) => (isActive ? "active-link" : "inactive-link")}>
                List Your Show
              </NavLink>
            </li>
          )}
        </ul>

        <div className={isLoggedIn ? "dropdown-container" : "hide-div"}>
          <details className="dropdown right" ref={detailsRef}>
            <summary className="avatar">
              <img
                src="https://gravatar.com/avatar/00000000000000000000000000000000?d=mp"
                alt="Avatar"
              />
            </summary>
            <ul>
              <li>
                <p>
                  <span className="block bold">{name}</span>
                  <span className="block italic">{email}</span>
                </p>
              </li>

              <li>
                <Link to="/Account" onClick={handleDropdownClose}>
                  <span className="material-symbols-outlined">account_circle</span> Account
                </Link>
              </li>
              <li>
                <Link to="/ContactUs" onClick={handleDropdownClose}>
                  <span className="material-symbols-outlined">help</span> Help
                </Link>
              </li>

              <li className="divider"></li>
              <li>
                <a onClick={() => { handleLogout(); handleDropdownClose(); }}>
                  <span className="material-symbols-outlined">logout</span> Logout
                </a>
              </li>
            </ul>
          </details>
        </div>
      </nav>
    </>
  );
}
