let isHidden = true;

function initialize() {
  chrome.storage.sync.get(
    {
      hideDifficulty: true, 
      hideAcceptance: false
    }, 
    function(result) {
      if (result.hideDifficulty) {
        toggleDifficulty(true);
      }
      if (result.hideAcceptance) {
        toggleAcceptance(result.hideAcceptance);
      }
    }
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize(); 
}

const observer = new MutationObserver((mutations) => {
  chrome.storage.sync.get(
    {
      hideDifficulty: true,
      hideAcceptance: false
    }, 
    function(result) {
      if (result.hideDifficulty) {
        toggleDifficulty(true);
      }
      if (result.hideAcceptance) {
        toggleAcceptanceOnProblemPage(result.hideAcceptance);
        toggleAcceptance(result.hideAcceptance);
      }
    }
  );
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleDifficulty') {
    isHidden = request.isHidden;
    toggleDifficulty(isHidden);
    chrome.storage.sync.set({ hideDifficulty: isHidden });
  } else if (request.action === 'toggleAcceptance') {
    toggleAcceptanceOnProblemPage(request.isHidden);
    toggleAcceptance(request.isHidden);
  }
});

function toggleDifficulty(hide) {
  const difficulties = ["简单", "中等", "困难", "Easy", "Medium", "Med.", "Hard"];
  const elements = Array.from(document.querySelectorAll("span, div, p"));
  
  elements.forEach((el) => {
    if (difficulties.some((difficulty) => el.innerText === difficulty)) {
      el.style.display = hide ? "none" : "";
    }
  });
}

function toggleAcceptance(hide) {
  const elements = Array.from(document.querySelectorAll("div[role='cell']"));
  elements.forEach((el) => {
    const text = el.textContent;
    if (text && /^\d+\.?\d*%$/.test(text.trim())) {
      el.style.display = hide ? "none" : "";
    }
  });
}

function toggleAcceptanceOnProblemPage(hide) {
  if (!window.location.pathname.startsWith('/problems/')) {
    return
  }
  const elements = Array.from(document.querySelectorAll("div"));
  const acceptanceRateDiv = elements.find(element => element.innerText.toLowerCase() == "acceptance rate")

  if (!acceptanceRateDiv) {
    console.error('Acceptance rate div not found')
    return
  }
  
  const containerDiv = acceptanceRateDiv.parentElement?.parentElement;
  if (!containerDiv) {
    console.error('Acceptance rate div not found')
    return 
  }

  containerDiv.style.display = hide ? "none" : ""
}