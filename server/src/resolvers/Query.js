async function feed(parent, { feedfilter }, context, info) {
  const where = feedfilter.filter
    ? {
        OR: [
          { description: { contains: feedfilter.filter } },
          { url: { contains: feedfilter.filter } },
        ],
      }
    : {};
  let order = {};
  if (feedfilter.orderBy) {
    order =
      "votes" in feedfilter.orderBy
        ? { votes: { count: feedfilter.orderBy.votes } }
        : feedfilter.orderBy;
  }

  const links = await context.prisma.link.findMany({
    where,
    skip: feedfilter.skip,
    take: feedfilter.take,
    orderBy: order,
  });

  const count = await context.prisma.link.count({ where });

  return {
    id: "test-feed",
    links,
    count,
  };
}

module.exports = {
  feed,
};
