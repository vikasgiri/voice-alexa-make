const Speech = require('ssml-builder');
const lodash = require('lodash');
const request = require('request-promise');
const Alexa = require('ask-sdk');

const easterEggs = require('../responses/easterEggs');
const exceptions = require('../responses/exceptions');
const welcome = require('../responses/welcome');
const helper = require('./helper');

const config = require('../../../config/config.json');
const feedUrl = config.eyeonthemarket.feedUrl;
const AudioFeed = require('../../../libs/audio-feed-api');
const audioFeed = new AudioFeed(feedUrl);

var podcastUrl = "";
var playBackInfo = false;
//launchrequest
const LaunchRequestHandler = {
    canHandle(handlerInput) {
      console.log('LaunchRequest');
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
      console.log('In launch handler')

      const feed = await audioFeed.getJSONFeed(feedUrl);
      const sortedData = feed.getSortedAudioUrl();
      const audioURLFeed = sortedData[0].audioURL

      //when the DB fails to make it work in offline mode.
      podcastUrl = audioURLFeed;
      console.log('latest ===>', podcastUrl);

      console.log(1);
      var dataObj = {};
      dataObj.userid = handlerInput.requestEnvelope.session.user.userId;
      dataObj.skillid = handlerInput.requestEnvelope.session.application.applicationId;

      var options = {
        method: 'POST',
        uri: config.dbServiceBase + config.dbService.getUserVisitCountOnSkill,
        body: dataObj,
        timeout: 5000,
        json: true // Automatically stringifies the body to JSON
      };

      console.log("options : " + JSON.stringify(options));
      console.log(2);
      var promiseObj = new Promise(function(resolve, reject) {
          request(options)
            .then(function (result) {
              console.log(3);
                resolve(result);
            })
            .catch(function (err) {
              console.log(4);
                reject();
            });
      });

      return promiseObj.then(function(result) {

        console.log(5);
        console.log("subscription : " + result.subscription);
        // if (!this.user().data.subscription) this.user().data.subscription = false;
        // const subCheck = this.user().data.subscription;

        const subCheck = result.subscription === 0 ? false : true;
        const USER_TYPE = result.visit_count < 2 ? 'newUser' : subCheck ? 'subscribedUser' : 'returningUser'
        
        console.log("subCheck : " + subCheck);

        var speech = new Speech();

        console.log("user type" + USER_TYPE);
        console.log("result.visit_count : " + result.visit_count );
        console.log("result object : " + JSON.stringify(result));

        if(result.visit_count < 4) {
          speech.audio(lodash.sample(welcome[USER_TYPE].prompt));
        } else if(result.visit_count >= 4) {
          speech.audio(lodash.sample(welcome.subscribedUser.prompt));
        }

        var visitVal = result.visit_count;
        
        console.log(6);
        console.log("speech object" + speech);
        // podcastUrl = audioURLFeed;
        //store the audio url in DB
        var dataObj = {};
        dataObj.userid = handlerInput.requestEnvelope.session.user.userId;
        dataObj.skillid = handlerInput.requestEnvelope.session.application.applicationId;
        dataObj.offsetmili = "0";
        dataObj.audiourl = audioURLFeed;

        var options = {
          method: 'POST',
          uri: config.dbServiceBase + config.dbService.updateSkillAudio,
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
            
            if(visitVal < 4 && !subCheck ) {
              
              //if user vist is 1 and subscription is false
        //       const card = new AskForListPermissionsCard(['read']);
				// card.setPermissions(['alexa::devices:all:notifications:write']);

        // this.alexaSkill().showCard(card);
        
              console.log('subcheck false or 0');

              speech.paragraph(welcome.notifications.prompt);
              var speechOutput = speech.ssml(true);
              
              return handlerInput.responseBuilder
              .speak(speechOutput)
              .withStandardCard('Eye on the market', 'Eye on the market', 'https://s3.amazonaws.com/alexa-chase-voice/image/alexa_card_logo_small.png', 'https://s3.amazonaws.com/alexa-chase-voice/image/alexa_card_logo_large.png')
              // .addAudioPlayerPlayDirective('REPLACE_ALL', audioURLFeed, 'wx', 0,null)
              .withShouldEndSession(false)
              .getResponse();
            } else {
              
              console.log('subcheck true  or 1 or visitcount greater than 4');
              var speechOutput = speech.ssml(true);
              
              return handlerInput.responseBuilder
              .speak(speechOutput)
              // .withSimpleCard('Eye on the market', 'Eye on the market')
              .withStandardCard('Eye on the market', 'Eye on the market', 'https://s3.amazonaws.com/alexa-chase-voice/image/alexa_card_logo_small.png', 'https://s3.amazonaws.com/alexa-chase-voice/image/alexa_card_logo_large.png')
              .addAudioPlayerPlayDirective('REPLACE_ALL', audioURLFeed, 'wx', 0,null)
              .withShouldEndSession(false)
              .getResponse();
            }
            })
            .catch(function(err) {
                console.log(err)
            });
       
      })
      .catch(function(err) {
        console.log('in promise catch');
        //if db connection fails
        console.log('DB failed ===>', audioURLFeed);
        console.log(err);

        var speech = new Speech();
        speech.audio(lodash.sample(welcome['newUser'].prompt));
        var speechOutput = speech.ssml(true);

        console.log('before support display ');
        if (supportsDisplay(handlerInput) ) {

          console.log('inside support display if');
          const myImage1 = new Alexa.ImageHelper()
            .addImageInstance(DisplayImg1.url)
            .getImage();
    
         
          const primaryText = new Alexa.RichTextContentHelper()
            .withPrimaryText('test')
            .getTextContent();
    
         return handlerInput.responseBuilder.addRenderTemplateDirective({
            type: 'BodyTemplate1',
            token: 'string',
            backButton: 'HIDDEN',
            backgroundImage: myImage1,
            // image: myImage1,
            title: "space facts",
            textContent: primaryText,
          })
          // .addAudioPlayerPlayDirective('REPLACE_ALL', audioURLFeed, 'wx', 0,null)
          // .addAudioPlayerPlayDirective('REPLACE_ALL', audioURLFeed, 'wx', 0,null, getAudioPlayerMetadata('Sample1, Sample2', DisplayImg1.url, DisplayImg1.url))
          .addAudioPlayerPlayDirective('REPLACE_ALL', audioURLFeed, 'wx', 0,null)
          .withShouldEndSession(true)
          .getResponse();
    
      }

        return handlerInput.responseBuilder
              .speak(speechOutput)
              // .withSimpleCard('Eye on the market', 'Eye on the market')
              // .withStandardCard('Eye on the market', 'Eye on the market', 'https://s3.amazonaws.com/alexa-chase-voice/image/alexa_card_logo_small.png', 'https://s3.amazonaws.com/alexa-chase-voice/image/alexa_card_logo_large.png')
              .addAudioPlayerPlayDirective('REPLACE_ALL', audioURLFeed, 'wx', 0,null)
              .withShouldEndSession(true)
              .getResponse();
      });
  }
};

