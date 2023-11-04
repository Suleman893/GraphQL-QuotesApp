import { quotes, users } from "./fakeDB.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Users = mongoose.model("User");
const Quotes = mongoose.model("Quote");

// Define GraphQL resolvers to handle queries
const resolvers = {
  Query: {
    users: () => users,
    quotes: () => quotes,
    user: (_, args) => users.find((user) => user._id == args._id),
    iquote: (_, args) => quotes.filter((quote) => quote.by == args.by),
  },
  User: {
    quotes: (user) => quotes.filter((quote) => quote.by == user._id),
  },
  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await Users.findOne({ email: userNew.email });
      if (user) {
        throw new Error("User already exists");
      } else {
        const hashedPass = await bcrypt.hash(userNew.password, 12);
        const newUser = new Users({
          ...userNew,
          password: hashedPass,
        });
        return await newUser.save();
      }
    },

    signinUser: async (_, { userSignin }) => {
      const user = await Users.findOne({ email: userSignin.email });
      if (!user) {
        throw new Error("User doesnt exist");
      }
      const doMatch = await bcrypt.compare(userSignin.password, user.password);
      if (!doMatch) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign({ userId: user._id });

      return { token };
    },
    //Params of resolver: 1) Parent 2) Args 3) Context
    createQuote: async (_, { name }, { userId }) => {
      if (!userId) throw new Error("You must be logged in");

      const newQuote = new Quotes({
        name,
        by: userId,
      });

      await newQuote.save();
      return "Quote saved";
    },
  },
};

export default resolvers;
