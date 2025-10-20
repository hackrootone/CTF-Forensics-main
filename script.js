document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const searchInput = document.getElementById('searchInput');
    const notification = document.getElementById('notification');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm === '') {
            document.querySelectorAll('.tool-card, .step-card').forEach(card => {
                card.style.display = '';
            });
            return;
        }
        
        document.querySelectorAll('.tool-card').forEach(card => {
            const toolName = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
            const toolDesc = card.querySelector('.tool-desc') ? card.querySelector('.tool-desc').textContent.toLowerCase() : '';
            const commands = Array.from(card.querySelectorAll('code'))
                .map(code => code.textContent.toLowerCase())
                .join(' ');
            const notes = Array.from(card.querySelectorAll('.note-box'))
                .map(note => note.textContent.toLowerCase())
                .join(' ');
            
            const matches = toolName.includes(searchTerm) || 
                          toolDesc.includes(searchTerm) || 
                          commands.includes(searchTerm) ||
                          notes.includes(searchTerm);
            
            card.style.display = matches ? '' : 'none';
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.tool-card, .step-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    document.querySelectorAll('.stat-item').forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'fadeIn 0.6s ease forwards';
        }, index * 100);
    });

    const searchForm = searchInput.parentElement;
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
});

function copyCommand(button) {
    const commandBox = button.parentElement;
    const code = commandBox.querySelector('code');
    const textToCopy = code.textContent.trim();
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('Command copied successfully!');
        
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = 'var(--neon-green)';
        button.style.color = 'var(--dark-bg)';
        
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        showNotification('Failed to copy command', true);
    });
}

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const messageSpan = notification.querySelector('span');
    
    messageSpan.textContent = message;
    
    if (isError) {
        notification.style.background = 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, var(--neon-green) 0%, var(--neon-green-bright) 100%)';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

document.addEventListener('keydown', function(e) {
    if ((e.key === '/' || e.key === 'k') && e.ctrlKey) {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    if (e.key === 'Escape') {
        document.getElementById('searchInput').blur();
        document.getElementById('searchInput').value = '';
        const event = new Event('input', { bubbles: true });
        document.getElementById('searchInput').dispatchEvent(event);
    }
});

document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.01)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

let lastScrollTop = 0;
const navbar = document.querySelector('.tabs-container');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.opacity = '0.9';
    } else {
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
    }
    
    lastScrollTop = scrollTop;
});

document.querySelectorAll('.command-box').forEach(box => {
    box.addEventListener('click', function(e) {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'I') {
            const copyBtn = this.querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.click();
            }
        }
    });
});

const style = document.createElement('style');
style.textContent = `
    .command-box {
        cursor: pointer;
    }
    .command-box:active {
        transform: scale(0.99);
    }
`;
document.head.appendChild(style);
