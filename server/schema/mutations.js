const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLID } = graphql;
const mongoose = require("mongoose");
const AuthService = require("../services/auth");

const UserType = require("./types/user_type");
const User = mongoose.model("user");
const QuestionType = require("./types/question_type");
const Question = mongoose.model("question");
const AnswerType = require("./types/answer_type");
const Answer = mongoose.model("answer");

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        register: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                username: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(_, args) {
                return AuthService.register(args);
            }
        },
        login: {
            type: UserType,
            args: {
                username: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(_, args) {
                return AuthService.login(args);
            }
        },
        logout: {
            type: UserType,
            args: {
                _id: { type: GraphQLID }
            },
            resolve(_, args) {
                return AuthService.logout(args);
            }
        },
        verifyUser: {
            type: UserType,
            args: {
                token: { type: GraphQLString }
            },
            resolve(_, args) {
                return AuthService.verifyUser(args);
            }
        },
        newQuestion: {
            type: QuestionType,
            args: {
                question: { type: GraphQLString}
            },
            async resolve(_, { question}, ctx ) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                if (validUser.loggedIn) {
                    return new Question({question, user: validUser._id }).save()
                } else {
                    throw new Error("Must be logged in to create a question")
                }
            }
        },
        newAnswer: {
            type: AnswerType,
            args: {
                body: { type: GraphQLString },
                questionId: { type: GraphQLID },
                authorId: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(_, { body }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                if (validUser.loggedIn) {
                    return new Answer({body, user: authorId, question: questionId }).save()
                } else {
                    throw new Error("Must be logged in to create an answer")
                }
            }
        }
    }
});

module.exports = mutation;