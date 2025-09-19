// تهيئة الإشعارات
function initNotifications() {
    if (!localStorage.getItem('tiktok_notifications')) {
        const initialNotifications = [
            {
                id: 1,
                type: 'like',
                user: '@foodlover',
                userPic: 'https://randomuser.me/api/portraits/women/25.jpg',
                content: 'liked your video "Quick 5-minute salad recipe!"',
                time: '2 hours ago',
                read: false,
                videoId: 'cooking'
            },
            {
                id: 2,
                type: 'follow',
                user: '@traveler',
                userPic: 'https://randomuser.me/api/portraits/men/32.jpg',
                content: 'started following you',
                time: '5 hours ago',
                read: false
            },
            {
                id: 3,
                type: 'comment_mention',
                user: '@cheflife',
                userPic: 'https://randomuser.me/api/portraits/women/45.jpg',
                content: 'mentioned you in a comment: "Great recipe!"',
                time: '1 day ago',
                read: true,
                videoId: 'cooking'
            },
            {
                id: 4,
                type: 'repost',
                user: '@dancer',
                userPic: 'https://randomuser.me/api/portraits/men/67.jpg',
                content: 'shared your video',
                time: '2 days ago',
                read: true,
                videoId: 'fitness'
            }
        ];
        localStorage.setItem('tiktok_notifications', JSON.stringify(initialNotifications));
    }
}

// إضافة إشعار جديد
function addNotification(type, user, userPic, content, videoId = null) {
    if (!currentUser) return;
    
    const notifications = JSON.parse(localStorage.getItem('tiktok_notifications')) || [];
    const newNotification = {
        id: Date.now(),
        type: type,
        user: user,
        userPic: userPic,
        content: content,
        time: 'الآن',
        read: false,
        videoId: videoId
    };
    
    notifications.unshift(newNotification);
    localStorage.setItem('tiktok_notifications', JSON.stringify(notifications));
    
    updateNotificationBadge();
    
    return newNotification;
}

// تحديث مؤشر الإشعارات
function updateNotificationBadge() {
    const notifications = JSON.parse(localStorage.getItem('tiktok_notifications')) || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notificationBadge');
    
    if (unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// عرض الإشعارات
function renderNotifications() {
    const notificationsContainer = document.getElementById('notificationsList');
    const notifications = JSON.parse(localStorage.getItem('tiktok_notifications')) || [];
    
    notificationsContainer.innerHTML = '';
    
    if (notifications.length === 0) {
        notificationsContainer.innerHTML = `
            <div class="no-notifications">
                <i class="fas fa-bell-slash"></i>
                <p>لا توجد إشعارات حتى الآن</p>
            </div>
        `;
        return;
    }
    
    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.read ? '' : 'unread'}`;
        notificationElement.innerHTML = `
            <img src="${notification.userPic}" class="notification-pic">
            <div class="notification-content">
                <strong>${notification.user}</strong> ${notification.content}
                <div class="notification-time">${notification.time}</div>
            </div>
            ${!notification.read ? '<div class="notification-dot"></div>' : ''}
        `;
        
        if (notification.videoId) {
            notificationElement.style.cursor = 'pointer';
            notificationElement.addEventListener('click', () => {
                markNotificationAsRead(notification.id);
                scrollToVideo(notification.videoId);
                hideOverlay('notificationsOverlay');
            });
        }
        
        notificationsContainer.appendChild(notificationElement);
    });
    
    updateNotificationBadge();
}

// وضع علامة مقروء على إشعار
function markNotificationAsRead(id) {
    const notifications = JSON.parse(localStorage.getItem('tiktok_notifications')) || [];
    const notificationIndex = notifications.findIndex(n => n.id === id);
    
    if (notificationIndex !== -1) {
        notifications[notificationIndex].read = true;
        localStorage.setItem('tiktok_notifications', JSON.stringify(notifications));
        renderNotifications();
    }
}

// وضع علامة مقروء على جميع الإشعارات
function markAllNotificationsAsRead() {
    const notifications = JSON.parse(localStorage.getItem('tiktok_notifications')) || [];
    
    notifications.forEach(notification => {
        notification.read = true;
    });
    
    localStorage.setItem('tiktok_notifications', JSON.stringify(notifications));
    renderNotifications();
}

// التمرير إلى فيديو معين
function scrollToVideo(videoId) {
    const videoElement = document.getElementById(videoId);
    if (videoElement) {
        const videoFeed = document.getElementById('videoFeed');
        videoFeed.scrollTo({
            top: videoElement.offsetTop,
            behavior: 'smooth'
        });
    }
}

// إظهار الإشعارات
function showNotifications() {
    renderNotifications();
    showOverlay('notificationsOverlay');
    
    markAllNotificationsAsRead();
}