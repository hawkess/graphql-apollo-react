require("dotenv").config({ path: "./../.env" });

const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const { PubSub } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const { getUserId } = require("./utils");

const Link = require("./resolvers/Link");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const User = require("./resolvers/User");
const Subscription = require("./resolvers/Subscription");
const Vote = require("./resolvers/Vote");

const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
  formatError: (err) => {
    if (err.message.startsWith("Database Error: ")) {
      return new Error("Internal server error");
    }
    return err;
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
