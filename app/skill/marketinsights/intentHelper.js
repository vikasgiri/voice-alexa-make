
const commentary =  require("./responses/commentary");
const commentaryMap = require("./responses/commentaryMap");

const lodash = require('lodash');
var Speech = require('ssml-builder');

module.exports = {
    createCommentaryOnId(handlerInput, commentaryId) {

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
        attributes.state = 'commentary'
        attributes.commentaryObj = commentaryObj;
        handlerInput.attributesManager.setSessionAttributes(attributes);

        console.log('selected one object : ' + JSON.stringify(selectedCommentary));

        var speech = new Speech();
        speech.audio(selectedCommentary.audio)
        speech.audio(lodash.sample(commentary.next.prompt));
        var speechOutput = speech.ssml(true);
       
        return handlerInput.responseBuilder
          .speak(speechOutput)
          .withShouldEndSession(false)
          .getResponse();

    }
};

