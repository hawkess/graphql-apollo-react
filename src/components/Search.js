import React, { useEffect, useState } from "react";
import { Dropdown, Icon, Input, Menu } from "semantic-ui-react";

const Search = ({ setFilter, setSortBy }) => {
  const [searchData, setSearchData] = useState("");
  const [orderBy, setOrderBy] = useState({ orderBy: "createdAt", asc: true });
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
        <span style={{ margin: "0 5px" }}>
          {orderBy.orderBy === "createdAt" ? "new" : "top"}
        </span>
        <Icon
          name={
            orderBy.asc ? "sort content ascending" : "sort content descending"
          }
          onClick={() => setOrderBy({ ...orderBy, asc: !orderBy.asc })}
          style={{ cursor: "pointer" }}
        />
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
