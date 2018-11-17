// const VirtualAlexa = require("virtual-alexa").VirtualAlexa;

// const va = require("virtual-alexa");
// const { describe, it} = require('mocha');
const expect = require("chai").expect;
// const assert = require('chai').assert;
const va = require("virtual-alexa");
const alexa = va.VirtualAlexa.Builder()
    .skillURL('http://8ecf1656.ngrok.io/voice/alexa/marketinsights')// Lambda function file and name
    .interactionModelFile("./models/en-US.json") // Path to interaction model file
    .create();
    // .handler('index.handler') 

// let reply = alexa.launch();
//for launch
alexa.utter("disclosures").then((payload) => {
    // console.log('Output');
    console.log(JSON.stringify(payload.response));
    expect(payload.response.outputSpeech.ssml).to.include("Disclosure");
}).catch(err => {
    console.log(err);
});
// alexa.utter("play").then((payload) => {
//     console.log("OutputSpeech: " + payload.response.outputSpeech.ssml);
//     // Prints out returned SSML, e.g., "<speak> Welcome to my Skill </speak>"
// });


// describe("VirtualAlexa Tests Using URL", function() {
//     this.timeout(5000);
//     it("Calls a remote mock service via HTTPS", async () => {
//         const virtualAlexa = VirtualAlexa.Builder()
//             .interactionModelFile("./models/en-US.json")
//             .skillURL("https://ab5d63ce.ngrok.io/voice/alexa/marketinsights")
//             .create();
//         const response = await virtualAlexa.utter("disclosures");
//         assert.isDefined(response.data);
//         assert.equal(response.url, "https://ab5d63ce.ngrok.io/voice/alexa/marketinsights");
//     });

// });


// describe('LaunchRequestHandler', () => {
//     let alexa, result;
//     beforeEach('Initializes new launch request', function() {
//         alexa = va.VirtualAlexa.Builder()
//         .skillURL('https://8ecf1656.ngrok.io/voice/alexa/marketinsights')
//         .interactionModelFile('./models/en-US.json')
//         .create();

//         // .handler('index.handler')

//         result = alexa.launch();

//         console.log("-------------result----------------");
//         console.log(JSON.stringify(result));
//     })
//     it('Should respond with Welcome', async () => {
//         expect(result.response.outputSpeech.ssml).contain('Welcome');
//     })
//     it('Should not end session', async () => {
//         expect(result.response.shouldEndSession).to.be.false;
//     })

// });