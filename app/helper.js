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

// const voicedata = require('./model').voicedata;
const db = require('./model');

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

    console.log('canhandle')
    console.log(handlerInput.requestEnvelope.request.intent.name);
    return handlerInput.requestEnvelope.request.intent.name === 'PlayClipForIntent';
  },
  handle(handlerInput) {
    //in case of play clip for 
    var commentaryId = 4
    console.log('in PlayClipForIntentHandler');

    console.log("---------------------in------------------");
    console.log(handlerInput.requestEnvelope.request.intent)
    // console.log(handlerInput.requestEnvelope.request.intent.slots)
    // console.log(handlerInput.requestEnvelope.request.intent.slots.commentaryNumber)

    if(handlerInput.requestEnvelope.request.intent.name === 'NextMessageIntent'
    || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent'
    || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent') {

      console.log("in if method")
      const attributes = handlerInput.attributesManager.getSessionAttributes();
    
      // if(attributes.commentaryObj) {
        console.log(attributes);
      console.log(attributes.commentaryObj);
      commentaryId = attributes.commentaryObj.commentary;
      // }
    } else if(handlerInput.requestEnvelope.request.intent.slots.commentaryNumber && handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value 
      && handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value != '' ) {
      
        console.log("in else if")
        console.log('slot value for commentary : ');
        console.log(handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value)
        commentaryId = handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value;
    } 

    console.log('final commentary id decided is : ');
    console.log(commentaryId);

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

const NextIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent';
  },
  handle(handlerInput) {
    console.log('in NextIntentHandler');
    return NextMessageIntentHandler.handle(handlerInput);
  }
};

const RepeatIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent';
  },
  handle(handlerInput) {
    console.log('in RepeatIntentHandler');
    return NextMessageIntentHandler.handle(handlerInput);
  }
};

const NextMessageIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NextMessageIntent';
  },
  handle(handlerInput) {
    console.log('in NextMessageIntentHandler');

    var attributes = handlerInput.attributesManager.getSessionAttributes();
    
    console.log('from next message intent attributes');
    console.log(attributes);

    if(handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent') {

      if(attributes.commentaryObj) {
        const curCommentaryNum = attributes.commentaryObj.commentary || 1;

        var commentaryObjNew = {
          "commentaryError": 0,
          "commentary": curCommentaryNum,
          "commentaryNumber": curCommentaryNum
        }

        attributes.commentaryObj =commentaryObjNew
        handlerInput.attributesManager.getSessionAttributes(attributes);
      } else {
        
        const curCommentaryNum = 1;

        var commentaryObjNew = {
          "commentaryError": 0, 
          "commentary": curCommentaryNum,
          "commentaryNumber": curCommentaryNum
        }

        attributes.commentaryObj =commentaryObjNew
        handlerInput.attributesManager.getSessionAttributes(attributes);
      }
    } else {
      if(attributes.commentaryObj) {
        const curCommentaryNum = attributes.commentaryObj.commentary || 0;
        const nextCommentaryNum =  curCommentaryNum + 1;

        var commentaryObjNew = {
          "commentaryError": 0,
          "commentary": nextCommentaryNum,
          "commentaryNumber": nextCommentaryNum
        }

        attributes.commentaryObj =commentaryObjNew
        handlerInput.attributesManager.getSessionAttributes(attributes);
      } else {

        const curCommentaryNum = 1;

        var commentaryObjNew = {
          "commentaryError": 0, 
          "commentary": curCommentaryNum,
          "commentaryNumber": curCommentaryNum
        }

        attributes.commentaryObj =commentaryObjNew
        handlerInput.attributesManager.getSessionAttributes(attributes);
      }
    }


    attributes = handlerInput.attributesManager.getSessionAttributes();
    console.log('------------------next--------------------');
    console.log(attributes)
    console.log('--------------------next------------------');
    //if(attributes.) 

    return PlayClipForIntentHandler.handle(handlerInput);
  }
};

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
   // console.log(handlerInput.requestEnvelope);
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    console.log('in YesIntentHandler');

    var repromptSpeech = new Speech();
    repromptSpeech.audio(notes.preview.reprompt);
     var repromptSpeechOutput = repromptSpeech.ssml(true);

    var token2 = handlerInput.requestEnvelope.context.System.apiAccessToken;
      return handlerInput.responseBuilder
      .addAudioPlayerPlayDirective('REPLACE_ALL', podcastURL, 'wx', 0,null)
      .withShouldEndSession(true)
      .getResponse();
     
      // .reprompt(repromptSpeechOutput)
      // .withShouldEndSession(false)
  }
};

