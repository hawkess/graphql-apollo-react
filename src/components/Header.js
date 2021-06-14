import React from "react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";

import { AUTH_TOKEN } from "../utils/const";
import Search from "./Search";

const Header = () => {
  const history = useHistory();
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN);
    history.push("/");
  };

  return (
    <Menu id="header" size="large" secondary>
      <a href="https://github.com/hawkess">
        <Menu.Item link>
          <i className="large github middle aligned icon"></i>
        </Menu.Item>
      </a>
      <NavLink exact to="/" className="item link" activeClassName="active">
        Latest
      </NavLink>
      <NavLink
        exact
        to="/create"
        className="item link"
        activeClassName="active"
      >
        Create
      </NavLink>
      <NavLink
        exact
        to="/login"
        className="item link right"
        activeClassName="active"
        onClick={authToken && logout}
      >
        {authToken ? "Sign out" : "Log in"}
      </NavLink>
      <Menu.Item position="right">
        <Search />
      </Menu.Item>
    </Menu>
  );
};

export default Header;
