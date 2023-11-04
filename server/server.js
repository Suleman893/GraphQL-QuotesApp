import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { quotes, users } from "./fakeDB.js";

// Define GraphQL type definitions using the `gql` template string
const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
    quotes: [Quote]
    iquote(by: ID!): [Quote]
  }

  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
    quotes: [Quote]
  }

  type Quote {
    name: String
    by: ID
  }
`;

// Define GraphQL resolvers to handle queries
const resolvers = {
  Query: {
    users: () => users,
    quotes: () => quotes,
    user: (_, args) => users.find((user) => user.id == args.id),
    iquote: (_, args) => quotes.filter((quote) => quote.by == args.by),
  },
  User: {
    quotes: (user) => quotes.filter((quote) => quote.by == user.id),
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
