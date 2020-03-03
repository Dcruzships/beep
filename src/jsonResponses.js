// grabs all messages from server
const allMsgs = require("./default.json");

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

// send a new message, add it to both arrays
const newMsg = (request, response, body) => {
  console.dir(body);
  const responseJSON = {
    message: 'All fields are required',
  };

  // all fields must be filled out for it to be added
  if (!body.name || !body.message) {
    // if it doesnt, respond to user that there are missing parameters
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // assumes we are doing a creation
  let responseCode = 201;

  // no duplicate messages!
  let index = -1;
  for (let i = 0; i < allMsgs.length; i++) {
    if (allMsgs[i].name === body.name && allMsgs[i].message === body.message) {
      responseCode = 204;
      index = i;
      break;
    }
  }

  // if it's updating, updates the data to the new data provided
  if (responseCode === 204) {
    allMsgs[index].name = body.name;
    allMsgs[index].message = body.message;

    return respondJSONMeta(request, response, responseCode);
  }

  // otherwise push new message to allMsgs
  console.dir('pushing new object');
  allMsgs.messages.push({
    name: body.name,
    date: "10",
    time: "3:11",
    message: body.message,
  });

  // responds to the page
  responseJSON.message = 'Message sent!';
  return respondJSON(request, response, responseCode, responseJSON);
};

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
  newMsg,
  getMyMsgs,
  getMyMsgsMeta,
  getAllMsgs,
  getAllMsgsMeta,
  notFound,
  notFoundMeta
};
