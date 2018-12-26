const main =  require("./responses/main");

const lodash = require('lodash');
var Speech = require('ssml-builder');

module.exports = {
    welcomeIntent(handlerInput) {
        console.log('Welcome Intent')

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
    },

    newWelcomeIntent(handlerInput) {
        console.log('New Welcome Intent')

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
    },
    promptEpisodes(handlerInput, data) {

        console.log('PromptEpisodes');
        const titles = data.titles;
        const subSet = titles.splice(0, 3);

        var attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.titles = titles;
        handlerInput.attributesManager.setSessionAttributes(attributes);

        //need to check and implement this
        // const list = createOxfordCommaList(subSet);
        const list = "";

        //add speech
        var speech = new Speech();
        speech.paragraph(data.prompt)

        //add reprompt
        var repromptSpeech = new Speech();
        // repromptSpeech.say(data.reprompt);

        // //make it ssml
        // var speechOutput = speech.ssml();
        // var repromptSpeechOutput = repromptSpeech.ssml();

        // var speechOutput = speech.toObject();
        // var repromptSpeechOutput = repromptSpeech.toObject();

        console.log('titles.length', titles.length);

        var speechOutput = speech.ssml();
        console.log('********************************************');
        console.log(speechOutput);
        console.log('********************************************');
        // console.log(repromptSpeechOutput);
        console.log('********************************************');
        return handlerInput.responseBuilder
          .speak(speechOutput)
        //   .reprompt(repromptSpeechOutput)
          .withShouldEndSession(false)
          .getResponse();

        //need to check and implement this
        // let reprompt = this.speechBuilder()
        // .addText(data.reprompt)
        // .addText(data.repromptMore, titles.length > 0)

        // this.followUpState(state.LIBRARY)
        //   .ask(speech, reprompt);
    }

};

