import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

// Define GraphQL type definitions using the `gql` template string
const typeDefs = gql`
  type Query {
    greet: String
  }
`;

// Define GraphQL resolvers to handle queries
const resolvers = {
  Query: {
    greet: () => "Hello world",
  },
};

// Create a new Apollo Server instance with type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // If you prefer a custom GraphQL playground, you can use the following plugin
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

// By default, the server listens on port 4000
server.listen().then(({ url }) => {
  console.log(`The server started at ${url}`);
});
