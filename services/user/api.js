const { notFound, badRequest, badImplementation } = require('boom');
const Joi = require('joi');
const User = require('./model');
const { createUserSchema, updateUserSchema, authenticateUserSchema } = require('./validationSchema');
const { verifyUniqueUser, hashPassword, verifyCredentials, createToken } = require('./utils');

module.exports = (server, options = {}) => {
   server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: {
        strategy: 'jwt'
      }
    },
    handler: (request, reply) => {
      User.find()
        .exec((err, users) => {
          if (err) {
            return reply(badRequest(err));
          }

          if (!users.length) {
            return reply(notFound('No users found!'));
          }

          reply(users);
        });
    }
  });

  server.route({
    method: 'GET',
    path:'/{id}',
    config: {
      auth: {
        strategy: 'jwt'
      },
      validate: {
        params: { id: Joi.string().hex().required() }
      }
    },
    handler: (request, reply) => {
      User.findById(request.params.id)
        .exec((err, user) => {
          if(err) {
            return reply(badRequest(err));
          }

          if (!user) {
            return reply(notFound('No user found!'));
          }

          reply(user);
        });
    }
  });

  server.route({
    method: 'POST',
    path:'/',
    config: {
      auth: {
        strategy: 'jwt',
        scope: 'admin'
      },
      validate: {
        payload: createUserSchema
      },
      pre: [
        { method: verifyUniqueUser }
      ]
    },
    handler: (request, reply) => {
      const user = new User(request.payload);

      hashPassword(request.payload.Password, (err, hash) => {
        if (err) {
          return reply(badRequest(err));
        }

        user.Password = hash;

        user.save((err, user) => {
          if(err) {
            return reply(badImplementation(err));
          }

          reply({ });
        });
      });
    }
  });

  server.route({
    method: 'PUT',
    path:'/{id}',
    config: {
      auth: {
        strategy: 'jwt'
      },
      validate: {
        payload: updateUserSchema,
        params: { id: Joi.string().hex().required() }
      },
      pre: [
        { method: verifyUniqueUser, assign: 'user' }
      ]
    },
    handler: (request, reply) => {
      const id = request.params.id;

      User.findOneAndUpdate({ _id: id }, request.pre.user, (err, user) => {
          if (err) {
            return reply(badRequest(err));
          }

          if (!user) {
            return reply(notFound('User not found!'));
          }

          reply({ message: 'User updated!' });
        });
    }
  });

  server.route({
    method: 'POST',
    path: '/authenticate',
    config: {
      auth: false,
      pre: [
        { method: verifyCredentials, assign: 'user' }
      ],
      validate: {
        payload: authenticateUserSchema
      }
    },
    handler: (req, res) => {
      res({ token: createToken(req.pre.user) });
    }
  });
};
