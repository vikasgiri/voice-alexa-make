var Speech = require('ssml-builder');
const lodash = require('lodash');
// const util = require('./util');
const intentHelper = require('./intentHelper');
const main = require('./responses/main');
const errors = require('./responses/errors');
const library = require('./responses/library');
//get access to database
const db = require('../../model');


const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {      
      console.log(JSON.stringify(handlerInput));
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      
      //check whether user is new or registered
      var USER_TYPE = 'newUser';
      var visitVal =0;
      //convert into a method to check whether a user is present and increment visit count
      var userIdVal = handlerInput.requestEnvelope.session.user.userId;
  
      var promiseObj = new Promise(function(resolve, reject) {
        db.user.findOne({
          where: {
            user_id: userIdVal
          }})
          .then(person => {
            console.log('from then user ::::::')
            console.log(JSON.stringify(person)) 
  
            if(person) { 
              // update
              console.log('update');
              // return obj.update(values);
              visitVal = person.visit + 1;
              db.user.update(
                {visit: visitVal},
                { returning: true, where: {user_id: userIdVal }}
              )
              .then(function(rowsUpdated) {
                console.log('updated visit');
                console.log(rowsUpdated);
                resolve();
  
              }).catch(err => {
                console.log('error in updating user visit');
                reject();
              })
            
  
            } else { // insert
              console.log('insert');
              visitVal = 0
              db.user.create({
                user_id: userIdVal,
                visit:1
              }).then(output => {
                  console.log("user record inserted request");
                  resolve();
              }).catch(err => {
                  console.log('Error in storing the user id record');
                  console.log(err);
                  reject()
              }) ;
            }
        }).catch(err => {
          console.log('Error in checking user id');
          console.log(err);
          reject();
        });
  
    });
      
    // helper.card(conv, welcome[USER_TYPE]);
    console.log('after user : ' + USER_TYPE);
    const CARD = disclosures.card;
    return promiseObj.then(function() {
        console.log('in promise then');
  
        USER_TYPE = visitVal < 2 ? 'newUser' : 'returningUser'
        console.log(visitVal + ' visit count final ' + USER_TYPE + ' is the final ');
        
        var speech = new Speech();
        speech.audio(welcome[USER_TYPE].prompt);
        speech.pause('500ms');
        var speechOutput = speech.ssml(true);
    
        return handlerInput.responseBuilder
          .speak(speechOutput)
          .withStandardCard(CARD.title, CARD.body, 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg', 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg')
          .withShouldEndSession(false)
          .getResponse();
        
      })
      .catch(function(err) {
        console.log('in promise catch');
        console.log(err);
        var speech = new Speech();
        speech.audio(welcome[USER_TYPE].prompt);
        speech.pause('500ms');
        var speechOutput = speech.ssml(true);
    
        return handlerInput.responseBuilder
          .speak(speechOutput)
          .withStandardCard(CARD.title, CARD.body, 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg', 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg')
          .withShouldEndSession(false)
          .getResponse();
      });
    } 
};

const NoIntentHandler = {
    canHandle(handlerInput) {
        console.log('in no intent');
        console.log(handlerInput.requestEnvelope.request);
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
    },
    handle(handlerInput) {
        console.log('in NoIntentHandler');
        return SessionEndedRequestHandler.handle(handlerInput);
    }
};

const StopIntentHandler = {
    canHandle(handlerInput) {
      console.log('in StopIntent');
      // console.log(handlerInput);
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
      console.log('in StopIntentHandler');
      return SessionEndedRequestHandler.handle(handlerInput);
    }
  };

  
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      console.log('in session');
      return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      console.log('in SessionEndedRequestHandler');
  
      var speech = new Speech();
      speech.audio(lodash.sample(main.goodbye.prompt));
      var speechOutput = speech.ssml(true);
     
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withShouldEndSession(true)
        .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
     console.log('In help intent');
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
     
    handle(handlerInput) {
        var speech = new Speech();
        speech.audio(lodash.sample(errors.help.prompt));
        var speechOutput = speech.ssml(true);
      
        return handlerInput.responseBuilder
          .speak(speechOutput)
          .withShouldEndSession(false)
          .getResponse();
    }
};

const WhoIsIntentHandler = {
    canHandle(handlerInput) {
     console.log('In help intent');
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'WhoIsIntent';
    },
     
    handle(handlerInput) {
        var speech = new Speech();
        speech.audio(main.bio.prompt);
        var speechOutput = speech.ssml(true);
      
        return handlerInput.responseBuilder
          .speak(speechOutput)
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

module.exports = {
    LaunchRequestHandler,
    NoIntentHandler,
    SessionEndedRequestHandler,
    StopIntentHandler,
    HelpIntentHandler,
    WhoIsIntentHandler,
    UnhandledIntentHandler
}