let isHidden = true;

// 立即执行的初始化函数
function initialize() {
  chrome.storage.sync.get(
    {
      hideDifficulty: true,  // 默认开启
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

// 确保DOM加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize(); // 如果DOM已经加载完成，立即执行
}

// 设置MutationObserver来处理动态加载的内容
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
        toggleAcceptance(result.hideAcceptance);
      }
    }
  );
});

// 立即开始观察
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
    toggleAcceptance(request.isHidden);
  }
});

function toggleDifficulty(hide) {
  const difficulties = ["简单", "中等", "困难", "Easy", "Medium", "Hard"];
  const elements = Array.from(document.querySelectorAll("span, div"));
  
  elements.forEach((el) => {
    if (difficulties.some((difficulty) => el.innerText === difficulty)) {
      el.style.display = hide ? "none" : "";
    }
  });
}

function toggleAcceptance(hide) {
  // 选择包含通过率的元素
  const elements = Array.from(document.querySelectorAll("div[role='cell']"));
  elements.forEach((el) => {
    const text = el.textContent;
    // 检查文本是否为百分比格式
    if (text && /^\d+\.?\d*%$/.test(text.trim())) {
      el.style.display = hide ? "none" : "";
    }
  });
}