const PauseIntentHandler = {
  canHandle(handlerInput) {
    console.log(JSON.stringify(handlerInput.requestEnvelope));
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent';
  },
  handle(handlerInput) {
    console.log('in PauseIntentHandler');
    console.log('--------------------------------pause related---------------------------------');
    console.log(handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds);
    console.log(handlerInput.requestEnvelope.context.System.apiAccessToken);

    var audioPause = {
      "offsetInMilliseconds": handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds,
      "apiAccessToken" : handlerInput.requestEnvelope.context.System.apiAccessToken
    }

    var attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes.audioPause = audioPause;
    handlerInput.attributesManager.setSessionAttributes(attributes);

    console.log('--------------------------------pause related---------------------------------');
    console.log(handlerInput);
    // var token2 = handlerInput.requestEnvelope.context.System.apiAccessToken;
      return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .withShouldEndSession(false)
      .getResponse();
     
  }
};

const AudioPlayerEventHandler = {

  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type.startsWith('AudioPlayer.');
  },
  async handle(handlerInput) {

    console.log('AudioPlayerEventHandler 1');
    const {
      requestEnvelope,
      // attributesManager,
      responseBuilder
    } = handlerInput;
    const audioPlayerEventName = requestEnvelope.request.type.split('.')[1];
    // const {
    //   playbackSetting,
    //   playbackInfo
    // } = await attributesManager.getPersistentAttributes();
    console.log('AudioPlayerEventHandler 2');
    switch (audioPlayerEventName) {
      case 'PlaybackStarted':
        console.log('AudioPlayerEventHandler 3');
        // playbackInfo.token = getToken(handlerInput);
        // playbackInfo.index = await getIndex(handlerInput);
        // playbackInfo.inPlaybackSession = true;
        // playbackInfo.hasPreviousPlaybackSession = true;
        break;
      case 'PlaybackFinished':
        console.log('AudioPlayerEventHandler 4');
        // playbackInfo.inPlaybackSession = false;
        // playbackInfo.hasPreviousPlaybackSession = false;
        // playbackInfo.nextStreamEnqueued = false;
        break;
      case 'PlaybackStopped':
        console.log('AudioPlayerEventHandler 5');
        // playbackInfo.token = getToken(handlerInput);
        // playbackInfo.index = await getIndex(handlerInput);
        // playbackInfo.offsetInMilliseconds = getOffsetInMilliseconds(handlerInput);
        break;
      case 'PlaybackNearlyFinished':
        {
          console.log('AudioPlayerEventHandler 6');
          // if (playbackInfo.nextStreamEnqueued) {
          //   break;
          // }

          // const enqueueIndex = (playbackInfo.index + 1) % constants.audioData.length;

          // if (enqueueIndex === 0 && !playbackSetting.loop) {
          //   break;
          // }

          // playbackInfo.nextStreamEnqueued = true;

          // const enqueueToken = playbackInfo.playOrder[enqueueIndex];
          // const playBehavior = 'ENQUEUE';
          // const podcast = constants.audioData[playbackInfo.playOrder[enqueueIndex]];
          // const expectedPreviousToken = playbackInfo.token;
          // const offsetInMilliseconds = 0;

          // responseBuilder.addAudioPlayerPlayDirective(
          //   playBehavior,
          //   podcast.url,
          //   enqueueToken,
          //   offsetInMilliseconds,
          //   expectedPreviousToken,
          // );
          break;
        }
      case 'PlaybackFailed':
        console.log('AudioPlayerEventHandler 7');
        // playbackInfo.inPlaybackSession = false;
        console.log('Playback Failed : %j', handlerInput.requestEnvelope.request.error);
        return;
      default:
        throw new Error('Should never reach here!');
    }

    console.log('AudioPlayerEventHandler 8');
    return responseBuilder.getResponse();
  }
}

const ResumeIntentHandler = {
  canHandle(handlerInput) {
   // console.log(handlerInput.requestEnvelope);
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent';
  },
  handle(handlerInput) {
    console.log('in ResumeIntentHandler');

    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    // console.log(JSON.stringify(sessionAttributes));

    // console.log(JSON.stringify(handlerInput.requestEnvelope));
    // console.log('offset : ' + handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds);
    return handlerInput.responseBuilder
    .addAudioPlayerPlayDirective('REPLACE_ALL', podcastURL, 'wx', handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds,null)
    .withShouldEndSession(true)
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
      .withShouldEndSession(false)
      .getResponse();
  }
};


