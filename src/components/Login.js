import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Form, Header, Segment } from "semantic-ui-react";

const Login = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    login: true,
    email: "",
    password: "",
    name: "",
  });

  return (
    <Container>
      <Segment raised padded>
        <Header>{formData.login ? "Login" : "Sign Up"}</Header>
        <Form
          size="large"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {formData.login && (
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
              type="text"
              placeholder="Enter your password"
            />
          </Form.Field>
          <Button
            color={formData.login ? "teal" : "primary"}
            onClick={(e) => console.log(e)}
          >
            {formData.login ? "Login" : "Create Account"}
          </Button>
          <Button
            color="black"
            onClick={(e) =>
              setFormData({ ...formData, login: !formData.login })
            }
          >
            {formData.login ? "Login" : "Create Account"}
          </Button>
        </Form>
      </Segment>
    </Container>
  );
};

export default Login;
