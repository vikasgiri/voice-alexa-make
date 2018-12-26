const Speech = require('ssml-builder');
const lodash = require('lodash');
const request = require('request-promise');

const easterEggs = require('../responses/easterEggs');
const exceptions = require('../responses/exceptions');
const welcome = require('../responses/welcome');
const helper = require('./helper');

//launchrequest
const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
   handle(handlerInput) {      
        console.log('In launch handler')
        console.log(JSON.stringify(handlerInput));

      // request('https://am.jpmorgan.com/us/en/asset-management/gim/adv/alexarss/voice-insights/Eye-on-the-Market')
			// .then(body => {
			// 	const sortedData = JSON.parse(body).sort(function(a,b) {
			// 		return a.episode_num - b.episode_num;
			// 	});
      //           // this.toStateIntent(welcomeState, 'WelcomeUser', sortedData[sortedData.length - 1].audioURL);
      //   console.log("welcome before");
      //   //return helper.welcomeUserIntent(handlerInput, sortedData[sortedData.length - 1].audioURL);

      //   var USER_TYPE = 'newUser';
      //   //: subCheck ? 'subscribedUser' : 'returningUser'

      //   //add speech
      //   var speech = new Speech();
      //   speech.audio(lodash.sample(welcome[USER_TYPE].prompt))
      //   speech.audio(lodash.sample(welcome.subscribedUser.prompt))
      //   // speech.paragraph(welcome.notifications.prompt);

      //   //make it ssml
      //   var speechOutput = speech.ssml(true);

      //   console.log('welcome speak : ' + speechOutput);

      //   console.log(JSON.stringify(handlerInput));

        return handlerInput.responseBuilder
          .speak("<audio src='https://s3.amazonaws.com/alexa-eotm-skill/audio/1.0_welcome_ftu_01.mp3'/> <audio src='https://s3.amazonaws.com/alexa-eotm-skill/audio/2.0_welcome_ru_alreadysubscribed_01.mp3'/>")
          .withShouldEndSession(false)
          .getResponse();
			// })
			// .catch(err => {
			// 	console.log('error with request:', err);
			// })
    } 
};

//unhandled
const UnhandledIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
      console.log('in UnhandledIntentHandler');
      //add speech
      var speech = new Speech();
      speech.paragraph(exceptions.unhandled.prompt)

      //add reprompt
      var repromptSpeech = new Speech();
      repromptSpeech.paragraph(exceptions.unhandled.prompt);

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

const StopIntentHandler = {
    canHandle(handlerInput) {
      console.log('in StopIntent');
      // console.log(handlerInput);
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
      console.log('in StopIntentHandler');

      return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .withShouldEndSession(true)
      .getResponse();

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
      return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .withShouldEndSession(true)
      .getResponse();

    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      console.log('in session');
      return  handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    //   && handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      console.log('in SessionEndedRequestHandler');
  
      var speech = new Speech();
      speech.paragraph(exceptions.goodbye.prompt);
      var speechOutput = speech.ssml(true);
     
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withShouldEndSession(true)
        .getResponse();
    }
};

const WelcomeIntentHandler = {
    canHandle(handlerInput) {
        console.log('WelcomeIntentHandler');
        // console.log(handlerInput.requestEnvelope.request);
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'WelcomeIntentHandler';
    },
    handle(handlerInput) {
        console.log('in WelcomeIntentHandler');

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

// 'PodcastIntent': function() {
//     const PLATFORM_TYPE = this.getType();
//     if (PLATFORM_TYPE === 'AlexaSkill') {
//         this.alexaSkill().audioPlayer().setOffsetInMilliseconds(0).setExpectedPreviousToken(null)
//             .play(this.user().data.podcast, 'PODCAST_INTENT')
//             .tell('');
//     } else {
//         this.googleAction().audioPlayer()
//             .play(this.user().data.podcast, 'Podcast Clip');
//         this.tell('');
//     }
// },
// 'NotificationIntent': function() {
//     this.toStateIntent(welcomeState, 'NotificationIntent');
// }

//helpintent
const HelpIntentHandler = {
    canHandle(handlerInput) {
     console.log('In help intent');
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
     
    handle(handlerInput) {
        var speech = new Speech();
        speech.paragraph(exceptions.help.prompt);

        var speechOutput = speech.ssml(true);
      
        return handlerInput.responseBuilder
          .speak(speechOutput)
          .withShouldEndSession(false)
          .getResponse();
    }
};

//AboutMichaelIntent
const AboutMichaelIntentHandler = {
    canHandle(handlerInput) {
        console.log('in AboutMichaelIntentHandler');
        return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AboutMichaelIntent';
    },
    handle(handlerInput) {
        console.log('in AboutMichaelIntentHandler');
    
        var speech = new Speech();
        speech.audio(easterEggs.aboutMichael.prompt)
        speech.paragraph(easterEggs.reprompt);
        
        var repromptSpeech = new Speech();
        repromptSpeech.paragraph(easterEggs.reprompt);

        //make it ssml
        var speechOutput = speech.ssml(true);
        var repromptSpeechOutput = repromptSpeech.ssml(true);

        return handlerInput.responseBuilder
        .speak(speechOutput)
        .reprompt(repromptSpeechOutput)
        .withShouldEndSession(true)
        .getResponse();
    }
}

//NewContentIntent
const NewContentIntentHandler = {
    canHandle(handlerInput) {
        console.log('in NewContentIntentHandler');
        return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'NewContentIntent';
    },
    handle(handlerInput) {
        console.log('in NewContentIntentHandler');
    
        var speech = new Speech();
        speech.audio(easterEggs.newContent.prompt)
        speech.paragraph(easterEggs.newContent.altText);
        
        var repromptSpeech = new Speech();
        repromptSpeech.paragraph(easterEggs.reprompt);

        //make it ssml
        var speechOutput = speech.ssml(true);
        var repromptSpeechOutput = repromptSpeech.ssml(true);

        return handlerInput.responseBuilder
        .speak(speechOutput)
        .reprompt(repromptSpeechOutput)
        .withShouldEndSession(true)
        .getResponse();
    }
}

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
    
      console.log('AudioPlayerEventHandler 2');
      switch (audioPlayerEventName) {
        case 'PlaybackStarted':
          console.log('AudioPlayerEventHandler 3');
         
          break;
        case 'PlaybackFinished':
          console.log('AudioPlayerEventHandler 4');
       
          break;
        case 'PlaybackStopped':
          console.log('AudioPlayerEventHandler 5');
         
          break;
        case 'PlaybackNearlyFinished':
          {
            console.log('AudioPlayerEventHandler 6');
           
            break;
          }
        case 'PlaybackFailed':
          console.log('AudioPlayerEventHandler 7');
          console.log('Playback Failed : %j', handlerInput.requestEnvelope.request.error);
          return;
        default:
          throw new Error('Should never reach here!');
      }
  
      console.log('AudioPlayerEventHandler 8');
      return responseBuilder.getResponse();
    }
}

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
    SessionEndedRequestHandler,
    UnhandledIntentHandler,
    AudioPlayerEventHandler,
    AboutMichaelIntentHandler,
    NewContentIntentHandler,
    HelpIntentHandler,
    ErrorHandler,
    RequestLog,
    ResponseLog
}