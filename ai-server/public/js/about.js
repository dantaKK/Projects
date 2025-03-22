document.addEventListener('DOMContentLoaded', () => {
    // 主题切换
    const themeToggle = document.getElementById('theme-toggle-icon');
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.classList.remove('ri-moon-line');
            themeToggle.classList.add('ri-sun-line');
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.classList.remove('ri-sun-line');
            themeToggle.classList.add('ri-moon-line');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // 检查本地存储，应用保存的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.classList.remove('ri-moon-line');
        themeToggle.classList.add('ri-sun-line');
    }
}); 