import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import typeDefs from "./schemaGql.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

//DB Connection
// mongoose.connect("MONGO_URI", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.on("connected", () => {
//   console.log("Connected to DB");
// });

// mongoose.connection.on("error", () => {
//   console.log("Error Connecting to DB");
// });

//Import models here
import "./models/Users.js";
import "./models/Quotes.js";

import resolvers from "./resolvers.js";

// Create a new Apollo Server instance with type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  //Context: The context are kind of middlewares, any logic before reaching the resolver
  context: ({ req }) => {
    const { authorization } = req.headers;
    if (authorization) {
      const { userId } = jwt.verify(authorization, "JWT_SECRET");
      return { userId };
    }
  },
  // If you prefer a custom GraphQL playground, you can use the following plugin
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

// By default, the server listens on port 4000
server.listen().then(({ url }) => {
  console.log(`The server started at ${url}`);
});
