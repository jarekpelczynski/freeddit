browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);

    if (request.greeting === "hello")
        sendResponse({ farewell: "goodbye" });
});

const BETTER_HOST = 'https://libredd.it';

const updateTab = (details) => {
    const { tabId, url } = details;
    const newUrl = BETTER_HOST + url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1];
    
    // Replace a tab URL
    browser.tabs.update(tabId, { url: newUrl}, (tab) => {
        if (browser.runtime.lastError) {
            console.log('Error:', browser.runtime.lastError.message)
        }
    });
};

const lookingForReddit = (details) => {
    const { url, parentFrameId } = details;
    if (/^[^:/]+:\/\/[^/]*reddit\.[^/.]+\//.test(url) && parentFrameId === -1) {
        updateTab(details);
    }
};

browser.webNavigation.onBeforeNavigate.addListener(lookingForReddit);