const HelpIntentHandler = {
  canHandle(handlerInput) {
   // console.log(handlerInput.requestEnvelope);
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  //session -> notes -> state = notes
  //session -> commentary -> state = commentary
   
  handle(handlerInput) {
    console.log('in HelpIntentHandler');

    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    if(sessionAttributes 
      && sessionAttributes.notes 
      && sessionAttributes.notes.state === 'notes') {

      console.log('in help for notes ');
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      attributes.commentaryError = 0;
      handlerInput.attributesManager.setSessionAttributes(attributes);

      var speech = new Speech();
      speech.audio(lodash.sample(notes.help.prompt));
      var speechOutput = speech.ssml(true);
    
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .getResponse();

    } else if(
      sessionAttributes 
      && sessionAttributes.commentary 
      && sessionAttributes.commentary.state === 'commentary'
    ) {

      console.log('in help from fallback');
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      attributes.commentaryError = 0;
      handlerInput.attributesManager.setSessionAttributes(attributes);

      var speech = new Speech();
      speech.audio(lodash.sample(commentary.help.prompt));
      var speechOutput = speech.ssml(true);
    
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .getResponse();

    } else {

      console.log('help last else ')
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      attributes.generalError = 0;
      handlerInput.attributesManager.setSessionAttributes(attributes);

      var speech = new Speech();
      speech.audio(lodash.sample(exceptions.help.prompt));
      var speechOutput = speech.ssml(true);
    
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withShouldEndSession(false)
        .getResponse();
    }
  }
};

const UnhandledIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    console.log('in UnhandledIntentHandler');

    //get the session attributes
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    console.log('from unhandledIntentHandler ' + JSON.stringify(sessionAttributes));

    if(
      sessionAttributes 
      && sessionAttributes.commentary 
      && sessionAttributes.commentary.state === 'commentary'
    ) {

      //check whether there is commentary error and update the session
      const commentaryError = sessionAttributes.commentaryError || 0;
      var updatedCommentaryError =  parseInt(commentaryError, 10) + 1;
      sessionAttributes.commentaryError = updatedCommentaryError;
      
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

      if(!commentaryError) {
        var speech = new Speech();
        speech.audio(lodash.sample(commentary.invalid.first));
        var speechOutput = speech.ssml(true);
    
        return handlerInput.responseBuilder
          .speak(speechOutput)
          .getResponse();

      } else if(commentaryError < 2) {
        var speech = new Speech();
        speech.audio(lodash.sample(commentary.invalid.second));
        var speechOutput = speech.ssml(true);
    
        return handlerInput.responseBuilder
          .speak(speechOutput)
          .getResponse();
      
      } else {
        HelpIntentHandler.handle(handlerInput);
      }
      
    }
    var  generalError = sessionAttributes.generalError || 0
    sessionAttributes.generalError = parseInt(generalError, 10) + 1;


    //set the value fo general error back to 
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    if(generalError<2) {

      var speech = new Speech();
      speech.audio(lodash.sample(exceptions.unhandled.prompt));
      var speechOutput = speech.ssml(true);
    
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withShouldEndSession(false)
        .getResponse();

    } else {
      HelpIntentHandler.handle(handlerInput);
    }
     
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
    // console.log("REQUEST ENVELOPE = " + JSON.stringify(handlerInput));
    // Sequelize.sync().then(function () {
    // Table created
    return db.voicedata.create({
              logdata: JSON.stringify(handlerInput)
            }).then(output => {
                console.log("log inserted request");
            }).catch(err => {
                console.log('Error in storing the request log record');
                console.log(err);
            }) ;
    // });
    
  }
};

//logging response to database
const ResponseLog = {
  process(handlerInput) {
       return new Promise((resolve, reject) => {
          // sequelize.sync().then(function () {
          // console.log("4");
            // Table created
            // console.log(db);
          return db.voicedata.create({
                    logdata: JSON.stringify(handlerInput)
                  }).then(output => {
                      console.log("log inserted response");
                      resolve();
                  }).catch(err => {
                      console.log('Error in storing the response log record');
                      console.log(err);
                      reject(err)
                  }) ;
          // });
      });
  }
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
    NextMessageIntentHandler,
    NextIntentHandler,
    RepeatIntentHandler,
    PauseIntentHandler,
    AudioPlayerEventHandler,
    ResumeIntentHandler,
    HelpIntentHandler,
    UnhandledIntentHandler,
    RequestLog,
    ResponseLog
}