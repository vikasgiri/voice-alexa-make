
const commentary =  require("./responses/commentary");
const commentaryMap = require("./responses/commentaryMap");
const commentaryDocument = require('./apl/commentary_document.json');
const commentaryData = require('./apl/commentary_data.json');

const lodash = require('lodash');
var Speech = require('ssml-builder');

module.exports = {
    createCommentaryOnId(handlerInput, commentaryId) {

        const suportedIntefaces = handlerInput.requestEnvelope.context.System.device.supportedInterfaces;
        console.log('--------------------------handler-out----------------------------------');
        console.log(JSON.stringify(suportedIntefaces));
        console.log('--------------------------handler-out----------------------------------');
        
        console.log("commentary number from  createCommentaryOnId : " + parseInt(commentaryId, 10));
        var selectedNumber = parseInt(commentaryId, 10);
        const selectedCommentary = commentaryMap.commentariesById[selectedNumber];

        //create the object to be stored in session
        var commentaryObj = {
            "commentaryError": 0,
            "commentary": selectedNumber,
            "commentaryNumber": selectedNumber
        }

        //store the object in session
        // conv.data.commentaryObj = commentaryObj;

        const attributes = handlerInput.attributesManager.getSessionAttributes();
        console.log('-----------------------');
        console.log(attributes);
        console.log('-----------------------');

        attributes.commentaryObj = commentaryObj;
        handlerInput.attributesManager.setSessionAttributes(attributes);

        console.log('selected one object : ' + JSON.stringify(selectedCommentary));

        var speech = new Speech();
        speech.audio(selectedCommentary.audio)
        speech.audio(lodash.sample(commentary.next.prompt));
        var speechOutput = speech.ssml(true);
       
        if (suportedIntefaces.hasOwnProperty("Alexa.Presentation.APL")) {
            return handlerInput.responseBuilder
                .speak(speechOutput)
                .addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    version: '1.0',
                    document: commentaryDocument,
                    datasources: formatDatasources(selectedCommentary)
                })
                .withShouldEndSession(false)
                .getResponse();
        } else {
            return handlerInput.responseBuilder
              .speak(speechOutput)
              .withShouldEndSession(false)
              .getResponse();

        }

        
    }
};

function formatDatasources(selectedCommentary) {
	const {
		pageNum, title, imageSquare, imageWide, primaryText
	} = selectedCommentary;
	const {bodyTemplate2Data} = lodash.cloneDeep(commentaryData);

	bodyTemplate2Data.title = `Page ${pageNum}`;
	bodyTemplate2Data.image.sources.map((img, idx) => {
		img.url = idx === 0 ? imageSquare : imageWide;
		return img;
	});
	bodyTemplate2Data.textContent.title.text = title;
	bodyTemplate2Data.textContent.primaryText.text = primaryText;

	return {bodyTemplate2Data};
}