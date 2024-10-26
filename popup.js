document.addEventListener('DOMContentLoaded', function() {
  // 获取存储的状态，设置默认值为 true
  chrome.storage.sync.get(
    {
      hideDifficulty: true,  // 设置默认值为 true
      hideAcceptance: false,
      initialized: false
    }, 
    function(result) {
      // 设置开关状态
      document.getElementById('difficultyToggle').checked = result.hideDifficulty;
      document.getElementById('acceptanceToggle').checked = result.hideAcceptance;
      
      // 如果是首次使用，显示刷新提示
      if (!result.initialized) {
        document.getElementById('refreshNotice').style.display = 'block';
        
        document.getElementById('refreshButton').addEventListener('click', () => {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
            chrome.storage.sync.set({ initialized: true });
            window.close();
          });
        });
      }
    }
  );

  document.getElementById('difficultyToggle').addEventListener('change', function(e) {
    const isHidden = e.target.checked;
    chrome.storage.sync.set({ hideDifficulty: isHidden });
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleDifficulty',
        isHidden: isHidden
      });
    });
  });

  document.getElementById('acceptanceToggle').addEventListener('change', function(e) {
    const isHidden = e.target.checked;
    chrome.storage.sync.set({ hideAcceptance: isHidden });
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleAcceptance',
        isHidden: isHidden
      });
    });
  });
});
