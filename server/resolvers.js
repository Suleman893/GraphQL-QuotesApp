import { quotes, users } from "./fakeDB.js";
import { randomBytes } from "crypto";

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
  Mutation: {
    signupUserDummy: (_, { userNew }) => {
      const id = randomBytes(5).toString("hex");
      users.push({
        id,
        ...userNew,
      });
      return users.find((user) => user.id == id);
    },
  },
};

export default resolvers;
