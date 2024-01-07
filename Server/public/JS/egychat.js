const socket = io();

const messagesContainer = document.getElementById("messages-container");
const nameInput = document.getElementById("name-input");
const messageFrom = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const typing = document.getElementById("typing");

messageFrom.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});
const today = new Date();
var time = today.getHours() + ":" + today.getMinutes();
function sendMessage() {
  if (messageInput.value == "") return;
  console.log(messageInput.value);
  const data = {
    name: nameInput.value,
    messages: messageInput.value,
    dateTime: time,
  };
  console.log(data);
  socket.emit("messages", data);
  console.log(data);
  messageInput.value = "";
  addMessages(true, data);
}

socket.on("chat-messages", (data) => {
  console.log(data);
  addMessages(false, data);
});

function addMessages(isOwnMessage, data) {
  const element = `
  <li class="${isOwnMessage ? "message-right" : "message-left"}">
            <p class="message">
            ${data.messages}
              <span>${data.name} || ${data.dateTime}</span>
            </p>
          </li>`;
  console.log(element);
  messagesContainer.innerHTML += element;
  scrolling();
}

function scrolling() {
  messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
}

messageInput.addEventListener("keydown", () => {
  socket.emit("start-typing");
});

messageInput.addEventListener("keyup", () => {
  socket.emit("stop-typing");
});

socket.on("start-typing", () => {
  typing.innerHTML = "typing...";
});

socket.on("stop-typing", () => {
  setTimeout(() => {
    typing.innerHTML = "";
  }, 2500);
});
