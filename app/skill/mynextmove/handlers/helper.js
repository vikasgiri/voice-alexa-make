const main =  require("../responses/main");
const createOxfordCommaList = require('../../../libs/utils').createOxfordCommaList;

const listTemplate = require('../apl/list_template');
const subjectsData = require('../apl/subjects_data');
const episodesData = require('../apl/episodes_data');
const episodesTemplate = require('../apl/episode');

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
        const podcasts = data.podcasts;
        const subSet = podcasts.splice(0, 3);

        var attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.podcasts = podcasts;
        handlerInput.attributesManager.setSessionAttributes(attributes);

        const titles = subSet.map(episode => {
            return `episode ${episode.episode_num}, ${episode.title}`
        });
        //need to check and implement this
        // const list = createOxfordCommaList(subSet);
        const list = createOxfordCommaList(titles);

        // console.log('list : ' + JSON.stringify(list));
        // console.log('data.prompt : ' + JSON.stringify(data.prompt));
        //add speech
        var speech = new Speech();
        speech.paragraph(data.prompt)
        speech.paragraph(list)
        speech.paragraph(data.reprompt)
        speech.paragraph(data.repromptMore)
        //add reprompt
        var repromptSpeech = new Speech();
        repromptSpeech.paragraph(data.reprompt);
        repromptSpeech.paragraph(data.repromptMore);
        // console.log('titles.length', titles.length);
        // console.log('data : ' + JSON.stringify(data));

        var speechOutput = speech.ssml();
        var repromptSpeechOutput = repromptSpeech.ssml();
        // var speechOutput = speech.toObject();
        console.log('********************************************');
        console.log(speechOutput);
        console.log('********************************************');
        // console.log(repromptSpeechOutput);
        console.log('********************************************');

        if (suportedIntefaces.hasOwnProperty("Alexa.Presentation.APL")) {

            let items = subSet.map((episode, i) => {
                let item = lodash.cloneDeep(episodesTemplate);
                item.listItemIdentifier = i;
                item.textContent.primaryText.text = lodash.truncate(episode.title, {length: 28, separator: ' '});
                item.ordinalNumber = episode.episode_num;
                item.token = episode.episode_num;
                item.image.sources[0].url = `https://s3.amazonaws.com/alexa-chase-voice/MichaelLierschRecordings/image/apl/Show_Main_Menu/Show_Episode_Icons/Michael-Liersch_Still_${i%5 + 1}.png`
                console.log(item.image.sources[0].url);
                return item;
            })

            episodesData.dataSources.ListTemplateMetadata.title = _.capitalize(data.subject);
            episodesData.dataSources.ListTemplateListData.listPage.listItems = items;

            return handlerInput.responseBuilder
                .speak(speechOutput)
                .addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    version: '1.0',
                    document: listTemplate.document,
                    datasources: episodesData.dataSources
                })
                .reprompt(repromptSpeechOutput)
                .withShouldEndSession(false)
                .getResponse();

        } else {
            return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(repromptSpeechOutput)
            .withShouldEndSession(false)
            .getResponse();

        }
    }
};

