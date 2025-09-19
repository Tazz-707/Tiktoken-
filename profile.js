// إظهار ملف تعريف الصديق
function showFriendProfile(username) {
    currentFriendProfile = profiles[username];
    isFollowingFriend = false;
    
    document.getElementById('friendProfilePic').src = currentFriendProfile.pic;
    document.getElementById('friendProfileUsername').textContent = currentFriendProfile.username;
    document.getElementById('friendFollowingCount').textContent = currentFriendProfile.following;
    document.getElementById('friendFollowerCount').textContent = currentFriendProfile.followers;
    document.getElementById('friendLikeCount').textContent = currentFriendProfile.likes;
    document.getElementById('friendProfileBio').textContent = currentFriendProfile.bio;
    document.getElementById('friendProfileTitle').textContent = currentFriendProfile.username;
    
    const followBtn = document.getElementById('friendFollowBtn');
    followBtn.textContent = 'Follow';
    followBtn.style.background = '#FE2C55';
    
    const videosContainer = document.getElementById('friendProfileVideos');
    videosContainer.innerHTML = '';
    
    currentFriendProfile.videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.className = 'profile-page-video';
        videoElement.innerHTML = `
            <i class="fas fa-play"></i>
            <div style="position: absolute; bottom: 5px; left: 5px; font-size: 12px;">
                <i class="fas fa-play" style="margin-right: 5px;"></i>${video.views}
            </div>
        `;
        videoElement.style.backgroundImage = `url(${video.thumb})`;
        videoElement.style.backgroundSize = 'cover';
        videosContainer.appendChild(videoElement);
    });
    
    document.getElementById('homeFeed').style.display = 'none';
    document.getElementById('myProfilePage').style.display = 'none';
    document.getElementById('friendProfilePage').style.display = 'block';
    
    switchFriendProfileTab('videos');
}

// إظهار ملفي الشخصي
function showMyProfile() {
    if (!currentUser) {
        alert('Please log in to view your profile');
        return;
    }
    
    document.getElementById('homeFeed').style.display = 'none';
    document.getElementById('friendProfilePage').style.display = 'none';
    document.getElementById('myProfilePage').style.display = 'block';
    
    switchProfileTab('videos');
}

// تبديل المتابعة
function toggleFollow(event, username) {
    event.stopPropagation();
    const button = event.currentTarget;
    
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.classList.add('following');
    
    setTimeout(() => {
        button.classList.add('hidden');
    }, 1000);
    
    showToast(`لقد بدأت متابعة ${username}`);
}

// تبديل متابعة الملف الشخصي
function toggleProfileFollow() {
    const followBtn = document.getElementById('profileFollowBtn');
    isFollowingProfile = !isFollowingProfile;
    
    if (isFollowingProfile) {
        followBtn.textContent = 'Following';
        followBtn.style.background = '#25F4EE';
        showToast(`لقد بدأت متابعة ${currentProfile.username}`);
    } else {
        followBtn.textContent = 'Follow';
        followBtn.style.background = '#FE2C55';
        showToast(`لقد توقفت عن متابعة ${currentProfile.username}`);
    }
}

// تبديل متابعة الصديق
function toggleFriendFollow() {
    const followBtn = document.getElementById('friendFollowBtn');
    isFollowingFriend = !isFollowingFriend;
    
    if (isFollowingFriend) {
        followBtn.textContent = 'Following';
        followBtn.style.background = '#25F4EE';
        showToast(`لقد بدأت متابعة ${currentFriendProfile.username}`);
    } else {
        followBtn.textContent = 'Follow';
        followBtn.style.background = '#FE2C55';
        showToast(`لقد توقفت عن متابعة ${currentFriendProfile.username}`);
    }
}

// تحرير الملف الشخصي
function editProfile() {
    if (!currentUser) {
        showToast('يجب تسجيل الدخول لتعديل الملف الشخصي');
        return;
    }
    
    document.getElementById('editUsername').value = currentUser.username;
    document.getElementById('editBio').value = currentUser.bio || '';
    document.getElementById('profilePicPreview').src = currentUser.profilePic;

    
    showOverlay('editProfileOverlay');
}

// تغيير صورة الملف الشخصي
function changeProfilePicture() {
    document.getElementById('profilePicUpload').click();
}

// حفظ تغييرات الملف الشخصي
function saveProfileChanges() {
    const newUsername = document.getElementById('editUsername').value.trim();
    const newBio = document.getElementById('editBio').value.trim();
    const newProfilePic = document.getElementById('profilePicPreview').src;
    
    if (!newUsername) {
        showToast('يجب إدخال اسم مستخدم');
        return;
    }
    
    currentUser.username = newUsername;
    currentUser.bio = newBio;
    currentUser.profilePic = newProfilePic;
    
    localStorage.setItem('tiktok_user', JSON.stringify(currentUser));
    
    document.querySelectorAll('.profile-pic-large, .profile-pic-header').forEach(img => {
        img.src = newProfilePic;
    });
    
    document.querySelector('.profile-header h2').textContent = '@' + newUsername;
    document.querySelector('.profile-bio').textContent = newBio || 'هذه سيرتك الذاتية...';
    
    showToast('تم حفظ التغييرات بنجاح');
    hideOverlay('editProfileOverlay');
}

// تهيئة بيانات المستخدم
function initUserData() {
    if (currentUser) {
        if (!currentUser.bio) {
            currentUser.bio = 'هذه سيرتك الذاتية. يمكنك تعديلها لتعريف الآخرين بنفسك.';
        }
        
        document.querySelector('.profile-header h2').textContent = '@' + currentUser.username;
        document.querySelector('.profile-bio').textContent = currentUser.bio;
        document.querySelector('.profile-pic-large').src = currentUser.profilePic;
    }
}

// التبديل بين علامات التبويب في الملف الشخصي
function switchProfileTab(tabName) {
    document.querySelectorAll('#myProfilePage .profile-page-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (tabName === 'videos') {
        document.querySelector('#myProfilePage .profile-page-tab:nth-child(1)').classList.add('active');
    } else if (tabName === 'liked') {
        document.querySelector('#myProfilePage .profile-page-tab:nth-child(2)').classList.add('active');
    }
}

// التبديل بين علامات التبويب في ملف الصديق
function switchFriendProfileTab(tabName) {
    document.querySelectorAll('#friendProfilePage .profile-page-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (tabName === 'videos') {
        document.querySelector('#friendProfilePage .profile-page-tab:nth-child(1)').classList.add('active');
    } else if (tabName === 'liked') {
        document.querySelector('#friendProfilePage .profile-page-tab:nth-child(2)').classList.add('active');
    }
}

// العودة إلى الصفحة الرئيسية
function backToHome() {
    document.getElementById('videoFeed').style.display = 'block';
    document.getElementById('myProfilePage').style.display = 'none';
    document.getElementById('friendProfilePage').style.display = 'none';
}