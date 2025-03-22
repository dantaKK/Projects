document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const filterContainer = document.getElementById('filter-container');
    const loader = document.getElementById('loader');
    const noResults = document.getElementById('no-results');
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
    
    // 获取分类列表
    async function fetchCategories() {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            
            if (data.status === 200 && data.data.length > 0) {
                renderCategoryFilters(data.data);
                
                // 检查是否从分类页面跳转过来
                const selectedCategory = localStorage.getItem('selectedCategory');
                if (selectedCategory) {
                    // 自动选择对应的分类过滤器
                    setTimeout(() => {
                        const filterTags = document.querySelectorAll('.filter-tag');
                        filterTags.forEach(tag => {
                            if (tag.getAttribute('data-category') === selectedCategory) {
                                tag.click();
                                // 自动执行一次搜索，查找该分类下的内容
                                searchInput.value = selectedCategory;
                                performSearch(selectedCategory);
                            }
                        });
                        // 清除已使用的选中分类
                        localStorage.removeItem('selectedCategory');
                    }, 500);
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
    
    // 渲染分类过滤器
    function renderCategoryFilters(categories) {
        filterContainer.innerHTML = '';
        
        // 创建"全部"过滤器
        const allFilter = document.createElement('span');
        allFilter.className = 'filter-tag active';
        allFilter.setAttribute('data-category', 'all');
        allFilter.textContent = '全部';
        filterContainer.appendChild(allFilter);
        
        // 为每个分类创建过滤器
        categories.forEach(category => {
            const filterTag = document.createElement('span');
            filterTag.className = 'filter-tag';
            filterTag.setAttribute('data-category', category);
            filterTag.textContent = category;
            filterContainer.appendChild(filterTag);
        });
        
        // 添加点击事件
        const filterTags = document.querySelectorAll('.filter-tag');
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                filterTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                
                const selectedCategory = tag.getAttribute('data-category');
                filterResults(selectedCategory);
            });
        });
    }
    
    // 过滤搜索结果
    function filterResults(category) {
        const resultCards = document.querySelectorAll('.result-card');
        
        if (category === 'all') {
            resultCards.forEach(card => {
                card.style.display = 'block';
            });
            return;
        }
        
        resultCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // 检查过滤后是否有可见结果
        const visibleCards = Array.from(resultCards).filter(card => card.style.display !== 'none');
        if (visibleCards.length === 0) {
            noResults.style.display = 'flex';
        } else {
            noResults.style.display = 'none';
        }
    }
    
    // 执行搜索
    async function performSearch(keyword) {
        // 显示加载动画
        loader.style.display = 'flex';
        searchResults.style.display = 'none';
        noResults.style.display = 'none';
        
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ keyword })
            });
            
            const data = await response.json();
            
            // 隐藏加载动画
            loader.style.display = 'none';
            
            if (data.status === 200 && data.data.length > 0) {
                renderSearchResults(data.data);
                searchResults.style.display = 'flex';
                
                // 重置过滤器
                const filterTags = document.querySelectorAll('.filter-tag');
                filterTags.forEach(tag => {
                    if (tag.getAttribute('data-category') === 'all') {
                        tag.classList.add('active');
                    } else {
                        tag.classList.remove('active');
                    }
                });
            } else {
                noResults.style.display = 'flex';
            }
        } catch (error) {
            console.error('Search error:', error);
            loader.style.display = 'none';
            noResults.style.display = 'flex';
        }
    }
    
    // 渲染搜索结果
    function renderSearchResults(results) {
        searchResults.innerHTML = '';
        
        results.forEach(result => {
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';
            resultCard.setAttribute('data-category', result.category);
            
            const resultTitle = document.createElement('div');
            resultTitle.className = 'result-title';
            resultTitle.textContent = result.title;
            
            const resultCategory = document.createElement('span');
            resultCategory.className = 'result-category';
            resultCategory.textContent = result.category;
            
            const resultSimilarity = document.createElement('div');
            resultSimilarity.className = 'result-similarity';
            resultSimilarity.textContent = `相关度: ${Math.round(result.similarity * 100)}%`;
            
            resultCard.appendChild(resultTitle);
            resultCard.appendChild(resultCategory);
            resultCard.appendChild(resultSimilarity);
            
            searchResults.appendChild(resultCard);
        });
    }
    
    // 搜索按钮点击
    searchButton.addEventListener('click', () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            performSearch(keyword);
        }
    });
    
    // 回车搜索
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const keyword = searchInput.value.trim();
            if (keyword) {
                performSearch(keyword);
            }
        }
    });
    
    // 页面加载时获取分类
    fetchCategories();
}); 