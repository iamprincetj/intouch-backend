"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeDefs = `
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        phoneNumber: String!
        role: String!
        organizationId: String!
        createdAt: String!
    }

    type Organization {
      id: ID!
      organizationName: String!
      organizationType: String!
      organizationLocation: String!
      leaderFirstName: String!
      leaderLastName: String!
      leaderNumber: String!
    }

    type ReturnOrganization {
      id: ID!
      organizationName: String!
      organizationType: String!
      organizationLocation: String!
    }

    type Token {
      value: String!
    }

    type ReturnedUser {
      token: Token!
      user: User!
    }

    type Query {
        allOrganization: [ReturnOrganization!]!
        allUsers: [User!]!
        allUsersInOrganization(organizationId: String): [User!]!
        findUser(username: String!): User
        me: User!
    }

    type Mutation {
      createOrganizationAndLeader(
        organizationName: String!
        organizationType: String!
        organizationLocation: String!
        organizationPassword: String!
        leaderFirstName: String!
        leaderLastName: String!
        leaderNumber: String!
        leaderPassword: String!
      ): Organization
      
      addAdmin(
        firstName: String!
        lastName: String!
        phoneNumber: String!
        password: String!
        role: String!
      ): User

      addUser(
        firstName: String!
        lastName: String!
        phoneNumber: String!
        role: String!
      ): User

      editUser(
        firstName: String!
        lastName: String!
        phoneNumber: String!
        password: String
        role: String
      ): User

      loginToOrganization(
        organizationName: String!
        organizationPassword: String!
      ): ReturnOrganization

      login(
        phoneNumber: String!
        password: String!
      ): ReturnedUser
    }
`;
exports.default = typeDefs;
