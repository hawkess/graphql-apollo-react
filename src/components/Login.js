import React, { useState } from "react";
import { useHistory } from "react-router";
import { useMutation, gql } from "@apollo/client";
import { Button, Form, Grid, Header, Segment } from "semantic-ui-react";

import { AUTH_TOKEN } from "../const";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

const Login = ({ setLoggedIn }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    login: true,
    email: "",
    password: "",
    name: "",
  });

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formData.email,
      password: formData.password,
    },
    onCompleted: ({ login }) => {
      localStorage.setItem(AUTH_TOKEN, login.token);
      history.push("/");
      setLoggedIn(true);
    },
  });

  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    },
    onCompleted: ({ signup }) => {
      localStorage.setItem(AUTH_TOKEN, signup.token);
      history.push("/");
      setLoggedIn(true);
    },
  });

  return (
    <Grid id="form-container" textAlign="center" verticalAlign="middle">
      <Grid.Column width={8}>
        <Segment raised padded>
          <Header>{formData.login ? "Login" : "Sign Up"}</Header>
          <Form
            size="large"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {!formData.login && (
              <Form.Field>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  type="text"
                  placeholder="Enter your name"
                />
              </Form.Field>
            )}
            <Form.Field>
              <input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                type="text"
                placeholder="Enter your email"
              />
            </Form.Field>
            <Form.Field>
              <input
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                type="password"
                placeholder="Enter your password"
              />
            </Form.Field>
            <Button
              className="form-button"
              fluid
              color={formData.login ? "teal" : "primary"}
              onClick={formData.login ? login : signup}
            >
              {formData.login ? "Login" : "Create Account"}
            </Button>
            <Button
              className="form-button"
              fluid
              color="black"
              onClick={(e) =>
                setFormData({ ...formData, login: !formData.login })
              }
            >
              {formData.login
                ? "Create an account"
                : "Already have an account?"}
            </Button>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
