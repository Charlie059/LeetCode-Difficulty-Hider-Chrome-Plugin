function hideDifficulty() {
    const difficulties = ['简单', '中等', '困难'];

    const elements = Array.from(document.querySelectorAll('span, div'));

    elements.forEach(el => {
        if (difficulties.some(difficulty => el.innerText === difficulty)) {
            el.style.display = 'none';
        }
    });
}

hideDifficulty();

const observer = new MutationObserver(hideDifficulty);
observer.observe(document.body, {
    childList: true,
    subtree: true
});
