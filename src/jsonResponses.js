

// array holding all user sent messages
const myMsgs = [];

// grabs the default messages
const allMsgs = require('./default.json');

//function to respond with a json object
//takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

//function to respond without json body
//takes request, response and status code
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// grabs user messages from array
const getMyMsgs = (request, response) => {
  const responseJSON = {
    myMsgs,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getMyMsgsMeta = (request, response) => respondJSONMeta(request, response, 200);

// grabs all messages
const getAllMsgs = (request, response) => {
  const responseJSON = {
    allMsgs,
  };
  respondJSON(request, response, 200, responseJSON);
};

const getAllMsgsMeta = (request, response) => respondJSONMeta(request, response, 200);

const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

//public exports
module.exports = {
  getUsers,
  addUser,
};
