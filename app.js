// التهيئة الرئيسية للتطبيق
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
    initNotifications();
    updateNotificationBadge();
    initUserData();

    // تسجيل أحداث النماذج
    document.getElementById('loginFormElement').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        loginUser(email, password);
    });
    
    document.getElementById('signupFormElement').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        signupUser(username, email, password, confirmPassword);
    });
    
    document.getElementById('forgotPasswordFormElement').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;
        forgotPassword(email);
    });
    
    // تمكين نشر التعليقات باستخدام مفتاح Enter
    document.getElementById('commentInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            postComment();
        }
    });
    
    // النقر المزدود للإعجاب
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        let lastTap = 0;
        let tapTimeout;
        const heartAnimation = container.querySelector('.heart-animation');
        const likeButton = container.querySelector('.sidebar-icon:nth-child(2)');
        
        container.addEventListener('click', (e) => {
            if (e.target.closest('.video-ui')) return;
            
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 300 && tapLength > 0) {
                clearTimeout(tapTimeout);

                heartAnimation.classList.add('like-animate');
                setTimeout(() => {
                    heartAnimation.classList.remove('like-animate');
                }, 800);

                const heartIcon = likeButton.querySelector('i');
                if (!heartIcon.classList.contains('liked')) {
                    toggleLike(likeButton);
                }

                lastTap = 0;
            } else {
                tapTimeout = setTimeout(() => {
                    const video = container.querySelector('.video-player');
                    const playButton = container.querySelector('.play-button');
                    
                    if (video.paused) {
                        video.play();
                        playButton.style.display = 'none';
                    } else {
                        video.pause();
                        playButton.style.display = 'flex';
                    }
                }, 300);
                
                lastTap = currentTime;
            }
        });
    });
    
    // مراقبة الفيديوهات للتشغيل التلقائي
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('.video-player');
            const playButton = entry.target.querySelector('.play-button');
            
            if (entry.isIntersecting) {
                const promise = video.play();
                
                if (promise !== undefined) {
                    promise.catch(error => {
                        playButton.style.display = 'flex';
                    }).then(() => {
                        playButton.style.display = 'none';
                    });
                }
            } else {
                video.pause();
                playButton.style.display = 'flex';
            }
        });
    }, { threshold: 0.7 });
    
    document.querySelectorAll('.video-container').forEach(container => {
        observer.observe(container);
    });
    
    // سحب لإغلاق التعليقات
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    const commentsOverlay = document.getElementById('commentsOverlay');
    
    function startDrag(e) {
        if (e.target.closest('.comments-list, .comment-input-container')) return;
        isDragging = true;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
        commentsOverlay.style.transition = 'none';
    }
    
    function duringDrag(e) {
        if (!isDragging) return;
        currentY = e.touches ? e.touches[0].clientY : e.clientY;
        const diff = currentY - startY;
        if (diff > 0) {
            commentsOverlay.style.transform = `translateY(${diff}px)`;
        }
    }
    
    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        const diff = currentY - startY;
        commentsOverlay.style.transition = 'transform 0.3s ease-out';
        
        if (diff > 100) {
            hideOverlay('commentsOverlay');
        } else {
            commentsOverlay.style.transform = '';
        }
    }
    
    commentsOverlay.addEventListener('touchstart', startDrag);
    commentsOverlay.addEventListener('touchmove', duringDrag);
    commentsOverlay.addEventListener('touchend', endDrag);
    commentsOverlay.addEventListener('mousedown', startDrag);
    commentsOverlay.addEventListener('mousemove', duringDrag);
    commentsOverlay.addEventListener('mouseup', endDrag);
    commentsOverlay.addEventListener('mouseleave', endDrag);
    
    // معالجة تحميل صورة الملف الشخصي
    document.getElementById('profilePicUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('profilePicPreview').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

// وظائف التنقل الأساسية
function showSearch() {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
    showOverlay('searchOverlay');
}

function showHome() {
    hideAllOverlays();
    setActiveNavIcon('home');
}

function showUpload() {
    if (!currentUser) {
        alert('Please log in to upload videos');
        return;
    }
    showOverlay('uploadOverlay');
}