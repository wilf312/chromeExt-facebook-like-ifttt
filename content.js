// メッセージを受け取る
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message);
});