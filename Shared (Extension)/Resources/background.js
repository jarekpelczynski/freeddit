browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);

    if (request.greeting === "hello")
        sendResponse({ farewell: "goodbye" });
});

const BETTER_HOST = 'https://libredd.it';

const updateTab = (details) => {
    const { tabId, url } = details;
    const newUrl = BETTER_HOST + url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1];
    browser.tabs.update(tabId, { url: newUrl}, (tab) => {
        if (browser.runtime.lastError){
            if (browser.runtime.lastError.message.indexOf('No tab with id:') > -1){
                //Chrome is probably loading a page in a tab which it is expecting to
                //  swap out with a current tab.  Need to decide how to handle this
                //  case.
                //For now just output the error message
                console.log('Error:', browser.runtime.lastError.message)
            } else {
                console.log('Error:', browser.runtime.lastError.message)
            }
        }
    });
};

browser.webNavigation.onBeforeNavigate.addListener((details) => {
    console.log(details);
    const { url, parentFrameId } = details;
    if (/^[^:/]+:\/\/[^/]*reddit\.[^/.]+\//.test(url) && parentFrameId === -1) {
        
        console.log('reddit!');
        updateTab(details);
    } else {
        console.log('not reddit');
    }
});
