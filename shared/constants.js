/**
 * Created with JetBrains WebStorm.
 * User: zzn
 * Date: 6/12/13
 * Time: 9:04 PM
 * To change this template use File | Settings | File Templates.
 */

var HOST_ROOL_URL = process.env.HOST_ROOT_URL || 'http://localhost:5000';

module.exports = {
  HOST_ROOL_URL : HOST_ROOL_URL,
  FACEBOOK_AUTH_CALLBACK : HOST_ROOL_URL + '/facebook/callback',
  TWITTER_AUTH_CALLBACK : HOST_ROOL_URL + '/twitter/callback',
  GOOGLE_AUTH_RETURN : HOST_ROOL_URL + '/google/return',
  LINKED_IN_AUTH_CALLBACK : HOST_ROOL_URL + '/google/callback'
};