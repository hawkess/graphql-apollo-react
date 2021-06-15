import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Dropdown, Input, Menu } from "semantic-ui-react";
import { AUTH_TOKEN } from "../utils/const";

import Link from "./Link";

const Search = () => {
  const [filter, setFilter] = useState("");
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <Menu stackable size="small">
      <Menu.Item>
        <Dropdown defaultValue="new" text="sort by">
          <Dropdown.Menu>
            <Dropdown.Item value="new" text="new" icon="calendar outline" />
            <Dropdown.Item value="top" text="top" icon="star" />
            {authToken && (
              <Dropdown.Item value="votes" text="my votes" icon="heart" />
            )}
            {authToken && (
              <Dropdown.Item
                value="posts"
                text="my posts"
                icon="file outline"
              />
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
      <Menu.Item position="right">
        <Input
          icon="filter"
          iconPosition="left"
          placeholder="Filter results..."
        />
      </Menu.Item>
    </Menu>
  );
};

export default Search;
