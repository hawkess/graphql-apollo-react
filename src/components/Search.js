import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Input, Menu } from "semantic-ui-react";

import Link from "./Link";


const Search = () => {
  const [filter, setFilter] = useState("");

  return (
    <Menu.Item position="right">
        <Input placeholder="Filter results..." />
    </Menu.Item>
  );
};
