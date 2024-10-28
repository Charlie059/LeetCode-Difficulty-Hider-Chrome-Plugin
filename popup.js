document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(
    {
      hideDifficulty: true,  
      hideAcceptance: false,
      initialized: false
    }, 
    function(result) {
      document.getElementById('difficultyToggle').checked = result.hideDifficulty;
      document.getElementById('acceptanceToggle').checked = result.hideAcceptance;
      
      if (!result.initialized) {
        document.getElementById('refreshNotice').style.display = 'block';
        
        document.getElementById('refreshButton').addEventListener('click', () => {
          chrome.tabs.reload();
          chrome.storage.sync.set({ initialized: true });
          window.close();
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
