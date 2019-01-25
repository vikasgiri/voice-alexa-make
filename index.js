const Alexa = require('ask-sdk');

//helper for marketinsights
const helper = require('./app/skill/marketinsights/handlers/app');
//helper for mynextmove
const myNextMoveMainHelper = require('./app/skill/mynextmove/handlers/app');
//helper for eyeonthemarket
const eyeOnTheMarketHelper = require('./app/skill/eyeonthemarket/handlers/app');
// var Sequelize = require('sequelize');
const express = require('express');
var bodyParser = require('body-parser');
var NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.VCAP_APP_PORT || 3000;

const app = express();
var router = express.Router();
// accept url encoded
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(router);



let helloSkill;
let myNextMove;
let eyeonthemarket;
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
      // console.log(error);
      res.status(500).send('Error during the request');
    });
});

router.post('/voice/alexa/mynextmove', function(req, res) {
  // console.log("in marketinsights");
  console.log("---------------mynextmove-------------------------");
  // console.log(JSON.stringify(req.body));
  // console.log("---------------guidetomarket-------------------------");
  if (!myNextMove) {

    //change the request and response loggers to common
    myNextMove = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        myNextMoveMainHelper.MoreIntentHandler,
        myNextMoveMainHelper.DescriptionIntentHandler,
        myNextMoveMainHelper.SubjectIntentHandler,
        myNextMoveMainHelper.SubjectOnlyIntentHandler,
        myNextMoveMainHelper.LibraryIntentHandler,
        myNextMoveMainHelper.EpisodeIntentHandler,
        myNextMoveMainHelper.EpisodeOnlyIntentHandler,
        myNextMoveMainHelper.LatestIntentHandler,
        myNextMoveMainHelper.AudioPlayerEventHandler,
        myNextMoveMainHelper.HelpIntentHandler,
        myNextMoveMainHelper.NoIntentHandler,
        myNextMoveMainHelper.StopIntentHandler,
        myNextMoveMainHelper.SessionEndedRequestHandler,
        myNextMoveMainHelper.WhoIsIntentHandler,
        myNextMoveMainHelper.UnhandledIntentHandler,
        myNextMoveMainHelper.LaunchRequestHandler,
        myNextMoveMainHelper.NewWelcomeIntentHandler,
        myNextMoveMainHelper.WelcomeIntentHandler,
        myNextMoveMainHelper.YesIntentHandler,
        myNextMoveMainHelper.SkillEventHandler,
        myNextMoveMainHelper.CancelIntentHandler,
        myNextMoveMainHelper.PlaybackHandler,
        myNextMoveMainHelper.PauseIntentHandler,
        myNextMoveMainHelper.ResumeIntentHandler
      ).addErrorHandlers(myNextMoveMainHelper.ErrorHandler)
      .addRequestInterceptors(myNextMoveMainHelper.RequestLog)
      .addResponseInterceptors(myNextMoveMainHelper.ResponseLog)
      .create();
  }
        // .withSkillId('amzn1.ask.skill.d928634f-f6c9-40c9-9b8c-2e14ccd8f5e2')
    myNextMove.invoke(req.body)
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

router.post('/voice/alexa/eyeonthemarket', function(req, res) {
  // console.log("in marketinsights");
  console.log("---------------eyeonthemarket-------------------------");
  // console.log(JSON.stringify(req.body));
  // console.log("---------------guidetomarket-------------------------");
  if (!eyeonthemarket) {

    //change the request and response loggers to common
    eyeonthemarket = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        eyeOnTheMarketHelper.AboutMichaelIntentHandler,
        eyeOnTheMarketHelper.NewContentIntentHandler,
        eyeOnTheMarketHelper.AudioPlayerEventHandler,
        eyeOnTheMarketHelper.LaunchRequestHandler,
        eyeOnTheMarketHelper.SessionEndedRequestHandler,
        eyeOnTheMarketHelper.SkillEventHandler,
        eyeOnTheMarketHelper.CancelIntentHandler,
        eyeOnTheMarketHelper.StopIntentHandler,
        eyeOnTheMarketHelper.HelpIntentHandler,
        eyeOnTheMarketHelper.PodcastIntentHandler,
        eyeOnTheMarketHelper.PauseIntentHandler,
        eyeOnTheMarketHelper.ResumeIntentHandler,
        eyeOnTheMarketHelper.UnhandledIntentHandler
      ).addErrorHandlers(eyeOnTheMarketHelper.ErrorHandler)
      .addRequestInterceptors(eyeOnTheMarketHelper.RequestLog)
      .addResponseInterceptors(eyeOnTheMarketHelper.ResponseLog)
      .create();
  }
        // .withSkillId('amzn1.ask.skill.d928634f-f6c9-40c9-9b8c-2e14ccd8f5e2')
    eyeonthemarket.invoke(req.body)
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