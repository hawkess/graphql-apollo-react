import React from "react";
import { useHistory } from "react-router";
import { NavLink, withRouter } from "react-router-dom";
import { Menu } from "semantic-ui-react";

const Header = () => {
  const history = useHistory();
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
      <Menu.Item position="right">Log In</Menu.Item>
    </Menu>
  );
};

export default Header;
