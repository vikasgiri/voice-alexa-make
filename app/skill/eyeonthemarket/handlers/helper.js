const lodash = require('lodash');
var Speech = require('ssml-builder');
const welcome = require('../responses/welcome');

module.exports = {
    welcomeUserIntent(handlerInput, audioUrl) {
        console.log('Welcome User Intent or launch intent')

        //need to implement the if else logic for notification and etc.

        var USER_TYPE = 'newUser';
        //: subCheck ? 'subscribedUser' : 'returningUser'

        //add speech
        var speech = new Speech();
        speech.audio(lodash.sample(welcome[USER_TYPE].prompt))
        speech.audio(lodash.sample(welcome.subscribedUser.prompt))
        // speech.paragraph(welcome.notifications.prompt);

        //make it ssml
        var speechOutput = speech.ssml(true);

        console.log('welcome speak : ' + speechOutput);

        return handlerInput.responseBuilder
          .speak(speechOutput)
          .withShouldEndSession(false)
          .getResponse();
    }
};