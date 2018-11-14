const Alexa = require('ask-sdk');

//helper for marketinsights
const helper = require('./app/skill/marketinsights/helper');

// var Sequelize = require('sequelize');
const express = require('express');
var bodyParser = require('body-parser');
var NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.VCAP_APP_PORT || 3000;

const app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(router);

let helloSkill;
let myNextMove;
router.post('/voice/alexa/marketinsights', function(req, res) {
 
  if (!helloSkill) {

    helloSkill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        helper.LaunchRequestHandler,
        helper.YesIntentHandler,
        helper.PauseIntentHandler,
        helper.ResumeIntentHandler,
        helper.AudioPlayerEventHandler,
        helper.AboutDrKellyIntentHandler,
        helper.QuoteIntentHandler,
        helper.WhatIsThisIntentHandler,
        helper.DisclosuresIntentHandler,
        helper.KeepReadingIntentHandler,
        helper.PlayClipForIntentHandler,
        helper.CommentaryIntentHandler,
        helper.SessionEndedRequestHandler,
        helper.NotesOnTheWeekAheadIntentHandler,
        helper.NextMessageIntentHandler,
        helper.NextIntentHandler,
        helper.RepeatIntentHandler,
        helper.HelpIntentHandler,
        helper.NoIntentHandler,
        helper.StopIntentHandler,
        helper.CancelIntentHandler,
        helper.UnhandledIntentHandler
      ).addErrorHandlers(helper.ErrorHandler)
      .addRequestInterceptors(helper.RequestLog)
      .addResponseInterceptors(helper.ResponseLog)
      .create();
  }
        // .withSkillId('amzn1.ask.skill.d928634f-f6c9-40c9-9b8c-2e14ccd8f5e2')
  helloSkill.invoke(req.body)
    .then(function(responseBody) {
      res.json(responseBody);
    })
    .catch(function(error) {
      console.log(error);
      res.status(500).send('Error during the request');
    });
});

// Start server
app.listen(port, function () {
  console.log('************' + NODE_ENV + '******************');
  console.log("Server started.");
  console.log('*******************************');

});