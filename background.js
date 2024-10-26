chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    chrome.tabs.query({
      url: [
        "*://*.leetcode.com/*",
        "*://*.leetcode.cn/*",
        "*://*.leetcode-cn.com/*"
      ]
    }, function(tabs) {
      tabs.forEach(tab => {
        chrome.tabs.reload(tab.id);
      });
    });
  }
});
