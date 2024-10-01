import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu state
  };

  return (
    <>
      <link rel="stylesheet" href="Navbar.css" />
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
      />
      <script src="NavbarScript.js" defer></script>

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
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/AboutUs">About Us</Link>
          </li>
          <li>
            <Link to="/ContactUs">Contact Us</Link>
          </li>
          <li className={isLoggedIn ? "hide-div" : ""}>
            <Link to="/Login">Login</Link>
          </li>
          <li className={isAdmin ? "" : "hide-div"}>
            <Link to="/AddMovie">List Your Show</Link>
          </li>
        </ul>

        <div className={isLoggedIn ? "dropdown-container" : "hide-div"}>
          <details className="dropdown right">
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
                <Link to={"/Account"}>
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>{" "}
                  Account
                </Link>
              </li>
              <li>
                <Link to={"/ContactUs"}>
                  <span className="material-symbols-outlined">help</span> Help
                </Link>
              </li>

              <li className="divider"></li>
              <li>
                <a onClick={handleLogout}>
                  <span className="material-symbols-outlined">logout</span>{" "}
                  Logout
                </a>
              </li>
            </ul>
          </details>
        </div>
      </nav>
    </>
  );
}
