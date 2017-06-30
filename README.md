# Micro-Server

start multiple servers based on a single template

## Usage
Create a folder with the service name in "services" folder.
Add a file "api.js" and create the endpoints
Run node ./index.js <service-name>

## API Template

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
}
