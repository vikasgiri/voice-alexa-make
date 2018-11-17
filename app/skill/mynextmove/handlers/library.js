const lodash = require('lodash');
const AudioFeed = require('../libs/audio-feed-api');
const audioFeed = new AudioFeed(process.env.AUDIO_API_URI);

const intentHelper = require('../intentHelper');
const library = require('../responses/library');
const error = require('../responses/errors');
const audioPlayer = require('../responses/audioPlayer');

const IntroIntent = {
    canHandle(handlerInput) {
        console.log('in IntroIntent LibraryIntent');
        return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.type === 'LibraryIntent';
    },
    handle(handlerInput) {
        console.log('in in IntroIntent LibraryIntent');
    
        var speech = new Speech();
        speech.audio(library.intro);
        var speechOutput = speech.ssml(true);
        
        return handlerInput.responseBuilder
        .speak(speechOutput)
        .withShouldEndSession(true)
        .getResponse();
    }
}

const EpisodeOnlyIntentHandler = {
    canHandle(handlerInput) {
        console.log('in EpisodeOnlyIntentHandler');
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'EpisodeOnlyIntent';
    },
    handle(handlerInput) {
        console.log('in EpisodeOnlyIntentHandler');
        return EpisodeIntentHandler.handle(handlerInput);
    }
}

//check how and where to add async
// async EpisodeIntent () {
const EpisodeIntentHandler = {
    canHandle(handlerInput) {
        console.log('in EpisodeIntentHandler');
        return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.type === 'EpisodeIntent';
    },
    handle(handlerInput) {
        console.log('in EpisodeIntentHandler');
    
        let episodeNumber ='';
        // handlerInput.requestEnvelope.request.intent.slots.commentaryNumber && handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value
        if(handlerInput.requestEnvelope.request.intent.slots.episodeNumber 
            && handlerInput.requestEnvelope.request.intent.slots.episodeNumber.value) {
            
            episodeNumber = handlerInput.requestEnvelope.request.intent.slots.episodeNumber.value;
        }

        //replace the url and check
        const feed = await audioFeed.getJSONFeed(process.env.AUDIO_API_URI);
        const episode = feed.getEpisode(episodeNumber);

        if(episode === '') {

            //send to unhandled or fallback
            this.toIntent('Unhandled');
        } else {

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
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SubjectOnlyIntent';
    },
    handle(handlerInput) {
        console.log('in SubjectOnlyIntentHandler');
        return SubjectIntentHandler.handle(handlerInput);
    }
}

//add asnc later to this function
// async SubjectIntent() {
const SubjectIntentHandler = {
    canHandle(handlerInput) {
        console.log('in SubjectIntentHandler');
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SubjectIntent';
    },
    handle(handlerInput) {
        console.log('in SubjectIntentHandler');

        let subject ='';
        // handlerInput.requestEnvelope.request.intent.slots.commentaryNumber && handlerInput.requestEnvelope.request.intent.slots.commentaryNumber.value
        if(handlerInput.requestEnvelope.request.intent.slots.subject 
            && handlerInput.requestEnvelope.request.intent.slots.subject.value) {
            
                //const subject = this.getInput('subject').key;
                subject = handlerInput.requestEnvelope.request.intent.slots.subject.value;
        }

        if(subject === '') {
            this.toIntent('Unhandled');
        } else {

            //replace with the original url and test
            const feed = await audioFeed.getJSONFeed(process.env.AUDIO_API_URI);
            const subjects = feed.getSubjectList(subject);

            const titles = subjects.map(episode => {
                return `episode ${episode.episode_num}, ${episode.title}`
            })
            const data =  {
                titles: titles,
                prompt: episodes.prompt,
                reprompt: episodes.reprompt,
                repromptMore: episodes.repromptMore
            }

            //call the promptepisodes method
            // this.toStateIntent(state.LIBRARY, 'PromptEpisodes', data);
            intentHelper.promptEpisodes(handlerInput, data);
        }

    }
}

const DescriptionIntentHandler = {
    canHandle(handlerInput) {
        console.log('in DescriptionIntentHandler');
        return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.type === 'DescriptionIntent';
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
        && handlerInput.requestEnvelope.request.type === 'MoreIntent';
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

module.exports = {
    IntroIntent,
    EpisodeOnlyIntentHandler,
    EpisodeIntentHandler,
    SubjectOnlyIntentHandler,
    SubjectIntentHandler,
    DescriptionIntentHandler,
    MoreIntentHandler
}