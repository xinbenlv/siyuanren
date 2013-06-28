'use strict';

var logger = require('log4js').getDefaultLogger();
var ENABED_PROVIDERS = ['facebook', 'twitter', 'linkedin', 'weibo', 'renren'];

var HOST_ROOL_URL = process.env.HOST_ROOT_URL || 'http://localhost:5000';

var getAuthCallbackUrl = function(provider) {
  return HOST_ROOL_URL + '/auth/' + provider + '/callback';
};

var getDeauthCallbackUrl = function(provider) {
  return HOST_ROOL_URL + '/deauth/' + provider + '/callback';
};

var STRATEGIES = {};
for (var i in ENABED_PROVIDERS) {
  var provider = ENABED_PROVIDERS[i];
  STRATEGIES[provider] =  require('passport-' + provider).Strategy;
}

var GOOGLE_AUTH_RETURN = HOST_ROOL_URL + '/auth/google/return';

var getProviderCredentials = function() {
  var c = {};
  for (var i in ENABED_PROVIDERS) {
    logger.info("Enabling provider: " + ENABED_PROVIDERS[i]);
    var provider = ENABED_PROVIDERS[i];
    c[provider] = {
      app_id: process.env[provider.toUpperCase() + '_APP_ID'],
      app_secret : process.env[provider.toUpperCase() + '_APP_SECRET'],
      app_auth_callback_url : getAuthCallbackUrl(provider),
      app_deauth_callback_url : getDeauthCallbackUrl(provider)
    }
  }
  return c;
}

module.exports = {
  HOST_ROOL_URL : HOST_ROOL_URL,
  ENABED_PROVIDERS: ENABED_PROVIDERS,
  GOOGLE_AUTH_RETURN: GOOGLE_AUTH_RETURN,
  PROVIDER_CREDENTIALS: getProviderCredentials(),
  STRATEGIES: STRATEGIES,
  OPEN_REGISTRATION: (process.env.OPEN_REGISTRATION === "True")
};

logger.info("Open Registration: " + process.env.OPEN_REGISTRATION);
