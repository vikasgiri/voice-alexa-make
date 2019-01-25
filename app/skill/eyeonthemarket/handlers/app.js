const Speech = require('ssml-builder');
const lodash = require('lodash');
const request = require('request-promise');

const easterEggs = require('../responses/easterEggs');
const exceptions = require('../responses/exceptions');
const welcome = require('../responses/welcome');
const helper = require('./helper');

const config = require('../../../config/config.json');
const feedUrl = config.eyeonthemarket.feedUrl;
const AudioFeed = require('../../../libs/audio-feed-api');
const audioFeed = new AudioFeed(feedUrl);

//launchrequest
const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
      console.log('In launch handler')

      const feed = await audioFeed.getJSONFeed(feedUrl);
      const sortedData = feed.getSortedAudioUrl();
      const audioURLFeed = sortedData[sortedData.length - 1].audioURL

      console.log('latest ===>', audioURLFeed);

      var dataObj = {};
      dataObj.userid = handlerInput.requestEnvelope.session.user.userId;
      dataObj.skillid = handlerInput.requestEnvelope.session.application.applicationId;

      var options = {
        method: 'POST',
        uri: config.dbServiceBase + config.getUserVisitCountOnSkill,
        body: dataObj,
        timeout: 5000,
        json: true // Automatically stringifies the body to JSON
      };

      var promiseObj = new Promise(function(resolve, reject) {
          request(options)
            .then(function (result) {
                resolve(result);
            })
            .catch(function (err) {
                reject();
            });
      });

      return promiseObj.then(function(result) {

        // if (!this.user().data.subscription) this.user().data.subscription = false;
        // const subCheck = this.user().data.subscription;
        const subCheck = false;
        const USER_TYPE = result.visit_count < 2 ? 'newUser' : subCheck ? 'subscribedUser' : 'returningUser'
        
        var speech = new Speech();

        if(result.visit_count < 4) {
          speech.audio(lodash.sample(welcome[USER_TYPE].prompt));
        } else if(result.visit_count >= 4) {
          speech.audio(lodash.sample(welcome.subscribedUser.prompt));
        }

        var speechOutput = speech.ssml(true);
      
        // podcastUrl = audioURLFeed;
        //store the audio url in DB
        var dataObj = {};
        dataObj.userid = handlerInput.requestEnvelope.session.user.userId;
        dataObj.skillid = handlerInput.requestEnvelope.session.application.applicationId;
        dataObj.offsetmili = "0";
        dataObj.audiourl = audioURLFeed;

        var options = {
          method: 'POST',
          uri: config.dbServiceBase + config.updateSkillAudio,
          body: dataObj,
          timeout: 5000,
          json: true // Automatically stringifies the body to JSON
        };

        var promiseObjNew = new Promise(function(resolve, reject) {
          request(options)
            .then(function (result) {
                resolve();
            })
            .catch(function (err) {
                reject();
            });
          });

          return promiseObjNew.then(function(result) {
            console.log('--------------------------------resume related---------------------------------');
            
            return handlerInput.responseBuilder
              .speak(speechOutput)
              .withSimpleCard('Eye on the market', 'Eye on the market')
              .addAudioPlayerPlayDirective('REPLACE_ALL', audioURLFeed, 'wx', 0,null)
              .withShouldEndSession(false)
              .getResponse();
           
            })
            .catch(function(err) {
                console.log(err)
            });
       
      })
      .catch(function(err) {
        console.log('in promise catch');
        console.log(err);
        return ErrorHandler.handle(handlerInput);
      });
  }
};

