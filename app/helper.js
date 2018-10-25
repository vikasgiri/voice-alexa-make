var Speech = require('ssml-builder');
const lodash = require('lodash');
// const util = require('./util');
const eastereggs = require('./responses/easterEggs');
const welcome = require('./responses/welcome');
const disclosures = require('./responses/disclosures');
const exceptions = require('./responses/exceptions');
const commentary = require('./responses/commentary');

const AboutDrKellyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AboutDrKellyIntent';
  },
  handle(handlerInput) {
    console.log('in AboutDrKellyIntentHandler');

    var speech = new Speech();
    speech.audio(eastereggs.aboutDr.prompt);
    speech.pause('500ms')
    // //add audio
    // var speechText = util.addAudio("", eastereggs.aboutDr.prompt, eastereggs.aboutDr.altText);
    // //add break
    // speechText = util.addBreak(speechText, '500ms');
    // // const speechText = '<audio src="https://am.jpmorgan.com/blob-gim/1383559896296/83456/WeeklyNotes.mp3" /> ';
    
    // var repromptTxt = util.addAudio("", eastereggs.general.prompt, eastereggs.general.altText);

    var speechOutput = speech.ssml(true);
    var repromptSpeech = new Speech();
    repromptSpeech.audio(eastereggs.general.prompt);
    var repromptSpeechOutput = repromptSpeech.ssml(true);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(repromptSpeechOutput)
      .getResponse();
  }
};

const QuoteIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'QuoteIntent';
  },
  handle(handlerInput) {
    console.log('in QuoteIntentHandler');

    var speech = new Speech();
    speech.audio(lodash.sample(eastereggs.quote.prompt));
    speech.pause('500ms')
    
    var speechOutput = speech.ssml(true);
    var repromptSpeech = new Speech();
    repromptSpeech.audio(eastereggs.general.prompt);
    var repromptSpeechOutput = repromptSpeech.ssml(true);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(repromptSpeechOutput)
      .getResponse();
  }
};

const WhatIsThisIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'WhatIsThisIntent';
  },
  handle(handlerInput) {
    console.log('in WhatIsThisIntentHandler');

    var speech = new Speech();
    speech.audio(lodash.sample(eastereggs.whatIsThis.prompt));
    speech.pause('500ms')
    
    var speechOutput = speech.ssml(true);
    var repromptSpeech = new Speech();
    repromptSpeech.audio(eastereggs.general.prompt);
    var repromptSpeechOutput = repromptSpeech.ssml(true);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(repromptSpeechOutput)
      .getResponse();
  }
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const USER_TYPE = 'newUser';
    console.log('from launch');

    const CARD = disclosures.card;
    
    var speech = new Speech();
    speech.audio(welcome[USER_TYPE].prompt);
    speech.pause('500ms');
    var speechOutput = speech.ssml(true);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withStandardCard(CARD.title, CARD.body, 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg', 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg')
      .getResponse();
  } 
};

const DisclosuresIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'DisclosuresIntent';
  },
  handle(handlerInput) {
    console.log('in DisclosuresIntentHandler');
    const CARD = disclosures.card;
    
    var speech = new Speech();
    speech.audio(disclosures.prompt);
    speech.pause('500ms');
    var speechOutput = speech.ssml(true);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withStandardCard(CARD.title, CARD.body, 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg', 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg')
      .getResponse();
  } 
};

const NoIntentHandler = {
  canHandle(handlerInput) {
    console.log('in no intent');
    // console.log(handlerInput);
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

    var speech = new Speech();
    speech.audio(lodash.sample(commentary.stop.prompt));
    var speechOutput = speech.ssml(true);
   
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  }
};

const KeepReadingIntentHandler = {
  canHandle(handlerInput) {
    console.log('in no intent');
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'KeepReadingIntent';
  },
  handle(handlerInput) {
    console.log('in KeepReadingIntentHandler');
    return SessionEndedRequestHandler.handle(handlerInput);
  }
};

const CancelIntentHandler = {
  //handle/ implement this.alexaSkill().audioPlayer().stop();
  canHandle(handlerInput) {
    console.log('in CancelIntent');
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent';
  },
  handle(handlerInput) {
    console.log('in CancelIntentHandler');
    return SessionEndedRequestHandler.handle(handlerInput);
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log('in session');
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log('in SessionEndedRequestHandler');

    var speech = new Speech();
    speech.audio(lodash.sample(exceptions.goodbye.prompt));
    speech.pause('500ms')
    var speechOutput = speech.ssml(true);
   
    return handlerInput.responseBuilder
      .speak(speechOutput)
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
      .getResponse();
  },
};

module.exports = {
    LaunchRequestHandler,
    AboutDrKellyIntentHandler,
    QuoteIntentHandler,
    WhatIsThisIntentHandler,
    DisclosuresIntentHandler,
    NoIntentHandler,
    KeepReadingIntentHandler,
    StopIntentHandler,
    CancelIntentHandler,
    SessionEndedRequestHandler,
    ErrorHandler
}