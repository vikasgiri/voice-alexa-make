
//launchrequest
const LaunchRequestHandler = {
    canHandle(handlerInput) {
      console.log('LaunchRequest');
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
      .speak('this is a test sample app.')
      .withShouldEndSession(false)
      .getResponse();
  }
};

// HelloWorldIntent

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
   console.log('In help intent');
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
   
  handle(handlerInput) {
      // var speech = new Speech();
      // speech.paragraph(exceptions.help.prompt);

      // var speechOutput = speech.ssml(true);
    
      return handlerInput.responseBuilder
        .speak('this is hello my world re baba')
        .withShouldEndSession(false)
        .getResponse();
  }
};

module.exports = {
    LaunchRequestHandler,
    HelloWorldIntentHandler
}