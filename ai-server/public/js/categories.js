document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素
    const categoryGrid = document.getElementById('category-grid');
    const categoryLoader = document.getElementById('category-loader');
    const themeToggle = document.getElementById('theme-toggle-icon');
    
    // 主题切换
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
    
    // 为每个分类选择一个图标
    const categoryIcons = {
        '前端开发': 'ri-code-box-line',
        '后端开发': 'ri-server-line',
        '移动开发': 'ri-smartphone-line',
        '数据科学': 'ri-bar-chart-box-line',
        '开发工具': 'ri-tools-line',
        '默认': 'ri-book-3-line'
    };
    
    // 获取分类及其相关文章计数
    async function fetchCategoriesWithCount() {
        try {
            categoryLoader.style.display = 'block';
            
            // 获取所有分类
            const catResponse = await fetch('/api/categories');
            const catData = await catResponse.json();
            
            if (catData.status === 200 && catData.data.length > 0) {
                // 模拟获取每个分类的文章数量
                // 在实际应用中，这可能是一个单独的API调用
                const categories = catData.data.map(category => {
                    // 生成一个随机数作为文章计数（实际应用中应该从API获取）
                    const count = Math.floor(Math.random() * 20) + 1;
                    return {
                        name: category,
                        count,
                        icon: categoryIcons[category] || categoryIcons['默认']
                    };
                });
                
                renderCategories(categories);
            } else {
                categoryGrid.innerHTML = '<p>暂无分类</p>';
            }
            
            categoryLoader.style.display = 'none';
        } catch (error) {
            console.error('Error fetching categories:', error);
            categoryGrid.innerHTML = '<p>获取分类失败，请稍后再试</p>';
            categoryLoader.style.display = 'none';
        }
    }
    
    // 渲染分类卡片
    function renderCategories(categories) {
        categoryGrid.innerHTML = '';
        
        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.setAttribute('data-category', category.name);
            
            const categoryIcon = document.createElement('i');
            categoryIcon.className = `category-icon ${category.icon}`;
            
            const categoryName = document.createElement('div');
            categoryName.className = 'category-name';
            categoryName.textContent = category.name;
            
            const categoryCount = document.createElement('div');
            categoryCount.className = 'category-count';
            categoryCount.textContent = `${category.count} 篇文章`;
            
            categoryCard.appendChild(categoryIcon);
            categoryCard.appendChild(categoryName);
            categoryCard.appendChild(categoryCount);
            
            // 点击分类卡片时重定向到带有分类过滤的搜索页面
            categoryCard.addEventListener('click', () => {
                localStorage.setItem('selectedCategory', category.name);
                window.location.href = 'index.html';
            });
            
            categoryGrid.appendChild(categoryCard);
        });
    }
    
    // 页面加载时获取分类
    fetchCategoriesWithCount();
}); 