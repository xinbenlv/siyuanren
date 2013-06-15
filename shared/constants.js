/**
 * Created with JetBrains WebStorm.
 * User: zzn
 * Date: 6/12/13
 * Time: 9:04 PM
 * To change this template use File | Settings | File Templates.
 */

var
  TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , LinkedInStrategy = require('passport-linkedin').Strategy
  , logger = require('log4js').getDefaultLogger()
  ;

var HOST_ROOL_URL = process.env.HOST_ROOT_URL || 'http://localhost:5000';

var getAuthCallbackUrl = function(provider) {
  return HOST_ROOL_URL + '/auth/' + provider + '/callback';
};
var getDeauthCallbackUrl = function(provider) {
  return HOST_ROOL_URL + '/deauth/' + provider + '/callback';
};

var ENABED_PROVIDERS = ['facebook', 'twitter', 'linkedin'];

var STRATEGIES = {};
for (var i in ENABED_PROVIDERS) {
  var provider = ENABED_PROVIDERS[i];
  STRATEGIES[provider] =  require('passport-' + provider).Strategy;
}

var GOOGLE_AUTH_RETURN = HOST_ROOL_URL + '/auth/google/return';

var getProviderCredentials = function() {
  var c = {};
  for (var i in ENABED_PROVIDERS) {
    var provider = ENABED_PROVIDERS[i];

    logger.debug('registering Oauth provider: ' + provider);
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
  STRATEGIES: STRATEGIES
};