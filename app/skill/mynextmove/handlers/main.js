var Speech = require('ssml-builder');
const lodash = require('lodash');
// const util = require('./util');
const intentHelper = require('../intentHelper');
const main = require('../responses/main');
const errors = require('../responses/errors');
const library = require('../responses/library');
const libraryObj = require('../handlers/library');
const introHandler = require('./introHandler');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {      
        console.log('In launch handler')
        console.log(JSON.stringify(handlerInput));
        const attributes = handlerInput.attributesManager.getSessionAttributes();

        //check whether user is new or registered
        var USER_TYPE = 'newUser';
        var visitVal =0;
        //convert into a method to check whether a user is present and increment visit count
        var userIdVal = handlerInput.requestEnvelope.session.user.userId;

        return NewWelcomeIntentHandler.handle(handlerInput)
    
    } 
};

const NewWelcomeIntentHandler = {
    canHandle(handlerInput) {
        console.log('NewWelcomeIntentHandler');
        // console.log(handlerInput.requestEnvelope.request);
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    },
    handle(handlerInput) {
        console.log('in NewWelcomeIntentHandler');

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

const UnhandledIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
      console.log('in UnhandledIntentHandler');
      //add speech
      var speech = new Speech();
      speech.audio(lodash.sample(library.unhandled.prompt))

      //add reprompt
      var repromptSpeech = new Speech();
      repromptSpeech.audio(lodash.sample(library.unhandled.prompt));

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

const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
  
      return handlerInput.responseBuilder
        .speak('Sorry, I can\'t understand the command. Please say again.')
        .reprompt('Sorry, I can\'t understand the command. Please say again.')
        .withShouldEndSession(false)
        .getResponse();
    },
};

//logging request to database
const RequestLog = {
    process(handlerInput) {
      console.log('THIS.EVENT = ' + JSON.stringify(this.event));
      console.log("REQUEST ENVELOPE MY-NEXT-MOVE : " + JSON.stringify(handlerInput.requestEnvelope));
    }
};
  
//logging response to database
const ResponseLog = {
    process(handlerInput) {
        console.log("RESPONSE ENVELOPE MY-NEXT-MOVE : " + JSON.stringify(handlerInput));
    }
};

module.exports = {
    LaunchRequestHandler,
    NewWelcomeIntentHandler,
    UnhandledIntentHandler,
    ErrorHandler,
    RequestLog,
    ResponseLog
}