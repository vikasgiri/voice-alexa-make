const Alexa = require('ask-sdk');
const helper = require('./app/helper');

const express = require('express');
var bodyParser = require('body-parser');
const app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(router);

console.log('testing');

let helloSkill;
router.post('/voice/alexa/marketinsights', function(req, res) {
  console.log("in marketinsights");
  // console.log("---------------guidetomarket-------------------------");
  // console.log(req);
  // console.log("---------------guidetomarket-------------------------");
  if (!helloSkill) {

    helloSkill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        helper.LaunchRequestHandler,
        helper.AboutDrKellyIntentHandler,
        helper.QuoteIntentHandler,
        helper.WhatIsThisIntentHandler,
        helper.DisclosuresIntentHandler,
        helper.NoIntentHandler,
        helper.KeepReadingIntentHandler,
        helper.StopIntentHandler,
        helper.CancelIntentHandler,
        helper.PlayClipForIntentHandler,
        helper.CommentaryIntentHandler,
        helper.SessionEndedRequestHandler,
        helper.NotesOnTheWeekAheadIntentHandler,
        helper.YesIntentHandler,
        helper.NextMessageIntentHandler
      ).addErrorHandlers(helper.ErrorHandler)
      .create();
  }

        // .withSkillId('amzn1.ask.skill.d928634f-f6c9-40c9-9b8c-2e14ccd8f5e2')

  helloSkill.invoke(req.body)
    .then(function(responseBody) {
      console.log(responseBody);

      res.json(responseBody);
    })
    .catch(function(error) {
      console.log(error);
      res.status(500).send('Error during the request');
    });
});

app.listen(8080, function () {
  console.log('Development endpoint listening on port 8080!');
});

// app.listen(process.env.PORT);