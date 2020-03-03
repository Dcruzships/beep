const popup = document.querySelector("#newMsgPopup");
const newMsgButt = document.querySelector("#newMsgButton");
const closeButt = document.querySelector("#close");
const sendMsgButt = document.querySelector("#sendMsgButton");
const newMsgForm = document.querySelector("#newMsgForm");
const myMsgsButt = document.querySelector('#myMsgs');
const allMsgsButt = document.querySelector('#allMsgs');
const sortButton = document.querySelector('#sortSelectButton');
let whatMessages;
let gridCount = 1;

// initalizes page
const init = () =>
{
  // sets up sorting button to call corresponding function
  // not working for now :/
  // sortButton.addEventListener('click', sortResponses);

  //create handlers for sending messages and viewing message groups
  const newMsg = (e) => sendPost(e, newMsgForm);
  const myMsgs = (e) => requestUpdate(e, '/myMessages');
  const allMsgs = (e) => requestUpdate(e, '/allMessages');

  //attach submit event
  newMsgForm.addEventListener('submit', newMsg);
  myMsgsButt.addEventListener('click', myMsgs);
  allMsgsButt.addEventListener('click', allMsgs);
};

newMsgButt.onclick = () => {
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

// display all messages from returned JSON
const showMsgs = (msgArray, content) =>
{
  //clear the Content
  content.innerHTML = "";

  //grid always starts with a row and a plus button to add new messages
  content.innerHTML += `<div class='grid'><div class='row'><div class='box'><div class='inner' id='newMsgButton'>+</div></div>`;

  msgArray.forEach(msg =>
  {
    content.innerHTML += `<div class='box'><div class='inner'>`;

    //add date, body, and author
    content.innerHTML += `<h2>${msg.date}, ${msg.time}</h2>`;
    content.innerHTML += `<p>${msg.message}</p>`;
    content.innerHTML += `<h2>From: ${msg.name}`;

    //close the message div
    content.innerHTML += `</div></div>`;

    gridCount++;

    // if grid row is full, add another row
    if(gridCount > 4)
    {
     content.innerHTML += `</div>`;
     content.innerHTML += `<div class='row'>`;
    }
  });

  //if the grid was not full, close it anyways
  if(gridCount < 5)
  {
    content.innerHTML += `</div>`;
  }

  //close the grid and content
  content.innerHTML += `</div></div>`;
};

//function to parse our response
const parseJSON = (xhr, content) =>
{
  if (xhr.response)
  {
    const obj = JSON.parse(xhr.response);
    console.dir(`obj: ${obj}`);

    //if message in response, add to screen
    if (obj.message) {
      const p = document.createElement('p');
      p.textContent = `Message: ${xhr.response}`;
      content.appendChild(p);
    }

    //if it is myMsgs, add to screen
    if (obj.myMsgs)
    {

      whatMessages = obj.myMsgs;

      if (obj.myMsgs.length == 0) {
        alert('No messages to display!');
      } else {
        showMsgs(obj.myMsgs, content);
      };
    }

    // if it is allMsgs, add to screen
    if (obj.allMsgs)
    {
      whatMessages = obj.allMsgs;
      showMsgs(obj.allMsgs, content);
    };
  };
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
      content.innerHTML = '<b>Create</b>';
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
  const formData = `name=${nameField.value}&msg=${msgField.value}&date=${date}&time=${time}`;

  // sends object
  xhr.send(formData);
  console.dir(`form data: ${formData}`);

  // don't reload the page
  e.preventDefault();

  // resets the fields
  nameField.value = "";
  msgField.value = "";

  // alerts the user that the message was sent and added to the wall
  alert('Message sent!');

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
