import React from "react";
import Link from "./Link";

const LinkList = (props) => {
  const links = [
    {
      id: "1",
      description: "Prisma gives you a powerful database toolkit 😎",
      url: "https://prisma.io",
    },
    {
      id: "2",
      description: "The best GraphQL client",
      url: "https://www.apollographql.com/docs/react/",
    },
  ];
  return (
    <div>
      {links.map((link) => (
        <Link key={link.id} link={link} />
      ))}
    </div>
  );
};

export default LinkList;
