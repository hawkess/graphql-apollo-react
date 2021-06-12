import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";

import "../styles/App.css";
import CreateLink from "./CreateLink";
import Header from "./Header";
import LinkList from "./LinkList";
import Login from "./Login";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div>
      <Header loggedin={loggedIn} />
      <div>
        <Switch>
          <Route exact path="/" component={LinkList} />
          <Route exact path="/create" component={CreateLink} />
          <Route
            exact
            path="/login"
            render={() => <Login setLoggedIn={setLoggedIn} />}
          />
        </Switch>
      </div>
    </div>
  );
};

export default App;
