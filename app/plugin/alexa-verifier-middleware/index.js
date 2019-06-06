var verifier = require('../alexa-verifier/index')

// the alexa API calls specify an HTTPS certificate that must be validated.
// the validation uses the request's raw POST body which isn't available from
// the body parser module. so we look for any requests that include a
// signaturecertchainurl HTTP request header, parse out the entire body as a
// text string, and set a flag on the request object so other body parser
// middlewares don't try to parse the body again
module.exports = function alexaVerifierMiddleware(req, res, next) {
  console.log("In alexaVerifierMiddleware ");

  console.log("Alexa-verifier-middleware : req.headers.signaturecertchainurl : " + req.headers.signaturecertchainurl);
  console.log("Alexa-verifier-middleware : req.headers.signature : " + req.headers.signature);
  console.log("Alexa-verifier-middleware : req.rawBody : " + req.rawBody);
  console.log("Alexa-verifier-middleware : req._body : " + req._body);

  // var cache = [];
  // var convertedJson = JSON.stringify(req, function(key, value) {
  //     if (typeof value === 'object' && value !== null) {
  //         if (cache.indexOf(value) !== -1) {
  //             // Duplicate reference found
  //             try {
  //                 // If this value does not reference a parent it can be deduped
  //                 return JSON.parse(JSON.stringify(value));
  //             } catch (error) {
  //                 // discard key if value cannot be deduped
  //                 return;
  //             }
  //         }
  //         // Store value in our collection
  //         cache.push(value);
  //     }
  //     return value;
  // });
  // cache = null;

  // console.log('----------------------------------------------------------------------------------------------');
  // console.log("Alexa-verifier-middleware : req : " + convertedJson);
  // console.log('----------------------------------------------------------------------------------------------');

  if (req._body) {
    var er = 'The raw request body has already been parsed.'
    return res.status(400).json({ status: 'failure', reason: er })
  }

  // TODO: if _rawBody is set and a string, don't obliterate it here!

  // mark the request body as already having been parsed so it's ignored by
  // other body parser middlewares
  req._body = true
  req.rawBody = ''
  req.on('data', function(data) {
    console.log('Alexa-verifier-middleware : req.on(data)');
    console.log("Alexa-verifier-middleware : req.rawBody" + req.rawBody);
    console.log("Alexa-verifier-middleware : data" + data);
    return req.rawBody += data
  })

  req.on('end', function() {
    var certUrl, er, error, signature

    console.log('Alexa-verifier-middleware : req.on(end)');
    try {
      console.log('Alexa-verifier-middleware : req.on(end) : try ');
      req.body = JSON.parse(req.rawBody)
    } catch (error) {
      console.log('Alexa-verifier-middleware : req.on(end) : catch ');
      er = error
      req.body = {}
    }

    certUrl = req.headers.signaturecertchainurl
    signature = req.headers.signature

    verifier(certUrl, signature, req.rawBody, function(er) {
      console.log('Alexa-verifier-middleware : verifier');

      console.log('Alexa-verifier-middleware : verifier : req.rawBody' + req.rawBody);
      if (er) {
        console.log('Alexa-verifier-middleware : verifier : if' );
        res.status(400).json({ status: 'failure', reason: er })
      } else {

        console.log('Alexa-verifier-middleware : verifier : else : next()' );
        next()
      }
    })
  })
}
