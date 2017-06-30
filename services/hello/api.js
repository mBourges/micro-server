module.exports = (server, options = {}) => {
  server.route({
    method: 'GET',
    path: '/{name}',
    config: {
      auth: false
    },
    handler: (request, reply) => {
      reply({ message: `Hello ${request.params.name}` });
    }
  });

  server.route({
    method: 'GET',
    path: '/user/{name}',
    config: {
      auth: { strategy: 'jwt' }
    },
    handler: (request, reply) => {
      reply({ message: `Hello User ${request.params.name}` });
    }
  });

  server.route({
    method: 'GET',
    path: '/admin/{name}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: 'admin'
      }
    },
    handler: (request, reply) => {
      reply({ message: `Hello Admin ${request.params.name}` });
    }
  });
};
