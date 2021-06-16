import React, { useEffect, useState } from "react";
import { Dropdown, Input, Menu } from "semantic-ui-react";

import { AUTH_TOKEN } from "../utils/const";

const Search = ({ setFilter }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    if (searchData) {
      const timeoutId = setTimeout(() => {
        setFilter(searchData);
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [setFilter, searchData]);

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
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
        />
      </Menu.Item>
    </Menu>
  );
};

export default Search;
