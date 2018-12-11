var Speech = require('ssml-builder');
const lodash = require('lodash');
// const util = require('./util');
const intentHelper = require('../intentHelper');
const main = require('../responses/main');
const errors = require('../responses/errors');
const library = require('../responses/library');
const audioPlayer = require('../responses/audioPlayer');
const libraryObj = require('../handlers/library');
const AudioFeed = require('../libs/audio-feed-api');

const feedUrl = 'https://am.jpmorgan.com/us/en/asset-management/gim/adv/alexarss/voice-insights/My-Next-Move';
const audioFeed = new AudioFeed(feedUrl);
// const audioFeed = new AudioFeed(process.env.AUDIO_API_URI);

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

        // return NewWelcomeIntentHandler.handle(handlerInput)
        return WelcomeIntentHandler.handle(handlerInput)
        // return intentHelper.newWelcomeIntent(handlerInput);
    
    } 
};

const NewWelcomeIntentHandler = {
    canHandle(handlerInput) {
        console.log('NewWelcomeIntentHandler');
        // console.log(handlerInput.requestEnvelope.request);
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'NewWelcomeIntentHandler';
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


const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      console.log('in session');
      return  handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    //   && handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
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
     console.log('In WhoIsIntentHandler');
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'WhoIsIntent';
    },
     
    handle(handlerInput) {
        console.log('In WhoIsIntentHandler');
        var speech = new Speech();
        speech.audio(main.bio.prompt);
        var speechOutput = speech.ssml(true);
      
        return handlerInput.responseBuilder
          .speak(speechOutput)
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
      return SessionEndedRequestHandler.handle(handlerInput);
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


const LibraryIntentHandler = {
    canHandle(handlerInput) {
      console.log('in LibraryIntentHandler');
      // console.log(handlerInput);
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'LibraryIntent';
    },
    handle(handlerInput) {
      console.log('in LibraryIntentHandler');
      return IntroIntent.handle(handlerInput);
    }
};


const IntroIntent = {
    canHandle(handlerInput) {
        console.log('in IntroIntent LibraryIntent');
        return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'LibraryIntent';
    },
    handle(handlerInput) {
        console.log('in in IntroIntent LibraryIntent');
    
        var speech = new Speech();
        speech.audio(library.intro.prompt);
        var speechOutput = speech.ssml(true);

        return handlerInput.responseBuilder
        .speak(speechOutput)
        .withShouldEndSession(false)
        .getResponse();
    }
}

const EpisodeIntentHandler = {
    canHandle(handlerInput) {
        console.log('in EpisodeIntentHandler');
        return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'EpisodeIntent';
    },
    async handle(handlerInput) {
        console.log('in EpisodeIntentHandler');
    
        let episodeNumber ='';
        // handlerInput.requestEnvelope.request.intent.slots.commentaryNumber && handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value
        if(handlerInput.requestEnvelope.request.intent.slots.episodeNumber 
            && handlerInput.requestEnvelope.request.intent.slots.episodeNumber.value) {
            
            episodeNumber = handlerInput.requestEnvelope.request.intent.slots.episodeNumber.value;
        }

        //replace the url and check
        const feed = await audioFeed.getJSONFeed(feedUrl);
        // const feed = audioFeed.getJSONFeed(process.env.AUDIO_API_URI);
        const episode = feed.getEpisode(episodeNumber);

        if(episode === '') {

            console.log('in episode if');
            //send to unhandled or fallback
            this.toIntent('Unhandled');
        } else {

            console.log('in episode else');

            var speech = new Speech();
            speech.audio(lodash.sample(audioPlayer.yes.prompt));
            var speechOutput = speech.ssml(true);

            return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard(episode.title, episode.description)
            .addAudioPlayerPlayDirective('REPLACE_ALL', episode.audioURL, 'wx', 0,null)
            .withShouldEndSession(false)
            .getResponse();
        }
        
    }
}

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
  
const LatestIntentHandler = {
    canHandle(handlerInput) {
        console.log('in LatestIntentHandler');
        return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'LatestIntent';
    },
    async handle(handlerInput) {
        console.log('in LatestIntentHandler');

        const feed = await audioFeed.getJSONFeed(feedUrl);
        const latest = feed.getLatest();

        console.log('latest ===>', latest);
            
        var speech = new Speech();
        speech.audio(lodash.sample(audioPlayer.yes.prompt));
        var speechOutput = speech.ssml(true);

        // .speak(speechOutput)
        // .withSimpleCard('My Next Move', latest.title)
        return handlerInput.responseBuilder
        .addAudioPlayerPlayDirective('REPLACE_ALL', latest.audioURL, 'wx', 0,null)
        .withShouldEndSession(false)
        .getResponse();
        
    }
}

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

module.exports = {
    LaunchRequestHandler,
    NewWelcomeIntentHandler,
    WelcomeIntentHandler,
    UnhandledIntentHandler,
    NoIntentHandler,
    StopIntentHandler,
    WhoIsIntentHandler,
    HelpIntentHandler,
    SessionEndedRequestHandler,
    LibraryIntentHandler,
    EpisodeIntentHandler,
    LatestIntentHandler,
    AudioPlayerEventHandler,
    ErrorHandler,
    RequestLog,
    ResponseLog
}