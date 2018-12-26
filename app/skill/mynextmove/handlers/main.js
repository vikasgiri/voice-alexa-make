var Speech = require('ssml-builder');
const lodash = require('lodash');
const intentHelper = require('../intentHelper');
const main = require('../responses/main');
const errors = require('../responses/errors');
const library = require('../responses/library');
const audioPlayer = require('../responses/audioPlayer');
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

const EpisodeOnlyIntentHandler = {
    canHandle(handlerInput) {
        console.log('in EpisodeOnlyIntentHandler');
        return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'EpisodeOnlyIntent';
    },
    handle(handlerInput) {
        console.log('in EpisodeOnlyIntentHandler');
        return EpisodeIntentHandler.handle(handlerInput);
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

        console.log('episode number : ' + JSON.stringify(handlerInput.requestEnvelope));
        console.log('episode number : ' + JSON.stringify(handlerInput.requestEnvelope.request.intent.slots.episodeNumber.value));

        if(handlerInput.requestEnvelope.request.intent.slots.episodeNumber 
            && handlerInput.requestEnvelope.request.intent.slots.episodeNumber.value) {
            
            episodeNumber = handlerInput.requestEnvelope.request.intent.slots.episodeNumber.value;
        }

        //replace the url and check
        const feed = await audioFeed.getJSONFeed(feedUrl);
        // const feed = audioFeed.getJSONFeed(process.env.AUDIO_API_URI);
        const episode = feed.getEpisode(episodeNumber);

        console.log("episode details : " + episode );

        if(!episode || episode === '') {

            console.log('in episode if');
            //send to unhandled or fallback
            // this.toIntent('Unhandled');
            return UnhandledIntentHandler.handle(handlerInput);

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


const SubjectOnlyIntentHandler = {
    canHandle(handlerInput) {
        console.log('in SubjectOnlyIntentHandler');
        return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'SubjectOnlyIntent';
    },
    handle(handlerInput) {
        console.log('in SubjectOnlyIntentHandler');
        return SubjectIntentHandler.handle(handlerInput);
    }
}

const SubjectIntentHandler = {
    canHandle(handlerInput) {
        console.log('in SubjectIntentHandler');
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SubjectIntent';
    },
    async handle(handlerInput) {
        console.log('in SubjectIntentHandler');

        let subject ='';
        // handlerInput.requestEnvelope.request.intent.slots.commentaryNumber && handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value
        if(handlerInput.requestEnvelope.request.intent.slots.subject 
            && handlerInput.requestEnvelope.request.intent.slots.subject.value) {
            
                //const subject = this.getInput('subject').key;
                subject = handlerInput.requestEnvelope.request.intent.slots.subject.value;
        }

        if(!subject && subject === '') {
            return UnhandledIntentHandler.handle(handlerInput);
        } else {

            //replace with the original url and test
            // const feed = await audioFeed.getJSONFeed(process.env.AUDIO_API_URI);
            const feed = await audioFeed.getJSONFeed(feedUrl);
            const subjects = feed.getSubjectList(subject);

            const titles = subjects.map(episode => {
                return `episode ${episode.episode_num}, ${episode.title}`
            })
            const data =  {
                titles: titles,
                prompt: library.episodes.prompt,
                reprompt: library.episodes.reprompt,
                repromptMore: library.episodes.repromptMore
            }

            console.log('before sending to promptepisode from subjectintenthandler');
            //call the promptepisodes method
            // this.toStateIntent(state.LIBRARY, 'PromptEpisodes', data);
            return intentHelper.promptEpisodes(handlerInput, data);
        }

    }
}

const DescriptionIntentHandler = {
    canHandle(handlerInput) {
        console.log('in DescriptionIntentHandler');
        return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'DescriptionIntent';
    },
    handle(handlerInput) {
        console.log('in DescriptionIntentHandler');
    
        var speech = new Speech();
        speech.audio(library.description.prompt);
        
        var repromptSpeech = new Speech();
        repromptSpeech.audio(library.description.prompt);

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


const MoreIntentHandler = {
    canHandle(handlerInput) {
        console.log('in MoreIntentHandler');
        return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'MoreIntent';
    },
    handle(handlerInput) {
        console.log('in MoreIntentHandler');
        
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const titles = attributes.titles;

        if(!titles.length) {
            var speech = new Speech();
            speech.audio(lodash.sample(library.nocontent.prompt));
            
            var repromptSpeech = new Speech();
            repromptSpeech.audio(lodash.sample(library.nocontent.prompt));

            //make it ssml
            var speechOutput = speech.ssml(true);
            var repromptSpeechOutput = repromptSpeech.ssml(true);

            return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(repromptSpeechOutput)
            .withShouldEndSession(true)
            .getResponse();
        } else {
            const data =  {
                titles: titles,
                prompt: library.moreEpisodes.prompt,
                reprompt: library.moreEpisodes.reprompt,
                repromptMore: library.moreEpisodes.repromptMore
            }

            //call the promptepisodes method
            // this.toStateIntent(state.LIBRARY, 'PromptEpisodes', data);
            intentHelper.promptEpisodes(handlerInput, data);
        }
      
    }
}

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
        .speak(speechOutput)
        .withSimpleCard('My Next Move', latest.title)
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
    EpisodeOnlyIntentHandler,
    SubjectIntentHandler,
    SubjectOnlyIntentHandler,
    DescriptionIntentHandler,
    MoreIntentHandler,
    LatestIntentHandler,
    AudioPlayerEventHandler,
    PauseIntentHandler,
    ResumeIntentHandler,
    ErrorHandler,
    RequestLog,
    ResponseLog
}