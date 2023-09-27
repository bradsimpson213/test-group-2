import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import { NavLink } from 'react-router-dom';
// import OpenModalButton from "../OpenModalButton";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const sessionUser = useSelector((state) => state.session.user);
  // console.log('SESSION USER:', sessionUser)

  // const openMenu = () => {
  //   if (showMenu) return;
  //   setShowMenu(true);
  // };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  // const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  // const closeMenu = () => setShowMenu(false);

  return (
    // <>
    //   <button onClick={openMenu}>
    //     Login
    //   </button>
    //   <ul className={ulClassName} ref={ulRef}>
    //     {user ? (
    //       <>
    //         <li>{user.username}</li>
    //         <li>{user.email}</li>
    //         <li>
    //           <button onClick={handleLogout}>Log Out</button>
    //         </li>
    //       </>
    //     ) : (
    //       <>
    //         <OpenModalButton
    //           buttonText="Log In"
    //           onItemClick={closeMenu}
    //           modalComponent={<LoginFormModal />}
    //         />

    //         <OpenModalButton
    //           buttonText="Sign Up"
    //           onItemClick={closeMenu}
    //           modalComponent={<SignupFormModal />}
    //         />
    //       </>
    //     )}
    //   </ul>
    // </>
    <>
      <div id="nav-session-links">

        {sessionUser ?
          <button
            onClick={handleLogout}
            className="login-logout"
          >
            Log Out
          </button> :
          <NavLink
            exact to="/login"
            className="login-logout"
          >
            Login
          </NavLink>}
      </div>
    </>
    // <NavLink exact to="/signup">Sign up</NavLink>
  );
}

export default ProfileButton;
