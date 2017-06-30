const MongoClient = require('mongodb');

const connect = (options) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(options.dbUrl, (err, db) => {
      if (err) {
        reject(err);
      }

      resolve(db);
    });
  });
};

module.exports = { connect };
