const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// used to sort through urls
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/myMsgs': jsonHandler.getMyMsgs,
    '/allMsgs': jsonHandler.getAllMsgs,
    '/client.js': htmlHandler.getJS,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/myMsgs': jsonHandler.getMyMsgsMeta,
    '/allMsgs': jsonHandler.getAllMsgsMeta,
    notFound: jsonHandler.notFoundMeta,
  },
};

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/newMsg') {
    const res = response;

    const body = [];
    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      // console.dir(bodyParams);
      jsonHandler.newMsg(request, res, bodyParams);
    });
  }
};

//handle GET requests
const handleGet = (request, response, parsedUrl) => {
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

// on request, parses through URL and either sends to post or get
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

// creates the server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
