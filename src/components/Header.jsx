import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.svg";

function Header({ headerButton }) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="лого" />
      <Link to='/sign-up' className="button button_type_header">
        {headerButton}
      </Link>
    </header>
  );
}

export default Header;
