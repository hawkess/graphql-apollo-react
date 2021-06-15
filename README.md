### Reddit/Hackernews/Generic link aggregator clone

Made using Node/Prisma/SQLite on the backend and Apollo/React on the frontend with GraphQL.

### Work in progress:

Currently only supports liking/unliking posts and basic create/read on links and users from the front end. Mutations exist to update and delete on the backend if you want to manually invoke them with the GraphQL playground.
JWT is stored in localStorage just for simplicity's sake, so don't use this for production with any sensitive data.
