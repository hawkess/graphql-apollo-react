import React, { useEffect, useState } from "react";
import { Dropdown, Input, Menu } from "semantic-ui-react";

import { AUTH_TOKEN } from "../utils/const";

const Search = ({ setFilter, setSortBy }) => {
  const [searchData, setSearchData] = useState("");
  const [orderBy, setOrderBy] = useState({ orderBy: "createdAt", sort: "asc" });
  const options = [
    { key: "new", text: "new", value: "createdAt", icon: "calendar outline" },
    { key: "top", text: "top", value: "votes", icon: "star" },
  ];

  useEffect(() => {
    setSortBy(orderBy);
    const timeoutId = setTimeout(() => {
      setFilter(searchData);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [setFilter, searchData, setSortBy, orderBy]);

  const handleDropdown = (e, { value }) => {
    setOrderBy({ ...orderBy, orderBy: value });
  };

  return (
    <Menu stackable size="small">
      <Menu.Item>
        <Dropdown
          text="sort by"
          options={options}
          onChange={handleDropdown}
        ></Dropdown>
        <div style={{ marginLeft: "5px" }}>
          {orderBy.orderBy === "createdAt" ? "new" : "top"}
        </div>
      </Menu.Item>
      <Menu.Item position="right">
        <Input
          name="filter"
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