//PodcastIntent
const PodcastIntentHandler = {
  canHandle(handlerInput) {
    console.log('PodcastIntentHandler');
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
      uri: config.dbServiceBase + config.dbService.getAudioUrlOnUserSkillId,
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
      console.log('UnhandledIntentHandler');
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


const YesIntentHandler = {
    canHandle(handlerInput) {
      try {
        console.log('in YesIntentHandler');
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
      } catch (error) {
        console.log("YesIntentHandler canHandle : " + error);
      }
    },
    handle(handlerInput) {
      try {
        
      
            console.log('in YesIntentHandler');

            console.log("Previous intent value : " + handlerInput.requestEnvelope.request.intent.name );
            const attributes = handlerInput.attributesManager.getSessionAttributes();

            console.log("attributes from notifications yesintent : " +  JSON.stringify(attributes));

            console.log("attributes.currentIntent : " + attributes.currentIntent);

            if(attributes.previousIntent === 'NotificationAskIntent') {

            console.log("i am in the if part of notificationsintent");
            //this.alexaSkill().tell(welcome.notifications.yes.yes);

            var speech = new Speech();
            speech.paragraph(welcome.notifications.yes.yes);
            var speechOutput = speech.ssml();

            var dataObj = {};
            dataObj.userid = handlerInput.requestEnvelope.session.user.userId;
            dataObj.skillid = handlerInput.requestEnvelope.session.application.applicationId;

            var options = {
            method: 'POST',
            uri: config.dbServiceBase + config.dbService.getAudioUrlOnUserSkillId,
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

              return handlerInput.responseBuilder
              .speak(speechOutput)
              .addAudioPlayerPlayDirective('REPLACE_ALL', result.audiourl, 'wx', 0, null)
              .withShouldEndSession(true)
              .getResponse();

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

            var dataObj = {};
            dataObj.userid = handlerInput.requestEnvelope.session.user.userId;
            dataObj.skillid = handlerInput.requestEnvelope.session.application.applicationId;
            dataObj.subscription = 1;

            var options = {
            method: 'POST',
            uri: config.dbServiceBase + config.dbService.updateUserSubscription,
            body: dataObj,
            json: true // Automatically stringifies the body to JSON
            };

            console.log("************** Subscription getting updated******************");

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
              return NotificationAskIntentHandler.handle(handlerInput);
            })
            .catch(function(err) {
              console.log(err);
              return NotificationAskIntentHandler.handle(handlerInput);
            });
      } catch (error) {
        console.log("YesIntentHandler handle : " + error);
      }
    }
  };


  //helpintent
const NotificationAskIntentHandler = {
  canHandle(handlerInput) {
   console.log('In NotificationAskIntentHandler');
    try {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NotificationAskIntent';
    } catch (error) {
      console.log("NotificationAskIntentHandler canHandle : " + error);
    }
    
  },
   
  handle(handlerInput) {
    try {
      
      console.log('In NotificationAskIntentHandler handle method');

      const PERMISSIONS = ['alexa::devices:all:notifications:write'];
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      attributes.currentIntent = 'NotificationAskIntent';
      handlerInput.attributesManager.setSessionAttributes(attributes);

      console.log("attributes from notifications : " +  JSON.stringify(attributes));

      var speech = new Speech();
      speech.paragraph(welcome.notifications.yes.prompt);
      //make it ssml
      var speechOutput = speech.ssml(true);

      // const consentToken = handlerInput.requestEnvelope.context.System.user.permissions && handlerInput.requestEnvelope.context.System.user.permissions.consentToken;

      // console.log("consentToken from notification intent : " + consentToken);
      // .withAskForPermissionsConsentCard(PERMISSIONS)
      return handlerInput.responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(false)
      .getResponse();
    } catch (error) {
      console.log("NotificationAskIntentHandler handle : " + error);
    }
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

      console.log();

      var speech = new Speech();
      speech.paragraph(welcome.notifications.no);
      var speechOutput = speech.ssml(true);

      var dataObj = {};
      dataObj.userid = handlerInput.requestEnvelope.session.user.userId;
      dataObj.skillid = handlerInput.requestEnvelope.session.application.applicationId;
    
      var options = {
        method: 'POST',
        uri: config.dbServiceBase + config.dbService.getAudioUrlOnUserSkillId,
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

        if(result.offsetmili === null){
          return handlerInput.responseBuilder
          .speak(speechOutput)
          .addAudioPlayerPlayDirective('REPLACE_ALL', result.audiourl, 'wx', 0, null)
          .withShouldEndSession(true)
          .getResponse();
        } else {
          console.log("2222222222222");
          return handlerInput.responseBuilder
          .speak(speechOutput)
          .addAudioPlayerPlayDirective('REPLACE_ALL', result.audiourl, 'wx', result.offsetmili ,null)
          .withShouldEndSession(true)
          .getResponse();
        }
      })
      .catch(function(err) {
        console.log(err)

        console.log("333333333333333" + podcastURL);
        return handlerInput.responseBuilder
          .speak(speechOutput)
          .addAudioPlayerPlayDirective('REPLACE_ALL', podcastURL, 'wx', 0,null)
          .withShouldEndSession(true)
          .getResponse();
      });
    }
  };


//intents to get the notifications
const SkillEventHandler = {
  canHandle(handlerInput) {
    console.log('in SkillEventHandler');
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

// //helpintent
// const NotificationIntentHandler = {
//   canHandle(handlerInput) {
//    console.log('In help intent');
//     return handlerInput.requestEnvelope.request.type === 'IntentRequest'
//       && handlerInput.requestEnvelope.request.intent.name === 'NotificationIntent';
//   },
   
//   handle(handlerInput) {
//       var speech = new Speech();
//       speech.paragraph(welcome.notifications.prompt);
      
//       //make it ssml
//       var speechOutput = speech.ssml(true);

//       return handlerInput.responseBuilder
//       .speak(speechOutput)
//       .withShouldEndSession(true)
//       .getResponse();
// }
// };

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
      console.log('in PauseIntentHandler');
      console.log(JSON.stringify(handlerInput.requestEnvelope));
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent';
    },
    handle(handlerInput) {
      console.log('in PauseIntentHandler');
      console.log('--------------------------------pause related then 1---------------------------------');

      if(playBackInfo) {
        console.log("the playBackInfo is : " + playBackInfo);
      } else {
        console.log("false the playBackInfo is : " + playBackInfo);
      }

      var dataObj = {};
      dataObj.userid = handlerInput.requestEnvelope.session.user.userId;
      dataObj.skillid = handlerInput.requestEnvelope.session.application.applicationId;
      dataObj.offsetmili = handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds;

      var options = {
        method: 'POST',
        uri: config.dbServiceBase + config.dbService.updateSkillAudioOffset,
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
        console.log('--------------------------------pause related then---------------------------------');
        return handlerInput.responseBuilder
        .addAudioPlayerStopDirective()
        .getResponse();
      })
      .catch(function(err) {
        console.log('--------------------------------pause related catch ---------------------------------');
        return handlerInput.responseBuilder
        .addAudioPlayerStopDirective()
        .getResponse();
      });
    }
};

