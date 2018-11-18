// const VirtualAlexa = require("virtual-alexa").VirtualAlexa;

// const va = require("virtual-alexa");
// const { describe, it} = require('mocha');
const expect = require("chai").expect;
const assert = require('chai').assert;
const va = require("virtual-alexa");
// const alexa = va.VirtualAlexa.Builder()
//     .skillURL('https://a0a6e05c.ngrok.io/voice/alexa/marketinsights')// Lambda function file and name
//     .interactionModelFile("./models/en-US.json") // Path to interaction model file
//     .create();
    // .handler('index.handler') 

// let reply = alexa.launch();
//for launch


// describe('DsclosuresIntent', function() {
//     it('Card Contents', function() {
//     //   var arr = [];

//         alexa.utter("disclosures").then((payload) => {
//         // console.log('Output');
//             // console.log(JSON.stringify(payload.response));
//             // expect(payload.response.outputSpeech.ssml).to.include("Disclosure");
//             assert.include(JSON.stringify(payload.response.card.text), 'sfassdfasafa', 'String contains content')
//         }).catch(err => {
//             console.log('ERROR in DsclosuresIntent test: ' + err );
//         });
//     //   assert.equal(arr.length, 0);
//     });
// });

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


describe('LaunchRequestHandler', () => {
    // var alexa, result;
    // it('DisclosuresIntent', async () => {

    //     return new Promise(function(resolve, reject) {

    //         alexa = va.VirtualAlexa.Builder()
    //         .skillURL('https://a0a6e05c.ngrok.io/voice/alexa/marketinsights')
    //         .interactionModelFile('./models/en-US.json')
    //         .create();

    //         // .handler('index.handler')

    //         // result = alexa.launch();

    //         alexa.utter("disclosures").then((payload) => {

    //             result = payload;
    //             console.log('result : ' + JSON.stringify(result));
    //             // console.log('Output');
    //                 // console.log(JSON.stringify(payload.response));
    //                 // expect(payload.response.outputSpeech.ssml).to.include("Disclosure");
                    
    //         }).catch(err => {
    //             console.log('ERROR in DsclosuresIntent test: ' + err );
    //             reject();
    //         });

    //         resolve();
    //     }).then(function() {
    //         console.log(JSON.stringify(result));
    //         assert.include(JSON.stringify(result.response.card.text), 'sfassdfasafa', 'String contains content')
    //     });
        
        // promiseObj.then(function() {
            
        //   })
        //   .catch(function(err) {
        //     // console.log('in promise catch');
        //     console.log(err);
        //     // helper.card(conv, welcome[USER_TYPE]);
        //   });
        // console.log("-------------result----------------");
        

        // result = "{\"version\":\"1.0\",\"response\":{\"outputSpeech\":{\"type\":\"SSML\",\"ssml\":\"<speak><audio src='https://am.jpmorgan.com/blob-gim/1383571200620/83456/Disclosure.mp3'/> <break time='500ms'/></speak>\"},\"card\":{\"type\":\"Standard\",\"title\":\"Disclosure\",\"text\":\"This content has been produced for informational purposes only, and as such, the views contained herein are not to be taken as an advice or a recommendation to buy or sell any investment or interest thereto. Reliance upon information in this material is at the sole discretion of the recipient.\nThe material was prepared without regard to specific objectives, financial situation, or needs of any particular receiver. Any research in this asset has been obtained, and may have been acted upon, by J.P. Morgan Asset Management for its own purpose. The results of such research are being made available as additional information, and do not necessarily reflect the views of J.P. Morgan Asset Management.\nAny forecasts, figures, opinions, statements of financial market trends or investments techniques and strategies expressed, are those of J.P. Morgan Asset Management, unless otherwise stated, as of the day of production. They are considered to be reliable sat that time, but no warranty as to the accuracy, and reliability or completeness, in respect to any error or omission is accepted. They may be subject to change without reference or notification to you.\nJ.P. Morgan Asset Management is the brand name of the asset management business of JP Morgan Chase and Company and its affiliates worldwide. JP Morgan Distribution Services, Inc.\nCopyright 2018. JPMorgan Chase & Co.\",\"image\":{\"smallImageUrl\":\"https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg\",\"largeImageUrl\":\"https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg\"}},\"shouldEndSession\":false},\"userAgent\":\"ask-node/2.1.0 Node/v8.11.3\",\"sessionAttributes\":{}}"

        // result = JSON.parse(result);


        // expect(result.response.outputSpeech.ssml).contain('Welcome');
        // console.log('---------------it------------------');
        // assert.include(JSON.stringify(result.response.card.text), 'sfassdfasafa', 'String contains content')
    // })
    // it('Should not end session', async () => {
    //     expect(result.response.shouldEndSession).to.be.false;
    // })

    it("disclosures", async function () {
        const alexa = va.VirtualAlexa.Builder()
        .skillURL('https://a0a6e05c.ngrok.io/voice/alexa/marketinsights')
        .interactionModelFile('./models/en-US.json')
        .create();
    
        // const launchResponse = await alexa.launch();
        // assert.include(launchResponse.response.outputSpeech.ssml, "Welcome to guess the price");
    
        // https://github.com/bespoken/virtual-alexa
        
        const playerOneResponse = await alexa.utter("disclosures");
        assert.include(playerOneResponse.response.card.text, "informational ");
        // assert.include(playerOneResponse.response.outputSpeech.ssml, "contestant one");
    
        // const playerTwoResponse = await alexa.utter("john");
        // assert.include(playerTwoResponse.response.outputSpeech.ssml, "what is your name");
        // assert.include(playerTwoResponse.response.outputSpeech.ssml, "Contestant 2");
    
        // const gameStartResponse =  await alexa.utter("juan");
        // assert.include(gameStartResponse.response.outputSpeech.ssml, "let's start the game");
        // assert.include(gameStartResponse.response.outputSpeech.ssml, "Guess the price");
    
        // const priceGuessResponse = await alexa.utter("200");
        // assert.include(priceGuessResponse.response.outputSpeech.ssml, "the actual price was");
    });
});