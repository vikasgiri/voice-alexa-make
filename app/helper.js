var Speech = require('ssml-builder');
const lodash = require('lodash');
// const util = require('./util');
const intentHelper = require('./intentHelper');
const eastereggs = require('./responses/easterEggs');
const welcome = require('./responses/welcome');
const disclosures = require('./responses/disclosures');
const exceptions = require('./responses/exceptions');
const commentary = require('./responses/commentary');
const notes = require("./responses/notes.js");


var podcastURL = "https://am.jpmorgan.com/blob-gim/1383559896296/83456/WeeklyNotes.mp3";

var stream = {
  "url": podcastURL,
  "token": "0",
  "expectedPreviousToken": null,
  "offsetInMilliseconds": 0
};

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
      .withShouldEndSession(false)
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
      .withShouldEndSession(false)
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
      .withShouldEndSession(false)
      .getResponse();
  }
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {

    // const attributes = handlerInput.attributesManager.getSessionAttributes();
    // console.log('-----------------------');
    // console.log(attributes);
    // console.log('-----------------------');

    // attributes.lastIntent = "LaunchRequest";
    // attributes.currentSession = 0;
    // handlerInput.attributesManager.setSessionAttributes(attributes);

    const USER_TYPE = 'newUser';
    console.log('from launch');

    const CARD = disclosures.card;
    
    var speech = new Speech();
    speech.audio(welcome[USER_TYPE].prompt);
    speech.pause('500ms');
    var speechOutput = speech.ssml(true);

    // .speak(speechOutput)
    return handlerInput.responseBuilder
      .speak('Hello')
      .withStandardCard(CARD.title, CARD.body, 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg', 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg')
      .withShouldEndSession(false)
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
      .withShouldEndSession(false)
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
      .withShouldEndSession(false)
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

const PlayClipForIntentHandler = {
  //handle/ implement this.alexaSkill().audioPlayer().stop();
  canHandle(handlerInput) {

    // return new Promise((resolve, reject) => {
    //   handlerInput.attributesManager.getPersistentAttributes()
    //     .then((attributes) => {
    //       resolve(attributes.foo === 'bar');
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     })
    // });

    return handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'PlayClipForIntent';
  },
  handle(handlerInput) {
    //in case of play clip for 
    var commentaryId = 4
    console.log('in PlayClipForIntentHandler');

    // console.log(JSON.stringify(handlerInput.requestEnvelope.request.intent.slots.commentaryNumber));
    // console.log(JSON.stringify(handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.name));
    // console.log(JSON.stringify(handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value));
    // //if slot value
    if(handlerInput.requestEnvelope.request.intent.slots.commentaryNumber && handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value 
      && handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value != '' ) {
      
        console.log('slot value for commentary : ');
        console.log(handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value)
        commentaryId = handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value;
    }

    // var commentaryObj = {
    //   "commentaryError": 0,
    //   "commentary": commentaryId,
    //   "commentaryNumber": commentaryId
    // }
    
    // return new Promise((resolve, reject) => {
    //   handlerInput.attributesManager.getPersistentAttributes()
    //     .then((attributes) => {
    //       attributes.foo = 'bar';
    //       handlerInput.attributesManager.setPersistentAttributes(attributes);

    //       return handlerInput.attributesManager.savePersistentAttributes();
    //     })
    //     .then(() => {
    //       resolve(handlerInput.responseBuilder
    //         .speak('Persistent attributes updated!')
    //         .getResponse());
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });

    // return new Promise((resolve, reject) => {
    //   handlerInput.attributesManager.setPersistentAttributes
    //   getPersistentAttributes()
    //       .then((attributes) => {
              
    //           console.log('then');
    //           attributes.commentaryObj = commentaryObj;
    //           handlerInput.attributesManager.setPersistentAttributes(attributes);
      
    //           handlerInput.attributesManager.savePersistentAttributes();
    //       })
    //       .then(() => {
    //           console.log('Session updated successfully!!!');
    //           resolve(intentHelper.createCommentaryOnId(handlerInput, commentaryId));
    //       })
    //       .catch((error) => {
    //           console.log('in error')
    //           reject(error);
    //       });
    // });

    return intentHelper.createCommentaryOnId(handlerInput, commentaryId);
  }
};


const CommentaryIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'CommentaryIntent';
  },
  handle(handlerInput) {
    console.log('in CommentaryIntentHandler');
    return PlayClipForIntentHandler.handle(handlerInput);
  }
};

const NextMessageIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NextMessageIntent';
  },
  handle(handlerInput) {
    console.log('in NextMessageIntentHandler');

    const attributes = handlerInput.attributesManager.getSessionAttributes();
    
    if(attributes.commentaryObj) {
      const curCommentaryNum = attributes.commentaryObj.commentary || 0;
      const nextCommentaryNum =  curCommentaryNum + 1;

      var commentaryObjNew = {
        "commentaryError": 0,
        "commentary": nextCommentaryNum,
        "commentaryNumber": nextCommentaryNum
      }

      attributes.commentaryObj
    }
    
    console.log('--------------------------------------');
    console.log(attributes)
    console.log('--------------------------------------');
    //if(attributes.) 

    return PlayClipForIntentHandler.handle(handlerInput);
  }
};

// 'NextMessageIntent': function() {
//   const session = this.getSessionAttributes();
//   const curCommentaryNum = session.commentary || 0;
//   const nextCommentaryNum =  curCommentaryNum + 1;

//   if (commentariesById[nextCommentaryNum]) {
//     this.toIntent('PlayCommentary', nextCommentaryNum);
//   } else {
//     const SPEECH = this.speechBuilder()
//       .addAudio(_.sample(commentary.last.prompt), commentary.last.altText)
//     ;
//     this.tell(SPEECH);
//   }
//   },

const NotesOnTheWeekAheadIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NotesOnTheWeekAheadIntent';
  },
  handle(handlerInput) {
    console.log('in NotesOnTheWeekAheadIntentHandler');

    var notesSpeech = new Speech()
    .audio(lodash.sample(notes.intro.preprompt))
    .audio(notes.preview.prompt)
    .audio(notes.preview.reprompt);
     var notesSpeechOutput = notesSpeech.ssml(true);
    
    var repromptSpeech = new Speech();
    repromptSpeech.audio(notes.preview.reprompt);
    var repromptSpeechOutput = repromptSpeech.ssml(true);

    return handlerInput.responseBuilder
      .speak(notesSpeechOutput)
      .reprompt(repromptSpeechOutput)
      .withShouldEndSession(false)
      .getResponse();
  }
};

const YesIntentHandler = {
  canHandle(handlerInput) {
    console.log(handlerInput.requestEnvelope);
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    console.log('in YesIntentHandler');

    var repromptSpeech = new Speech();
    repromptSpeech.audio(notes.preview.reprompt);
    // var repromptSpeechOutput = repromptSpeech.ssml(true);

    var token2 = handlerInput.requestEnvelope.context.System.apiAccessToken;

    return handlerInput.responseBuilder
      .addAudioPlayerPlayDirective('REPLACE_ALL', podcastURL, '', 0,token2)
      .getResponse();
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
      .withShouldEndSession(false)
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
    PlayClipForIntentHandler,
    CommentaryIntentHandler,
    SessionEndedRequestHandler,
    ErrorHandler,
    NotesOnTheWeekAheadIntentHandler,
    YesIntentHandler,
    NextMessageIntentHandler
}