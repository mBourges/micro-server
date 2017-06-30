const Boom = require('boom');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const User = require('./model');

const secret = process.env.SECRET_KEY;
const encodedSecret = new Buffer(secret).toString('base64');

function verifyUniqueUser(request, reply) {
  const id = request.params ? request.params.id : null;

  User.findOne({ Email: request.payload.Email }, (err, user) => {
    if (user) {
      if (user._id.toString() !== id) {
        return reply(Boom.badRequest('Email is taken'));
      }
    }

    reply(request.payload);
  });
}

function verifyCredentials(req, res) {
  const password = req.payload.Password;

  User.findOne(
    { Email: req.payload.Email },
    { Email: 1, Password: 1, Firstname: 1, Lastname: 1, IsAdmin: 1 },
    (err, user) => {
      if(err) {
        return res(Boom.badImplementation(err));
      }

      if (user) {
        console.log(user);
        bcrypt.compare(password, user.Password, (err, isValid) => {
          if (isValid) {
            res(user);
          }
          else {
            res(Boom.badRequest('Incorrect password!'));
          }
        });
      } else {
        res(Boom.badRequest('Incorrect username or email!'));
      }
    });
}

function hashPassword(password, cb) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return cb(err, hash);
    });
  });
}

function createGravatarUrl(email) {
  return `https://www.gravatar.com/avatar/${md5(email).toLowerCase().trim()}`;
}

function createToken(user) {
  let scope;

  if (user.IsAdmin) {
    scope = 'admin';
  }

  return jwt.sign({
    sub: user.id,
    fullname: `${user.Firstname} ${user.Lastname}`,
    email: user.Email,
    gravatar: createGravatarUrl(user.Email),
    scope
  }, encodedSecret, {
    algorithm: 'HS256',
    expiresIn: "1h"
  });
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser,
  verifyCredentials: verifyCredentials,
  hashPassword,
  createToken
};
