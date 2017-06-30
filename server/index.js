const path = require('path');
const Hapi = require('hapi');
const hapiAuthJwt = require('hapi-auth-jwt');
const logger = require('./logger');

const secret = process.env.SECRET_KEY;
const encodedSecret = new Buffer(secret).toString('base64');

function attachApiEndpoint(server, options) {
  const apiPath = path.resolve(options.path, 'api');
  const setApi = require(apiPath);

  setApi(server, options);
}

const start = (options) => {
  return new Promise((resolve, reject) => {
    const server = new Hapi.Server();

    server.connection({
      host: options.host || 'localhost',
      port: options.port || 3000
    });

    server.register(
      [ hapiAuthJwt, logger ],
      (error) => {
        server.auth.strategy('jwt', 'jwt', 'required', {
          key: encodedSecret,
          verifyOptions: { algorithms: ['HS256'] }
        });

        attachApiEndpoint(server, options);

        server.start((err) => {
          if (err) {
            reject(err);
          }

          resolve(server);
        });
      }
    );
  });
};

module.exports = { start };
