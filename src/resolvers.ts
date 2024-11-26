import { GraphQLError } from 'graphql';
import { CurrentUser, OrganizationParam, UserParam } from './types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './utils/config';
import { User, Organization } from './model/';
import { dataToJson } from './utils/helper-functions';

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlByaW5jZSBUaiIsImlkIjozLCJpYXQiOjE3MzA2NzM3MjB9.uObW6JVnc6JIvHYgD4yGNo1y13sBjC8VDiU14bRU6Qw

const resolvers = {
  Query: {
    allOrganization: async () => {
      const organizations = await Organization.findAll();
      return organizations;
    },
    allUsersInOrganization: async (
      _: unknown,
      args: { organizationId: string },
      { currentUser }: CurrentUser
    ) => {
      let id;
      if (currentUser) {
        const currentUserJson = dataToJson(currentUser);
        id = currentUserJson.organizationId;
      } else {
        const { organizationId } = args;
        id = organizationId;
      }

      const currentUserOrganization = await Organization.findByPk(id, {
        include: {
          model: User,
        },
      });

      const organizationJson = dataToJson(currentUserOrganization!);

      const modifiedUsers = organizationJson.users.map((item: any) => {
        return {
          ...item,
          createdAt: item.createdAt.toString(),
        };
      });

      return modifiedUsers;
    },
    allUsers: async () => {
      const users = await User.findAll();
      return users;
    },
    findUser: async (_: unknown, args: { username: string }) => {
      const { username } = args;
      const user = await User.findOne({
        where: {
          username: username,
        },
      });

      if (!user) {
        throw new GraphQLError('Invalid User', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: username,
          },
        });
      }

      return user;
    },

    me: async (_: unknown, _args: unknown, { currentUser }: CurrentUser) => {
      return currentUser;
    },
  },

  Mutation: {
    createOrganizationAndLeader: async (
      _: unknown,
      args: OrganizationParam
    ) => {
      // destruct the argument
      const {
        organizationName,
        organizationType,
        organizationLocation,
        organizationPassword,
        leaderFirstName,
        leaderLastName,
        leaderNumber,
        leaderPassword,
      } = args;
      const organization = await Organization.findOne({
        where: {
          organizationName,
        },
      });

      if (organization) {
        throw new GraphQLError(
          'An organization with that name already exists',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: organizationName,
            },
          }
        );
      }

      const organizationPwdHash = await bcrypt.hash(organizationPassword, 10);
      // create the organization
      const leaderOrganization = await Organization.create({
        organizationName,
        organizationType,
        organizationLocation,
        organizationPassword: organizationPwdHash,
      });

      // parse the returned value of the creations to json format
      const leaderOrganizationJson = dataToJson(leaderOrganization);

      // hash the password for encryption
      const passwordHash = await bcrypt.hash(leaderPassword, 10);

      // now create the user with all the above for it's property
      // 2. organization id
      await User.create({
        firstName: leaderFirstName,
        lastName: leaderLastName,
        phoneNumber: leaderNumber,
        password: passwordHash,
        role: 'leader',
        organizationId: leaderOrganizationJson.id,
      });

      return {
        ...leaderOrganizationJson,
        leaderFirstName,
        leaderLastName,
        leaderNumber,
      };
    },
    addAdmin: async (
      _: unknown,
      args: UserParam,
      { currentUser }: CurrentUser
    ) => {
      const currentUserJson = dataToJson(currentUser);
      if (!(currentUserJson && currentUserJson.role === 'leader')) {
        throw new GraphQLError('not authenticated, action for a Leader only');
      }
      const { firstName, lastName, phoneNumber, password, role } = args;

      if (role.toLowerCase() === 'leader') {
        throw new GraphQLError(
          `A Leader already exist in this Organization with username: ${currentUserJson.username}`
        );
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        firstName,
        lastName,
        password: passwordHash,
        phoneNumber,
        role,
        organizationId: currentUserJson.organizationId,
      });

      return user;
    },

    addUser: async (
      _: unknown,
      args: UserParam,
      { currentUser }: CurrentUser
    ) => {
      const currentUserJson = dataToJson(currentUser);

      if (!(currentUserJson && currentUserJson.role === 'admin')) {
        throw new GraphQLError('Action for an Admin only');
      }

      const { firstName, lastName, phoneNumber, role } = args;

      if (role.toLowerCase() === 'admin') {
        throw new GraphQLError('not authenticated, action for a Leader only');
      }
      const user = await User.create({
        firstName,
        lastName,
        phoneNumber,
        role,
        organizationId: currentUserJson.organizationId,
      });

      return user;
    },

    editUser: async (
      _: unknown,
      args: UserParam,
      { currentUser }: CurrentUser
    ) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const userJson = currentUser.toJSON();

      const user = await User.findByPk(userJson.id);

      if (!user) {
        throw new GraphQLError('Unknown User', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const updatedUser = await user.update(args);

      // const userJson = user.toJSON();

      return updatedUser;
    },

    loginToOrganization: async (
      _: unknown,
      args: { organizationName: string; organizationPassword: string }
    ) => {
      const { organizationName, organizationPassword } = args;
      const organization = await Organization.findOne({
        where: {
          organizationName,
        },
      });

      if (!organization) {
        throw new GraphQLError(`No organization with name: ${organizationName}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: organizationName,
          },
        });
      }

      const organizationJson = dataToJson(organization!);

      const passwordCorrect = await bcrypt.compare(
        organizationPassword,
        organizationJson.organizationPassword
      );

      if (!passwordCorrect) {
        throw new GraphQLError('Incorrect password!', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: organizationPassword,
          },
        });
      }

      return {
        id: organizationJson.id,
        organizationName: organizationJson.organizationName,
        organizationType: organizationJson.organizationType,
        organizationLocation: organizationJson.organizationLocation,
      };
    },

    login: async (
      _: unknown,
      args: { phoneNumber: string; password: string }
    ) => {
      const { phoneNumber, password } = args;
      const user = await User.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
      });

      const userJson = user?.toJSON();

      const passwordCorrect = await bcrypt.compare(password, userJson.password);

      if (!user) {
        throw new GraphQLError(`No user with phone number: ${phoneNumber}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: phoneNumber
          },
        });
      }

      if (!passwordCorrect) {
        throw new GraphQLError(`Incorrect password`, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const dataForToken = {
        phoneNumber: userJson.phoneNumber,
        id: userJson.id,
      };

      const token = jwt.sign(dataForToken, JWT_SECRET!);

      return { token: {value: token}, user:  userJson};
    },
  },
};

export default resolvers;
