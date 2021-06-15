import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "../styles/App.css";
import CreateLink from "./CreateLink";
import Header from "./Header";
import LinkList from "./LinkList";
import Login from "./Login";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Container text id="parent-container">
      <Header loggedin={loggedIn} />
      <Switch>
        <Route exact path="/" component={LinkList} />
        <Route exact path="/create" component={CreateLink} />
        <Route
          exact
          path="/login"
          render={() => <Login setLoggedIn={setLoggedIn} />}
        />
      </Switch>
    </Container>
  );
};

export default App;
