const { resolve } = require('path');
const { existsSync } = require('fs');
const mongoose = require('mongoose');
const connection = require('./server/connection');
const server = require('./server');

const service = {
  name: process.argv[2],
  path: resolve(__dirname, 'services', `${process.argv[2]}Service`),
  host: process.env.HOST,
  port: process.env.PORT,
  dbUrl: process.env.DB_URL
};

if (!service.name) {
  process.exitCode = 1;
  throw new Error(`A service name is required.`);
}

if (!existsSync(service.path)) {
  process.exitCode = 1;
  throw new Error(`${service.name} does not exist.`);
}

mongoose.connect(service.dbUrl, {}, (err) => {
    if(err) {
      console.log(err)
    }
    // const repository = require(resolve(service.path, 'repository'));
    // const options = Object.assign({ repository: repository(db) }, service);

    server.start(service)
      .then(app => {
        console.log('STARTED', app.port)
        /*app.on('stop', () => {
          options.repository.disconnect();
        });*/
      })
      .catch(res => {
        process.exitCode = 1;
        console.log(res)
      })
  })


process.on('uncaughtException', (err) => {
  console.log('error', 'Unhandled Exception', err);
});

process.on('uncaughtRejection', (err, promise) => {
  console.log('error', 'Unhandled Rejection', err);
});

