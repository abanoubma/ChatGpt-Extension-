var apiKey="";
document.addEventListener('mouseup', function (event) {
  if (event.button == 2) { // Right click
    var selectedText = window.getSelection().toString().trim();
    localStorage.setItem("selectedText", selectedText)
    if (selectedText.length > 0) {
      chrome.runtime.sendMessage({ action: "selectedText", text: selectedText }, function (response) {

      });
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.action === 'searchQuery') {
    const searchQuery = request.data;
    localStorage.setItem("selectedText", searchQuery) 
    getGPTREsponse(searchQuery);

  }
});

chrome.storage.local.get('gptKey', function(result) {
   apiKey = result.gptKey 
});

function getGPTREsponse(searchQuery) {
  
  const chatbotUrl = "https://api.openai.com/v1/completions";

  fetch(chatbotUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: searchQuery,
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

      const chatGptResponse = document.getElementById('chatGptResponse');
      if(chatGptResponse != null){
        chatGptResponse.remove();
      }
        // Create the HTML to insert
        const html = `<div id="chatGptResponse" style="width: 83%;">
        <div style="display: flex; align-items: center; font-size: 2em; font-weight: bold;">
          <svg viewBox="0 0 200 200" style="width: 2em; height: 2em; margin-right: 0.5em;">
            <path fill="#4CAF50" d="M100,30l-70,70h40v60h60v-60h40l-70,-70z"/>
            <path fill="#FFF" d="M105,80l-15,15v30h-20v-30l-15,-15h-10l-15,15v30h-20v-30l-15,-15v-10l15,-15v-30h20v30l15,15h10l15,-15v-30h20v30l15,15v10z"/>
          </svg>
          <h2 style="margin: 0; color: #4CAF50;">ChatGPT</h2>
        </div>
        <div style="background-color: #f2f2f2; color: #000; padding: 10px; margin-bottom: 10px; border-radius: 10px; font-size: 14px; line-height: 1.5; display: block;overflow: scroll;">
          <pre id="chatResponseText"></pre>
        </div>
      </div>`;
      
        const element = document.getElementById('extabar');
        // Insert the HTML into the page
        element.insertAdjacentHTML('beforeend', html);

        const chatGptResponsetext = document.getElementById('chatResponseText');
        chatGptResponsetext.innerText  = responseText;
    })
    .catch(error => {
      // Handle any errors that occur during the request here
    });
}