const consoleReporter = [
  {
    module: 'good-squeeze',
    name: 'Squeeze',
    args: [{
      response: '*',
      request: '*',
      log: '*'
    }]
  }, {
    module: 'good-console'
  },
  'stdout'
];

const fileReporter = [
  {
    module: 'good-squeeze',
    name: 'Squeeze',
    args: [{
      response: '*',
      request: '*',
      log: '*'
    }],
  }, {
    module: 'good-squeeze',
    name: 'SafeJson'
  }, {
    module: 'good-file',
    args: ['./logs/class-service']
  }
];

const reporterOptions = {
  includes: {
    request: ['headers', 'payload'],
    response: ['payload']
  },
  reporters: {
    consoleReporter,
    fileReporter
  }
};

module.exports = {
  register: require('good'),
  options: reporterOptions
};