import { categories, articles } from './data.js';

// DOM Elements
const categoryNav = document.getElementById('category-nav');
const articlesGrid = document.getElementById('articles-grid');
const canvas = document.getElementById('canvas-bg');

// State
let currentCategory = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderArticles('all');
    initCanvasAnimation();
});

// Render Categories
function renderCategories() {
    const allBtn = document.createElement('button');
    allBtn.className = 'category-btn active';
    allBtn.textContent = 'All';
    allBtn.dataset.id = 'all';
    allBtn.addEventListener('click', () => filterArticles('all'));
    categoryNav.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = cat.label;
        btn.dataset.id = cat.id;
        btn.addEventListener('click', () => filterArticles(cat.id));
        categoryNav.appendChild(btn);
    });
}

// Filter Logic
function filterArticles(categoryId) {
    // Update Active State
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.id === categoryId);
    });

    currentCategory = categoryId;

    // Re-render with animation
    // Simple exit animation could be added here, but for now we just clear and re-render
    articlesGrid.innerHTML = '';
    renderArticles(categoryId);
}

// Render Articles
function renderArticles(filterId) {
    const filtered = filterId === 'all'
        ? articles
        : articles.filter(a => a.category === filterId);

    filtered.forEach((article, index) => {
        const card = createArticleCard(article, index);
        articlesGrid.appendChild(card);
    });
}

function createArticleCard(article, index) {
    const catData = categories.find(c => c.id === article.category);
    const card = document.createElement('div');
    card.className = 'article-card';
    // Stagger animation
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
    <div class="article-image">
      <img src="${article.image}" alt="${article.title}" loading="lazy">
      <span class="article-category" style="--color-primary: ${catData ? catData.color : '#fff'}">
        ${catData ? catData.label : 'Note'}
      </span>
    </div>
    <div class="article-content">
      <h3 class="article-title">${article.title}</h3>
      <p class="article-excerpt">${article.excerpt}</p>
      <a href="${article.url}" target="_blank" class="article-link" rel="noopener noreferrer">
        Read Article
      </a>
    </div>
  `;

    return card;
}

// Simple Particle Animation for Background (Canvas)
function initCanvasAnimation() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.2)' : 'rgba(112, 0, 255, 0.2)';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}
