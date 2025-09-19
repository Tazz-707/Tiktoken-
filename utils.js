// البيانات العامة والمتغيرات العالمية
let currentProfile = null;
let isFollowingProfile = false;
let currentFriendProfile = null;
let isFollowingFriend = false;
let currentUser = null;
let currentVideoId = null;
let currentSoundId = null;
let replyingToCommentId = null;
let replyingToCommentText = null;
let editingCommentId = null;
let visibleComments = 5;

// بيانات الملفات الشخصية
const profiles = {
    'chefmariam': {
        pic: 'https://randomuser.me/api/portraits/women/65.jpg',
        username: '@chefmariam',
        following: 245,
        followers: '3.2M',
        likes: '24.8M',
        bio: 'Professional chef sharing quick recipes and cooking tips. 🍳 Follow for daily food inspiration!',
        videos: [
            { thumb: 'https://i.ytimg.com/vi/abcd1234/mqdefault.jpg', views: '1.2M' },
            // ... باقي الفيديوهات
        ]
    },
    // ... باقي الملفات الشخصية
};

// بيانات التعليقات
let commentsData = {
    'cooking': [
        { 
            id: 1, 
            user: '@foodlover', 
            avatar: 'https://randomuser.me/api/portraits/women/25.jpg', 
            text: 'This salad looks amazing! 😍', 
            time: '2 hours ago', 
            likes: 123, 
            liked: false, 
            replies: [
                // ... باقي الردود
            ] 
        },
        // ... باقي التعليقات
    ],
    // ... فئات أخرى
};

// بيانات الموسيقى
const musicData = {
    'cooking': {
        title: 'Cooking Vibes',
        artist: 'Original Sound - chefmariam',
        stats: 'Used in 12.5K videos'
    },
    // ... فئات أخرى
};

// وظائف مساعدة
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function findComment(comments, commentId) {
    for (const comment of comments) {
        if (comment.id === commentId) return comment;

        if (comment.replies && comment.replies.length > 0) {
            const foundInReplies = findComment(comment.replies, commentId);
            if (foundInReplies) return foundInReplies;
        }
    }
    return null;
}

// وظائف التنقل العامة
function showOverlay(id) {
    hideAllOverlays();
    document.getElementById(id).style.display = 'block';
    
    document.querySelectorAll('.video-player').forEach(video => {
        video.pause();
        video.closest('.video-container').querySelector('.play-button').style.display = 'flex';
    });
    
    if (id === 'profileOverlay') setActiveNavIcon('profile');
    else if (id === 'searchOverlay') setActiveNavIcon('search');
    else if (id === 'notificationsOverlay') setActiveNavIcon('notifications');
}

function hideOverlay(id) {
    if (id === 'commentsOverlay') {
        document.getElementById(id).classList.add('closing');
        setTimeout(() => {
            document.getElementById(id).style.display = 'none';
            document.getElementById(id).classList.remove('closing');
            visibleComments = 5;
        }, 300);
    } else {
        document.getElementById(id).style.display = 'none';
    }
    setActiveNavIcon('home');
}

function hideAllOverlays() {
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.style.display = 'none';
    });
}

function setActiveNavIcon(active) {
    document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    
    if (active === 'home') {
        document.querySelector('.nav-icon:nth-child(1)').classList.add('active');
    } else if (active === 'search') {
        document.querySelector('.nav-icon:nth-child(2)').classList.add('active');
    } else if (active === 'notifications') {
        document.querySelector('.nav-icon:nth-child(4)').classList.add('active');
    } else if (active === 'profile') {
        document.querySelector('.nav-icon:nth-child(5)').classList.add('active');
    }
}