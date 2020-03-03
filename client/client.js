const newMsgButt = document.querySelector("#newMsgButton");
const popup = document.querySelector("#newMsgPopup");
const closeButt = document.querySelector("#close");
const sendMsgButt = document.querySelector("#sendMsgButton");
const newMsgForm = document.querySelector("#newMsgForm");
const myMsgsButt = document.querySelector('#myMsgs');
const allMsgsButt = document.querySelector('#allMsgs');
const sortButton = document.querySelector('#sortSelectButton');
let whatMessages = 1;
let gridCount = 1;
let allMsgsArray;

// initalizes page
const init = () =>
{
  // array holding all user sent messages
  let myMsgsArray =
  {
    "messages": [
      {
        "name": "It's you!",
        "date": "2/3/4",
        "time": "4:15",
        "message": "Hi you"
      }, {
        "name": "Not Brandon",
        "date": "02/02/2020",
        "time": "3:46PM",
        "message": "yeah"
      }, {
        "name": "Not Brandon",
        "date": "02/02/2020",
        "time": "3:46PM",
        "message": "yeah"
      }, {
        "name": "Not Brandon",
        "date": "02/02/2020",
        "time": "3:46PM",
        "message": "yeah"
      }, {
        "name": "Not Brandon",
        "date": "02/02/2020",
        "time": "3:46PM",
        "message": "yeah"
      }, {
        "name": "Not Brandon",
        "date": "02/02/2020",
        "time": "3:46PM",
        "message": "yeah"
      }, {
        "name": "Not Brandon",
        "date": "02/02/2020",
        "time": "3:46PM",
        "message": "yeah"
      }, {
        "name": "Not Brandon",
        "date": "02/02/2020",
        "time": "3:46PM",
        "message": "yeah"
      }
    ]
  };

  let theContent = document.querySelector("#content");

  //create handlers for sending messages and viewing message groups
  const newMsg = (e) => sendPost(e, newMsgForm);
  const myMsgs = (e) => showMsgs(myMsgsArray, theContent);
  const allMsgs = (e) => requestUpdate(e, '/allMsgs');

  //attach submit event
  newMsgForm.addEventListener('submit', newMsg);
  myMsgsButt.addEventListener('click', myMsgs);
  allMsgsButt.addEventListener('click', allMsgs);
};

newMsgButton.onclick = () => {
  popup.style.display = "block";
  // clear the content inside the modal
  newMsgForm.reset();
};

closeButt.onclick = () => {
  popup.style.display = "none";
};

window.onclick = e => {
  if (e.target == popup) {
    popup.style.display = "none";
  }
};

sendMsgButt.onclick = () => {
  popup.style.display = "none";
};

myMsgsButt.onclick = () => {
  whatMessages = 0;
};

allMsgsButt.onclick = () => {
  whatMessages = 1;
};

// display all messages from returned JSON
const showMsgs = (msgArray, content) =>
{
  //clear the Content
  content.innerHTML = "";
  let newHTML = "";

  //grid always starts with a row and a plus button to add new messages
  newHTML += `<div class='grid'><div class='row'><div class='box'><div class='inner' id='newMsgButton'>+</div></div>`;

  msgArray.messages.forEach(msg =>
  {
    newHTML += `<div class='box'><div class='inner'>`;

    //add date, body, and author
    newHTML += `<p>${msg.date}, ${msg.time}</p>`;
    newHTML += `<p>${msg.message}</p>`;
    newHTML += `<p>From: ${msg.name}</p>`;

    //close the message div
    newHTML += `</div></div>`;

    gridCount++;

    // if grid row is full, add another row
    if(gridCount > 5)
    {
     newHTML += `</div>`;
     newHTML += `<div class='row'>`;
     gridCount = 0;
    }
  });

  //if the grid was not full, close it anyways
  if(gridCount < 4)
  {
    newHTML += `</div>`;
  }
  else
  {
    //close the grid and content
    newHTML += `</div></div>`;
  }

  content.innerHTML = newHTML;

  document.querySelector("#newMsgButton").onclick = () => {
    popup.style.display = "block";
    // clear the content inside the modal
    newMsgForm.reset();
  };
};

//function to parse our response
const parseJSON = (xhr, content) =>
{
  if (xhr.response)
  {
    const obj = JSON.parse(xhr.response);
    console.dir(`obj: ${obj}`);
  };

  //if message in response, add to screen
  if(obj.message) {
    const p = document.createElement('p');
    p.textContent = `Message: ${xhr.response}`;
    content.appendChild(p);
  }
};

//function to handle our response
const handleResponse = (xhr) => {
  const content = document.querySelector('#content');

  //check the status code
  switch(xhr.status) {
    case 200: // success
      content.innerHTML = `<b>Success</b>`;
      break;
    case 201: // created
      content.innerHTML = '<b>Created</b>';
      break;
    case 204: // updated (no response back from server)
      content.innerHTML = '<b>Updated (No Content)</b>';
      break;
    case 400: // not all fields filled out
      alert("All fields are required");
      break;
    case 404: // updated (no response back from server)
      alert("Resource not found");
      break;
    case 500: // server crashes
      alert("Internal Server Error");
      break;
    default: // any other status code
      alert("Error: Code not implemented by client");
      break;
  }

  //parse response
  parseJSON(xhr, content);
};

//function to send our post request
const sendPost = (e, msgForm) =>
{
  // don't reload the page
  e.preventDefault();

  const msgAction = newMsgForm.getAttribute('action');
  const msgMethod = newMsgForm.getAttribute('method');

  // grabs the fields from the form
  const nameField = newMsgForm.querySelector('#nameField');
  const msgField = newMsgForm.querySelector('#msgField');

  // get date and time of message send
  const date = "";
  const time = "";

  const xhr = new XMLHttpRequest();
  xhr.open(msgMethod, msgAction);

  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader ('Accept', 'application/json');

  xhr.onload = () => handleResponse(xhr);

  // adds values put in by user to formData object
  const formData = `name=${nameField.value}&message=${msgField.value}&date=${date}&time=${time}`;

  // sends object
  xhr.send(formData);
  console.dir(`form data: ${formData}`);

  // alerts the user that the message was sent and added to the wall
  alert('Message sent!');

  // save it to local messages array
  myMsgs.messages.push({
    "name": nameField.name,
    "date": "10",
    "time": "3:11",
    "message": msgField.message,
  });

  // resets the fields
  nameField.value = "";
  msgField.value = "";

  // so we can continue
  return false;
};

// updates the page
const requestUpdate = (e, method) =>
{
  // hides the form, should already be hidden but just in case lol
  popup.style.display = "none";

  // creates new request
  const xhr = new XMLHttpRequest();
  xhr.open('get', method);

  xhr.setRequestHeader('Accept', 'application/json');
  if(method == 'get') {
    xhr.onload = () => handleResponse(xhr, true);
  } else {
    xhr.onload = () => handleResponse(xhr, false);
  }
  xhr.send();

  e.preventDefault();
  return false;
};

window.onload = init;
