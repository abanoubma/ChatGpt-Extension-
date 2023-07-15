
var apiKey="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";
const chatbotUrl = "https://api.openai.com/v1/completions";

const chatHistory = document.querySelector('.chat-history');
const chatHistoryBlock = document.querySelector('.history-block');


const taskList = document.getElementById("task-list");
const listItems = taskList.getElementsByTagName("li");
const keyBtn = document.querySelector('.key-btn');

var queryAction;
var queryText;

function sendMessage(message, googleMessage) {
  // apiKey = localStorage.getItem("gptKey"); //"";

  const targetElement = document.getElementById('taget-element');

  // Create a new spinner element
  const spinner = document.createElement('div');
  spinner.className = 'spinner';

  // Append the spinner element to the target element
  targetElement.appendChild(spinner);



  localStorage.setItem("selectedText", message);

  fetch(chatbotUrl, {
    method: "POST",
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'authorization': 'Bearer ' + apiKey
      },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt:queryAction+ "  " + message,
      temperature: 0.5,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\\n"],
    })
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the ChatGPT API here
    const responseText = data.choices[0].text.trim();
      
    const chatBubble = document.createElement('div');
    chatBubble.classList.add('chat-bubble');
    chatBubble.classList.add('chat-history-label');

    if (queryAction != undefined) {

      const chatBubbleAction = document.createElement('span');
      chatBubbleAction.classList.add('badge');
      chatBubbleAction.textContent = queryAction + ":";
      chatBubble.appendChild(chatBubbleAction)

    }

    chatBubble.innerHTML += message;

    const responseBubble = document.createElement('div');
    responseBubble.classList.add('chat-bubble');
    responseBubble.classList.add('response');

    const responseBubbleFormat = document.createElement('pre');  
    responseBubbleFormat.textContent=  responseText;
    responseBubble.appendChild(responseBubbleFormat)

    // // Check if the response contains code
    // if (/^\s*function\s*\w*\s*\(/.test(responseText)) { 

    //   responseBubble.textContent =  '<button class="copy-button" data-clipboard-target="#response">Copy</button>   <script>  new ClipboardJS(\'.copy-button\'); </script>' + '<pre>' + responseText + '</pre>';
    //   // Apply syntax highlighting to the response div
    
    //   hljs.highlightBlock(responseDiv);
    // }
    // else{
    //   responseBubble.textContent =responseText;
    // }

    var chatHistoryBlock = document.querySelector('.history-block');
    chatHistoryBlock.classList.remove('hideHistory')

    chatHistory.appendChild(chatBubble);
    chatHistory.appendChild(responseBubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    targetElement.removeChild(spinner);

    })
    .catch(error => {
      // Handle any errors that occur during the request here
      targetElement.removeChild(spinner);
    });
}


document.addEventListener('DOMContentLoaded', () => {

  const chatInput = document.querySelector('.chat-input');
  const sendBtn = document.querySelector('.chat-btn');
  const clearChatBtn = document.querySelector('.clear-chat-btn');

  sendBtn.addEventListener('click', () => {
    const inputText = chatInput.value;
    if (inputText.trim() === '') return;
    sendMessage(inputText, false);
  });

  keyBtn.addEventListener('click', () => {
    const inputBox = document.getElementById('input-key').value;
    localStorage.setItem("gptKey", inputBox)  
    chrome.storage.local.set({gptKey: inputBox}, function() {
      console.log('gptkek Value is set');
    });  

  });

  clearChatBtn.addEventListener('click', () => {
    chatHistory.innerHTML = '';
    chatHistoryBlock.classList.add('hideHistory')
  });
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("popup");
  var text = request.text;

  if (request.action === "selectedText") {
    localStorage.setItem("selectedText", text)  
    const inputBox = document.getElementById('input-box');
    // Update the value of the input box with the selected text
    inputBox.value = "";
    inputBox.value = text;
  }

  if (request.action === "googleQueryFired") {
    sendMessage(text, true)
  }
});



window.onload = function () {

console.log(localStorage.getItem("selectedText"))
  for (let i = 0; i < listItems.length; i++) {
    listItems[i].addEventListener("click", function () {

      // add the 'selected' class to the clicked item
      if (this.classList.contains("selected")) {
        this.classList.remove("selected");
        queryAction = '';
        return;
      }

      // remove the 'selected' class from all items
      for (let j = 0; j < listItems.length; j++) {
        listItems[j].classList.remove("selected");
      }


      this.classList.add("selected");
      queryAction = this.innerText;

      // do something with the selected task
      console.log("Selected task:", queryAction);
    });
  }

  console.log("onload" + Date())
  var selectedText = localStorage.getItem("selectedText")
  const inputBox = document.getElementById('input-box');
  // Update the value of the input box with the selected text
  inputBox.value = "";
  inputBox.value = selectedText;
}
