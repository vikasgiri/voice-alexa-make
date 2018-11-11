const Alexa = require('ask-sdk');
const helper = require('./app/helper');

// var Sequelize = require('sequelize');
const express = require('express');
var bodyParser = require('body-parser');
var NODE_ENV = process.env.NODE_ENV || 'development';
var models = require("./app/model");
var port = process.env.VCAP_APP_PORT || 3000;


//Sync Database
models
    .sequelize
    .sync()
    .then(function () {
        console.log('Nice! Database syncup looks fine');
    })
    .catch(function (err) {
        console.log("Something went wrong with the Database Update!");
        console.log(err);
    });

const app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(router);

let helloSkill;
router.post('/voice/alexa/marketinsights', function(req, res) {
  // console.log("in marketinsights");
  // console.log("---------------guidetomarket-------------------------");
  // console.log(JSON.stringify(req.body));
  // console.log("---------------guidetomarket-------------------------");
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
      // console.log("--------------------------------req.body start-------------------------------");
      // console.log(responseBody);
      // console.log("--------------------------------req.body stop-------------------------------");

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
  // console.log('************' + process.env.VCAP_APP_PORT + '******************');
  console.log("Server started.");
  console.log('*******************************');

});
// app.listen(process.env.PORT);