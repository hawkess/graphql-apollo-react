const { APP_SECRET } = require("../utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 *
 * @typedef {Object} User
 * @property {number} id - id of user
 * @property {string} name - name of the user
 * @property {string} email - email the user registered with
 * @property {Link[]} links - array of links the user has posted
 */

/**
 * @typedef {Object} Vote
 * @property {number} id - id of vote
 * @property {Link} link - link instance vote was cast on
 * @property {User} user - user instance who cast vote
 */

/**
 * @typedef {Object} Link
 * @property {number} id - id of link
 * @property {string} url - url that link points to
 * @property {string} description - brief description of content at url
 * @property {User} postedBy - instance of user who created the link
 * @property {Vote[]} votes - array of votes cast on the link
 * @property {Date} createdAt - time of link creation
 */

/**
 * Login an existing user and return jwt for auth header
 *
 * @param {*} parent
 * @param {{email: string, password: string}} args - Object containing email and password properties
 * @param {{req: Object, prisma: Object, pubsub: Object, userId: number}} context - Context containing Prisma and PubSub instances and userId returned from getUserId() call if authorization headers are present
 * @param {*} info
 * @returns {{token: Object, user: User}}
 */

async function login(parent, args, context, info) {
  /**
   * @type {User}
   */
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

/**
 * Register a new user, save to the database, and return jwt for auth header
 *
 * @param {*} parent
 * @param {{email: string, name: string, password: string}} args - Object containing user-provided email, name, and password for registration
 * @param {{req: Object, prisma: Object, pubsub: Object, userId: number}} context - Context containing Prisma and PubSub instances and userId returned from getUserId() call if authorization headers are present
 * @param {*} info
 * @returns {{token: Object, user: User }}
 */

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  /**
   * @type {User}
   */
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
}

/**
 * Create a new post and save to the database
 *
 * @param {*} parent
 * @param {{email: string, name: string, password: string}} args - Object containing user-provided email, name, and password for registration
 * @param {{req: Object, prisma: Object, pubsub: Object, userId: number}} context - Context containing Prisma and PubSub instances and userId returned from getUserId() call if authorization headers are present
 * @param {*} info
 * @returns {Link}
 */

async function post(parent, args, context, info) {
  const { userId } = context;
  /**
   * @type {Link}
   */
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

/**
 * Update existing post in the database with new url/description value(s)
 *
 * @param {*} parent
 * @param {Object.<number, any>} args - Object containing id of the link and new string for url and/or description to update
 * @param {{req: Object, prisma: Object, pubsub: Object, userId: number}} context - Context containing Prisma and PubSub instances and userId returned from getUserId() call if authorization headers are present
 * @param {*} info
 * @returns {Link}
 */

async function updateLink(parent, args, context, info) {
  const { userId } = context;
  let data = {};
  data = args.url ? { ...data, url: args.url } : { ...data };
  data = args.description
    ? { ...data, description: args.description }
    : { ...data };
  return await context.prisma.link.update({
    where: {
      id: Number(args.id),
    },
    data,
  });
}

/**
 * Delete existing post
 *
 * @param {*} parent
 * @param {{id: string}} args - Id of post to delete
 * @param {{req: Object, prisma: Object, pubsub: Object, userId: number}} context - Context containing Prisma and PubSub instances and userId returned from getUserId() call if authorization headers are present
 * @param {*} info
 * @returns {{link: Link}
 */

async function deleteLink(parent, args, context, info) {
  const { userId } = context;
  return await context.prisma.link.delete({
    where: {
      id: Number(args.id),
    },
  });
}

/**
 * Update existing user in the database with new password
 *
 * @param {*} parent
 * @param {{oldPassword: string, newPassword: string}} args - Old password to authenticate against, new password to update to
 * @param {{req: Object, prisma: Object, pubsub: Object, userId: number}} context - Context containing Prisma and PubSub instances and userId returned from getUserId() call if authorization headers are present
 * @param {*} info
 * @returns {{token: Object, user: User}}
 */

async function updateUser(parent, args, context, info) {
  const { userId } = context;
  /**
   * @type {User}
   */
  const user = await context.prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new Error("No such user found");
  const valid = await bcrypt.compare(args.oldPassword, user.password);
  if (!valid) throw new Error("Passwords do not match");
  const password = await bcrypt.hash(args.newPassword, 10);
  /**
   * @type {User}
   */
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

/**
 * Vote on an existing post
 *
 * @param {*} parent
 * @param {{linkId: string}} args - Object containing id of link to add vote to
 * @param {{req: Object, prisma: Object, pubsub: Object, userId: number}} context - Context containing Prisma and PubSub instances and userId returned from getUserId() call if authorization headers are present
 * @param {*} info
 * @returns {Vote}
 */

async function vote(parent, args, context, info) {
  const { userId } = context;
  /**
   * @type {Vote}
   */
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

  /**
   * @type {Vote}
   */
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
