import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

import App from "./components/App";
import "./styles/index.css";
import { AUTH_TOKEN } from "./utils/const";

const httpLink = createHttpLink({ uri: "http://localhost:4000" });
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.querySelector("#root")
);
