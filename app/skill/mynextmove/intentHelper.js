const main =  require("./responses/main");
// const commentaryMap = require("./responses/commentaryMap");

const lodash = require('lodash');
var Speech = require('ssml-builder');

module.exports = {
    welcomeIntent(handlerInput) {
        console.log('Welcome Intent')

        //add speech
        var speech = new Speech();
        speech.audio(lodash.sample(main.welcome.returning))

        //add reprompt
        var repromptSpeech = new Speech();
        repromptSpeech.audio(lodash.sample(main.welcome.reprompt));

        //make it ssml
        var speechOutput = speech.ssml(true);
        var repromptSpeechOutput = repromptSpeech.ssml(true);

        return handlerInput.responseBuilder
          .speak(speechOutput)
          .reprompt(repromptSpeechOutput)
          .withShouldEndSession(false)
          .getResponse();
    },

    newWelcomeIntent(handlerInput) {
        console.log('New Welcome Intent')

        //add speech
        var speech = new Speech();
        speech.audio(lodash.sample(main.welcome.new))

        //add reprompt
        var repromptSpeech = new Speech();
        repromptSpeech.audio(lodash.sample(main.welcome.reprompt));

        //make it ssml
        var speechOutput = speech.ssml(true);
        var repromptSpeechOutput = repromptSpeech.ssml(true);

        return handlerInput.responseBuilder
          .speak(speechOutput)
          .reprompt(repromptSpeechOutput)
          .withShouldEndSession(false)
          .getResponse();
    }

};

