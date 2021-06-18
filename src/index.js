import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { setContext } from "@apollo/client/link/context";
import { split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

import App from "./components/App";
import "./styles/index.css";
import { AUTH_TOKEN } from "./utils/const";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("graphQLErrors", graphQLErrors);
  }
  if (networkError) {
    console.log("networkError", networkError);
  }
});
const httpLink = createHttpLink({ uri: "http://localhost:4000" });
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN),
    },
  },
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  ApolloLink.from([authLink, errorLink, httpLink])
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          feed: {
            merge: false,
          },
        },
      },
      Link: {
        fields: {
          votes: {
            merge: false,
          },
        },
      },
    },
  }),
});

render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.querySelector("#root")
);
