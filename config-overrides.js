const { injectBabelPlugin } = require('react-app-rewired');
const rewireLessModule = require('./config-less-modules');

module.exports = function override(config, env) {
  config = injectBabelPlugin(
    ['import', { libraryName: 'antd', style: true }],
    config
  );
  config = rewireLessModule(config, env, {
    modifyVars: {
      // '@primary-color': '#1DA57A',
    }
  });
  return config;
};
