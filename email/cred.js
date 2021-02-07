const {google} = require('googleapis')

const CLIENTID = '747677922727-spr9g23frru2lsh8jkgkom88gbgbiqa5.apps.googleusercontent.com'

const REFRESHTOKEN = '1//048d5QMKKAKUbCgYIARAAGAQSNwF-L9Irp-Sbi_GK-jjCryoXNUsNUS1iox4mbodOaSkx_g9My8psbgAUHJSLr5uNr1J28RN4j6I'

const REDIRECTURI = 'https://developers.google.com/oauthplayground'

const CLIENTSECRETE =   'fQaaPpfsoV8RE0lXr-6YUGUs'

const auth2client = new google.auth.OAuth2(CLIENTID, CLIENTSECRETE, REDIRECTURI)

auth2client.setCredentials({refresh_token: REFRESHTOKEN})
module.exports = {

 CLIENTID : CLIENTID,

 REFRESHTOKEN : REFRESHTOKEN,

 REDIRECTURI : REDIRECTURI,

 CLIENTSECRETE :  CLIENTSECRETE,

 auth2client : auth2client
}