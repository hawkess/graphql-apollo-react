import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";

import App from "./components/App";
import "./styles/index.css";

const httpLink = createHttpLink({ uri: "http://localhost:4000" });

const client = new ApolloClient({ link: httpLink, cache: new InMemoryCache() });

render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.querySelector("#root")
);
