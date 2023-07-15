

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "myContextMenuId",
        title: "Send selected text to ChatGPT",
        contexts: ["selection"]
    });
});



chrome.contextMenus.onClicked.addListener(function (info, tab,sendResponse) {
    console.log("popup")
    if (info.menuItemId === "myContextMenuId") {
        var selectedText = info.selectionText;
        localStorage.setItem("selectedText", selectedText)   
        // Do something with the selected text (e.g. send it to ChatGPT)
        chrome.windows.create({
            url: 'popup.html',
            type: 'popup',
            width: 700,
            height: 700
          });

            chrome.runtime.sendMessage({action: "selectedText", text: selectedText }, function(response) {
             
            });
    }
  });




  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    // Check if the updated URL is a Google search
    if (tab.url.includes('google.com/search')) {
      // Extract the search query from the URL
      const urlParams = new URLSearchParams(tab.url.split('?')[1]);
      const searchQuery = urlParams.get('q');

      chrome.tabs.sendMessage(tabId, {action: 'searchQuery', data: searchQuery});

    }
  });
   
