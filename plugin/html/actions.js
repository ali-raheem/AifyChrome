import { promptVersion } from './globals.js';

function getSelection() {
    return window.getSelection().toString();
  }  

const addAction = (name, prompt, actionsContainer) => {
    const actionDiv = document.createElement("div");
    const nameInput = document.createElement("p");
    nameInput.classList.add("flat");
    nameInput.innerText = name;
    nameInput.classList.add("action-name");

    const getHighlightedText = (callback) => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: getSelection
            }, (result) => {
                callback(result[0].result);
            });
        });
    }      
    
    nameInput.onclick = () => {
        getHighlightedText((highlightedText) => {
            if (highlightedText) {
                rewrite(highlightedText, prompt, name);
            }
        });
    };

    actionDiv.appendChild(nameInput);
    actionsContainer.appendChild(actionDiv);
};

const rewrite = async (original, action, draftTitle) => {
    console.log("click on action");
    await chrome.storage.local.set({ original, action, draftTitle });
    chrome.windows.create({ url: "/html/draft.html", type: "popup", width: 512, height: 600 });
};

document.addEventListener("DOMContentLoaded", () => {
    const actionsContainer = document.getElementById("actions-container");
    chrome.storage.local.get(["actions", "promptUpdated"], (data) => {
        const { actions, promptUpdated = 0 } = data;

        if (promptVersion > promptUpdated) {
            const warningIcon = document.createElement('img');
            warningIcon.src = "/images/warning.png";
            warningIcon.classList.add('small-icon');
            const settingsLink = document.getElementById('settings-link');
            settingsLink.appendChild(warningIcon);
        };
        const settingsLink = document.getElementById("settings-link");
        settingsLink.addEventListener("click", () => {chrome.tabs.create({url: "html/settings.html"})});
        actions.forEach((action) => {
            addAction(action.name, action.prompt, actionsContainer);
        });
    });

});
