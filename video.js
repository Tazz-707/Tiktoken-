// تشغيل الفيديو
function playVideo(button, event) {
    event.stopPropagation();
    const videoContainer = button.closest('.video-container');
    const video = videoContainer.querySelector('.video-player');
    const playButton = videoContainer.querySelector('.play-button');
    
    if (video.paused) {
        video.play();
        playButton.style.display = 'none';
    } else {
        video.pause();
        playButton.style.display = 'flex';
    }
}

// ملاحظة: كود IntersectionObserver يجب أن يبقى في app.js لأنه يحتاج إلى DOMContentLoaded

// تحميل فيديوهات جديدة عند التمرير
const videoFeed = document.getElementById('videoFeed');
const loadingSpinner = document.getElementById('loadingSpinner');

videoFeed.addEventListener('scroll', () => {
    if (videoFeed.scrollTop + videoFeed.clientHeight > videoFeed.scrollHeight - 100) {
        loadingSpinner.style.display = 'block';
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
        }, 1000);
    }
});

// تبديل الإعجاب
function toggleLike(button) {
    const heartIcon = button.querySelector('i');
    const likeCount = button.querySelector('.icon-label');
    
    let count = parseInt(likeCount.textContent.replace(/[^0-9]/g, ''));

    if (!heartIcon.classList.contains('liked')) {
        heartIcon.classList.add('liked');
        count++;
        showToast('Liked video!');
    } else {
        heartIcon.classList.remove('liked');
        count--;
        showToast('Unliked video!');
    }

    likeCount.textContent = count.toLocaleString();
}

// إظهار المشاركة
function showShare(videoId) {
    currentVideoId = videoId;
    showOverlay('shareOverlay');
}

// المشاركة عبر منصات مختلفة
function shareVia(method) {
    const videoUrl = 'https://tiktok.com/video/12345';

    switch (method) {
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(videoUrl)}`, '_blank');
            break;

        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`, '_blank');
            break;

        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}`, '_blank');
            break;

        case 'repost':
            showToast('تمت إعادة نشر الفيديو بنجاح');
            break;

        case 'messenger':
            window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(videoUrl)}&app_id=123456789&redirect_uri=${encodeURIComponent(videoUrl)}`, '_blank');
            break;

        case 'link':
            copyToClipboard();
            break;

        case 'qrcode':
            alert("هنا يمكنك عرض كود QR — سنضيفه إذا أردت.");
            break;

        case 'more':
            if (navigator.share) {
                navigator.share({
                    title: 'شارك الفيديو',
                    text: 'شاهد هذا الفيديو!',
                    url: videoUrl
                }).catch(err => console.log('مشاركة أُلغيت', err));
            } else {
                alert("ميزة المشاركة غير مدعومة في هذا المتصفح.");
            }
            break;

        default:
            console.log('طريقة مشاركة غير معروفة:', method);
    }
    
    showToast(`تم المشاركة عبر ${method}`);
}

// نسخ الرابط
function copyToClipboard() {
    const tempInput = document.createElement('input');
    tempInput.value = 'https://tiktok.com/video/12345';
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showToast('Link copied to clipboard!');
}

// إظهار الموسيقى
function showMusic(videoId) {
    currentSoundId = videoId;
    const music = musicData[videoId] || musicData['cooking'];
    
    document.getElementById('musicTitle').textContent = music.title;
    document.getElementById('musicArtist').textContent = music.artist;
    document.getElementById('musicStats').textContent = music.stats;
    
    showOverlay('musicOverlay');
}

// تغيير الصوت
function changeSound(soundId) {
    showToast(`Sound changed to ${soundId}`);
}

// تحميل الفيديو
function handleVideoUpload(input) {
    const uploadArea = document.getElementById('uploadArea');
    if (input.files && input.files[0]) {
        const videoFile = input.files[0];
        const videoURL = URL.createObjectURL(videoFile);
        
        uploadArea.innerHTML = `
            <video style="width: 100%; height: 100%; object-fit: contain;" controls>
                <source src="${videoURL}" type="${videoFile.type}">
            </video>
        `;
        uploadArea.style.border = 'none';
    }
}

// نشر الفيديو
function postVideo() {
    if (!currentUser) {
        alert('Please log in to post videos');
        hideOverlay('uploadOverlay');
        return;
    }
    
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';
    
    setTimeout(() => {
        loadingSpinner.style.display = 'none';
        showToast('Video posted successfully!');
        hideOverlay('uploadOverlay');
        
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.innerHTML = `
            <i class="fas fa-cloud-upload-alt upload-icon"></i>
            <div class="upload-text">Select video to upload</div>
        `;
        uploadArea.style.border = '2px dashed #666';
        document.getElementById('videoCaption').value = '';
    }, 2000);
}