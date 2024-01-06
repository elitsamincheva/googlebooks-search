import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from '@as-integrations/next'

import typeDefs from "@/graphql/schema.graphql"
import resolvers from "@/graphql/resolvers"
// import allowCors from "@/utils/cors"

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
})

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => ({ req, res }),
})

// export default allowCors(handler)
export default handler;