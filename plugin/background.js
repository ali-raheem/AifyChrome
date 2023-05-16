chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    chrome.tabs.create({url: "html/settings.html"});
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getSelection
  },
  (result) => {
    console.log(result[0].result);
  });
});

function getSelection() {
  return window.getSelection().toString();
}