//PodcastIntent
const PodcastIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'PodcastIntent';
  },
  async handle(handlerInput) {
    console.log('In PodcastIntentHandler')

    var dataObj = {};
    dataObj.userid = handlerInput.requestEnvelope.session.user.userId;
    dataObj.skillid = handlerInput.requestEnvelope.session.application.applicationId;
   
    var options = {
      method: 'POST',
      uri: config.dbServiceBase + config.getAudioUrlOnUserSkillId,
      body: dataObj,
      json: true // Automatically stringifies the body to JSON
    };

    var promiseObj = new Promise(function(resolve, reject) {
      request(options)
        .then(function (result) {
            resolve(result);
        })
        .catch(function (err) {
            reject();
        });
      });
    
    return promiseObj.then(function(result) {
      console.log('--------------------------------resume related---------------------------------');
      return handlerInput.responseBuilder
      .addAudioPlayerPlayDirective('REPLACE_ALL', result.audiourl, 'wx', 0, null)
      .withShouldEndSession(true)
      .getResponse();
    })
    .catch(function(err) {
      console.log(err)

      // podcastURL will generate an error. 
      return handlerInput.responseBuilder
        .addAudioPlayerPlayDirective('REPLACE_ALL', podcastURL, 'wx', 0,null)
        .withShouldEndSession(true)
        .getResponse();
    });

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

      return CancelIntentHandler.handle(handlerInput);
      // return handlerInput.responseBuilder
      // .addAudioPlayerStopDirective()
      // .withShouldEndSession(true)
      // .getResponse();

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

      var speech = new Speech();
      speech.paragraph(exceptions.goodbye.prompt);
      var speechOutput = speech.ssml();

      console.log('in CancelIntentHandler');
      return handlerInput.responseBuilder
      .speak(speechOutput)
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
      var speechOutput = speech.ssml();
     
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


//intents to get the notifications
const SkillEventHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'AlexaSkillEvent.SkillEnabled' ||
      request.type === 'AlexaSkillEvent.SkillDisabled' ||
      request.type === 'AlexaSkillEvent.SkillPermissionAccepted' ||
      request.type === 'AlexaSkillEvent.SkillPermissionChanged' ||
      request.type === 'AlexaSkillEvent.SkillAccountLinked');
  },
  handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.context.System.user.userId;
    let acceptedPermissions;
    switch (handlerInput.requestEnvelope.request.type) {
      case 'AlexaSkillEvent.SkillEnabled':
        console.log(`skill was enabled for user: ${userId}`);
        break;
      case 'AlexaSkillEvent.SkillDisabled':
        console.log(`skill was disabled for user: ${userId}`);
        break;
      case 'AlexaSkillEvent.SkillPermissionAccepted':
        acceptedPermissions = JSON.stringify(handlerInput.requestEnvelope.request.body.acceptedPermissions);
        console.log(`skill permissions were accepted for user ${userId}. New permissions: ${acceptedPermissions}`);
        break;
      case 'AlexaSkillEvent.SkillPermissionChanged':
        acceptedPermissions = JSON.stringify(handlerInput.requestEnvelope.request.body.acceptedPermissions);
        console.log(`skill permissions were changed for user ${userId}. New permissions: ${acceptedPermissions}`);
        break;
      case 'AlexaSkillEvent.SkillAccountLinked':
        console.log(`skill account was linked for user ${userId}`);
        break;
      default:
        console.log(`unexpected request type: ${handlerInput.requestEnvelope.request.type}`);
    }
  },
};

//helpintent
const NotificationIntentHandler = {
  canHandle(handlerInput) {
   console.log('In help intent');
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NotificationIntent';
  },
   
  handle(handlerInput) {
      var speech = new Speech();
      speech.paragraph(welcome.notifications.prompt);
      
      //make it ssml
      var speechOutput = speech.ssml(true);

      return handlerInput.responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(true)
      .getResponse();
}
};

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
        .withShouldEndSession(false)
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
        .withShouldEndSession(false)
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

      var dataObj = {};
      dataObj.userid = handlerInput.requestEnvelope.session.user.userId;
      dataObj.skillid = handlerInput.requestEnvelope.session.application.applicationId;
      dataObj.offsetmili = handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds;

      var options = {
        method: 'POST',
        uri: config.dbServiceBase + config.updateSkillAudioOffset,
        body: dataObj,
        json: true // Automatically stringifies the body to JSON
      };

      var promiseObj = new Promise(function(resolve, reject) {
        request(options)
          .then(function (result) {
              resolve();
          })
          .catch(function (err) {
              reject();
          });
        });
      
      return promiseObj.then(function() {
        console.log('--------------------------------pause related---------------------------------');
        return handlerInput.responseBuilder
          .addAudioPlayerStopDirective()
          .withShouldEndSession(false)
          .getResponse();
      })
      .catch(function(err) {
        console.log('--------------------------------pause related---------------------------------');
        return handlerInput.responseBuilder
          .addAudioPlayerStopDirective()
          .withShouldEndSession(false)
          .getResponse();
      });
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
  
      var dataObj = {};
      dataObj.userid = handlerInput.requestEnvelope.session.user.userId;
      dataObj.skillid = handlerInput.requestEnvelope.session.application.applicationId;
    
      var options = {
        method: 'POST',
        uri: config.dbServiceBase + config.getAudioUrlOnUserSkillId,
        body: dataObj,
        json: true // Automatically stringifies the body to JSON
      };

      var promiseObj = new Promise(function(resolve, reject) {
        request(options)
          .then(function (result) {
              resolve(result);
          })
          .catch(function (err) {
              reject();
          });
        });
      
      return promiseObj.then(function(result) {
        console.log('--------------------------------resume related---------------------------------');
        console.log("result.offsetmili :::::: " + result.offsetmili)

        if(result.offsetmili === null){
          return handlerInput.responseBuilder
          .addAudioPlayerPlayDirective('REPLACE_ALL', result.audiourl, 'wx', 0, null)
          .withShouldEndSession(true)
          .getResponse();
        } else {
          console.log("2222222222222");
          return handlerInput.responseBuilder
          .addAudioPlayerPlayDirective('REPLACE_ALL', result.audiourl, 'wx', result.offsetmili ,null)
          .withShouldEndSession(true)
          .getResponse();
        }
      })
      .catch(function(err) {
        console.log(err)

        console.log("333333333333333");
        return handlerInput.responseBuilder
          .addAudioPlayerPlayDirective('REPLACE_ALL', podcastURL, 'wx', 0,null)
          .withShouldEndSession(true)
          .getResponse();
      });
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
      // console.log('THIS.EVENT = ' + JSON.stringify(this.event));
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
    SkillEventHandler,
    CancelIntentHandler,
    StopIntentHandler,
    PodcastIntentHandler,
    PauseIntentHandler,
    ResumeIntentHandler,
    ErrorHandler,
    RequestLog,
    ResponseLog
}