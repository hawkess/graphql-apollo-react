async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } },
        ],
      }
    : {};

  const order =
    "votes" in args.orderBy
      ? { votes: { count: args.orderBy.votes } }
      : args.orderBy;
  console.log(order);
  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: order,
  });

  const count = await context.prisma.link.count({ where });

  return {
    id: "main-feed",
    links,
    count,
  };
}

module.exports = {
  feed,
};
