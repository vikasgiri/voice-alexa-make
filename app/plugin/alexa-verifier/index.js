var verifier = require('alexa-verifier')

// the alexa API calls specify an HTTPS certificate that must be validated.
// the validation uses the request's raw POST body which isn't available from
// the body parser module. so we look for any requests that include a
// signaturecertchainurl HTTP request header, parse out the entire body as a
// text string, and set a flag on the request object so other body parser
// middlewares don't try to parse the body again
module.exports = function alexaVerifierMiddleware(req, res, next) {
  console.log("In alexaVerifierMiddleware ");

  console.log("req.headers.signaturecertchainurl : " + req.headers.signaturecertchainurl);
  console.log("req.headers.signature : " + req.headers.signature);
  console.log("req.rawBody : " + req.rawBody);
  console.log("req._body : " + req._body);

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
    console.log('0000000000000000000000000');
    console.log("req.rawBody ::*******************:: " + req.rawBody);
    console.log("data ::*******************:: " + data);
    return req.rawBody += data
  })

  req.on('end', function() {
    var certUrl, er, error, signature

    console.log('1111111111111111111');
    try {
      console.log('222222222222222222222');
      req.body = JSON.parse(req.rawBody)
    } catch (error) {
      console.log('3333333333333333333333');
      er = error
      req.body = {}
    }

    console.log('4444444444444444444444444444');
    certUrl = req.headers.signaturecertchainurl
    signature = req.headers.signature

    verifier(certUrl, signature, req.rawBody, function(er) {
      console.log('5555555555555555555555555');

      console.log("req.rawBody ::::::: " + req.rawBody);
      if (er) {
        console.log('666666666666666666666666');
        res.status(400).json({ status: 'failure', reason: er })
      } else {

        console.log("VERIFICATION DONE IN ELSE PART");
        next()
      }
    })
  })
}