const ResumeIntentHandler = {
    canHandle(handlerInput) {
      console.log('in ResumeIntentHandler');
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
        uri: config.dbServiceBase + config.dbService.getAudioUrlOnUserSkillId,
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
      console.log("here in AudioPlayerEventHandler canhandle ");
      return handlerInput.requestEnvelope.request.type.startsWith('AudioPlayer.');
    },
    async handle(handlerInput) {
  
      console.log("here in AudioPlayerEventHandler handle ");
      console.log('AudioPlayerEventHandler 1');
      const {
        requestEnvelope,
        // attributesManager,
        responseBuilder
      } = handlerInput;
      const audioPlayerEventName = requestEnvelope.request.type.split('.')[1];
    
      var speech = new Speech();
      speech.paragraph(exceptions.goodbye.prompt);
      var speechOutput = speech.ssml();

      console.log('AudioPlayerEventHandler 2');
      switch (audioPlayerEventName) {
        case 'PlaybackStarted':
          console.log('AudioPlayerEventHandler 3');
          playBackInfo =  true;
          responseBuilder.withShouldEndSession(true)
          break;
        case 'PlaybackFinished':
          console.log('AudioPlayerEventHandler 4');
          playBackInfo =  false;
          responseBuilder.addAudioPlayerStopDirective().withShouldEndSession(true)
       
          break;
        case 'PlaybackStopped':
          console.log('AudioPlayerEventHandler 5');
          responseBuilder.withShouldEndSession(true)
          break;
        case 'PlaybackNearlyFinished':
          {
            console.log('AudioPlayerEventHandler 6');
            responseBuilder.withShouldEndSession(true)
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
  
      try {
    
      
      // console.log('THIS.EVENT = ' + JSON.stringify(this.event));
      console.log("REQUEST ENVELOPE MY-NEXT-MOVE : " + JSON.stringify(handlerInput.requestEnvelope));

      if(handlerInput.requestEnvelope.request.type === 'LaunchRequest') {
        console.log("in if : " + JSON.stringify(handlerInput.requestEnvelope.request));
        console.log("in if : " + handlerInput.requestEnvelope.request.type );
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.previousIntent = 'LaunchRequest';
        attributes.currentIntent = 'LaunchRequest';
        handlerInput.attributesManager.setSessionAttributes(attributes);
      } else if(handlerInput.requestEnvelope.request.intent) {
        console.log("in else : " + handlerInput.requestEnvelope.request.intent.name );
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.previousIntent = attributes.currentIntent;
        attributes.currentIntent = handlerInput.requestEnvelope.request.intent.name;
        handlerInput.attributesManager.setSessionAttributes(attributes);
      }

    } catch (error) {
        console.log("request log catch : " + error);
    }
    }
};
  
//logging response to database
const ResponseLog = {
    process(handlerInput) {
        console.log("RESPONSE ENVELOPE MY-NEXT-MOVE : " + JSON.stringify(handlerInput));
    }
};

const PlaybackHandler = {
  canHandle(handlerInput) {
      console.log('in PlaybackHandler');
    
      const request = handlerInput.requestEnvelope.request;
      return (request.type === 'PlaybackController.PlayCommandIssued' ||
      request.type === 'PlaybackController.PauseCommandIssued');
  },
  handle(handlerInput) {
      console.log('in PlaybackHandler handle ');
      console.log('handlerInput.requestEnvelope.request.type : ' +  handlerInput.requestEnvelope.request.type);
   
    switch (handlerInput.requestEnvelope.request.type) {
      case 'PlaybackController.PlayCommandIssued':
        ResumeIntentHandler.handle(handlerInput);
        break;
      case 'PlaybackController.PauseCommandIssued':
        PauseIntentHandler.handle(handlerInput);
        break;
      
      default:
        console.log(`unexpected request type: ${handlerInput.requestEnvelope.request.type}`);
    }
  }
};

/* HELPER FUNCTIONS */

// returns true if the skill is running on a device with a display (show|spot)
function supportsDisplay(handlerInput) {
  var hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display

  console.log("Supported Interfaces are" + JSON.stringify(handlerInput.requestEnvelope.context.System.device.supportedInterfaces));
  return hasDisplay;
}

const DisplayImg1 = {
  title: 'Market Insights',
  url: 'https://s3.amazonaws.com/alexa-chase-voice/image/alexa_card_logo_large.png'
};

function getAudioPlayerMetadata(title, subtitle, art, backgroundImage) {
  return {
    title,
    subtitle,
    art: new Alexa.ImageHelper().addImageInstance(art).getImage(),
    backgroundImage: new Alexa.ImageHelper().addImageInstance(backgroundImage).getImage()
  };
}

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
    NoIntentHandler,
    YesIntentHandler,
    NotificationAskIntentHandler,
    PlaybackHandler,
    ErrorHandler,
    RequestLog,
    ResponseLog
}