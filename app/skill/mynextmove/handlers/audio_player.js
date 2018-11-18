const audioPlayer = require('../responses/audioPlayer');
const errors = require('../responses/errors');

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
        .withShouldEndSession(true)
        .getResponse();
       
    }
};

//need to compare and re-check this
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

//UI controll command to implement
// 'PLAYBACKCONTROLLER': {
//     'PlaybackController.PlayCommandIssued': function() {
//         console.log('Play Command Issued');
//         this.toIntent('ResumeIntent');
//     },

//     'PlaybackController.PauseCommandIssued': function() {
//         console.log('Pause Command Issued');
//         this.toIntent('PauseIntent');
//     }
// },

// UnhandledAudioIntent: function() {
//     console.log('Unhandled Audio Intent');
//     let speech = this.speechBuilder()
//         .addAudio(unhandledAudio.prompt, unhandledAudio.promptText);
//     this.ask(speech)
// },

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