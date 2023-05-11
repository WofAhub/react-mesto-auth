import React from "react";
import logo from "../images/logo.svg";

function Header({ headerButton }) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="лого" />
        {headerButton}
    </header>
  );
}

export default Header;
