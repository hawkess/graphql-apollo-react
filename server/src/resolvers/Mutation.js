const { APP_SECRET } = require("../utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) throw new Error("No such user found");
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) throw new Error("Invalid password");
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
}

async function post(parent, args, context, info) {
  const { userId } = context;
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

async function updateLink(parent, args, context, info) {
  const { userId } = context;
  return await context.prisma.link.update({
    where: {
      id: Number(args.id),
    },
    data: {
      url: args.url,
      description: args.description,
    },
  });
}

async function deleteLink(parent, args, context, info) {
  const { userId } = context;
  return await context.prisma.link.delete({
    where: {
      id: Number(args.id),
    },
  });
}

async function updateUser(parent, args, context, info) {
  const { userId } = context;
  const user = await context.prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new Error("No such user found");
  const valid = await bcrypt.compare(args.oldPassword, user.password);
  if (!valid) throw new Error("Passwords do not match");
  const password = await bcrypt.hash(args.newPassword, 10);
  const updatedUser = await context.prisma.user.update({
    where: { id: userId },
    data: {
      password: password,
    },
  });
  console.log(updatedUser);
  const token = jwt.sign({ userId: userId }, APP_SECRET);
  return {
    token,
    user,
  };
}

async function vote(parent, args, context, info) {
  const { userId } = context;
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });
  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}

module.exports = {
  signup,
  login,
  post,
  updateLink,
  deleteLink,
  updateUser,
  vote,
};
