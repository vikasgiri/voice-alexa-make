var Speech = require('ssml-builder');
const lodash = require('lodash');
// const util = require('./util');
const intentHelper = require('./intentHelper');
const main = require('./responses/main');
const errors = require('./responses/errors');
const library = require('./responses/library');
const libraryObj = require('./handlers/library');

//get access to database
// const db = require('../../model');


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
  
    // helper.card(conv, welcome[USER_TYPE]);
    // console.log('after user : ' + USER_TYPE);
    // const CARD = disclosures.card;
    // // return promiseObj.then(function() {
    //     console.log('in promise then');
  
    //     USER_TYPE = visitVal < 2 ? 'newUser' : 'returningUser'
    //     console.log(visitVal + ' visit count final ' + USER_TYPE + ' is the final ');
        
    //     var speech = new Speech();
    //     speech.audio(welcome[USER_TYPE].prompt);
    //     speech.pause('500ms');
    //     var speechOutput = speech.ssml(true);
    
    //     return handlerInput.responseBuilder
    //       .speak(speechOutput)
    //       .withStandardCard(CARD.title, CARD.body, 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg', 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg')
    //       .withShouldEndSession(false)
    //       .getResponse();
    intentHelper.newWelcomeIntent(handlerInput);
    
    } 
};



const LibraryIntentHandler = {
    canHandle(handlerInput) {
      console.log('in LibraryIntentHandler');
      // console.log(handlerInput);
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'LibraryIntent';
    },
    handle(handlerInput) {
      console.log('in LibraryIntentHandler');
      return libraryObj.IntroIntent.handle(handlerInput);
    }
};

const EpisodeIntentHandler = {
    canHandle(handlerInput) {
      console.log('in EpisodeIntentHandler');
      // console.log(handlerInput);
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'EpisodeIntent';
    },
    handle(handlerInput) {
      console.log('in EpisodeIntentHandler');
      return libraryObj.EpisodeIntentHandler.handle(handlerInput);
    }
};

const SubjectIntentHandler = {
    canHandle(handlerInput) {
      console.log('in SubjectIntentHandler');
      // console.log(handlerInput);
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'SubjectIntent';
    },
    handle(handlerInput) {
      console.log('in SubjectIntentHandler');
      return libraryObj.SubjectIntentHandler.handle(handlerInput);
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

module.exports = {
    LaunchRequestHandler,
    
    UnhandledIntentHandler
}