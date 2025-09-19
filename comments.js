// إظهار التعليقات
function showComments(videoId) {
    currentVideoId = videoId;
    editingCommentId = null;
    replyingToCommentId = null;
    replyingToCommentText = null;
    renderCommentsList();
    
    showOverlay('commentsOverlay');
}

// عرض قائمة التعليقات
function renderCommentsList() {
    const commentsList = document.getElementById('commentsList');
    const comments = commentsData[currentVideoId] || [];
    const visibleCommentsList = comments.slice(0, visibleComments);
    
    commentsList.innerHTML = '';
    
    document.getElementById('commentsCount').textContent = `${formatNumber(comments.length)} تعليقاً`;
    document.getElementById('commentsCounticon').textContent = `${formatNumber(comments.length)} `;
    
    visibleCommentsList.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        commentElement.id = `comment-${comment.id}`;
        
        const isCurrentUser = currentUser && currentUser.username === comment.user.replace('@', '');
        const isEditing = editingCommentId === comment.id;
        
        const showMoreButton = comment.text.length > 150 ? 
            `<button class="show-more-btn" onclick="toggleCommentText(this)">عرض المزيد <i class="fas fa-chevron-down"></i></button>` : 
            '';
        
        commentElement.innerHTML = `
            <div class="comment-header">
                <img src="${comment.avatar}" class="comment-avatar">
                <div class="comment-user-info">
                    <div class="comment-user">${comment.user}</div>
                    <div class="comment-time">${comment.time}</div>
                </div>
            </div>
            <div class="comment-text ${comment.text.length > 150 ? 'collapsed' : ''}">${comment.text}</div>
            ${showMoreButton}
            <div class="comment-actions">
                <div class="comment-action like ${comment.liked ? 'liked' : ''}" onclick="toggleCommentLike(${comment.id})">
                    <i class="fas fa-heart"></i>
                    <span class="like-count">${comment.likes}</span>
                </div>
                <div class="comment-action" onclick="startReply(${comment.id}, '${comment.user.replace(/'/g, "\\'")}', '${comment.text.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')">
                    <i class="fas fa-reply"></i> رد
                </div>
                ${isCurrentUser ? `
                    
                    <div class="comment-action" onclick="deleteComment(${comment.id})">
                        <i class="fas fa-trash"></i> حذف
                    </div>
                ` : ''}
            </div>
        `;
        
        if (comment.replies && comment.replies.length > 0) {
            const repliesContainer = document.createElement('div');
            repliesContainer.className = 'replies-container';
            
            const maxRepliesToShow = 2;
            const repliesToShow = comment.replies.slice(0, maxRepliesToShow);
            
            repliesToShow.forEach(reply => {
                const replyElement = createReplyElement(reply, comment.id);
                repliesContainer.appendChild(replyElement);
            });
            
            if (comment.replies.length > maxRepliesToShow) {
                const loadMoreBtn = document.createElement('button');
                loadMoreBtn.className = 'load-more-replies';
                loadMoreBtn.textContent = `عرض ${comment.replies.length - maxRepliesToShow} ردود أخرى`;
                loadMoreBtn.onclick = () => loadMoreReplies(comment.id);
                repliesContainer.appendChild(loadMoreBtn);
            }
            
            commentElement.appendChild(repliesContainer);
        }
        
        commentsList.appendChild(commentElement);
    });
    
    updateReplyContext();
}

// إنشاء عنصر رد
function createReplyElement(reply, commentId) {
    const replyElement = document.createElement('div');
    replyElement.className = 'reply-item';
    replyElement.dataset.commentId = commentId;
    replyElement.dataset.replyId = reply.id;
    
    const isCurrentUser = currentUser && currentUser.username === reply.user.replace('@', '');
    
    const showMoreButton = reply.text.length > 100 ? 
        `<button class="show-more-btn" onclick="toggleReplyText(this)">عرض المزيد <i class="fas fa-chevron-down"></i></button>` : 
        '';
    
    replyElement.innerHTML = `
        <img src="${reply.avatar}" class="reply-avatar">
        <div class="reply-content">
            <div class="reply-user">${reply.user} ${reply.replyTo ? `→ @${reply.replyTo}` : ''}</div>
            <div class="reply-text ${reply.text.length > 100 ? 'collapsed' : ''}">${reply.text}</div>
            ${showMoreButton}
            <div class="reply-actions">
                <div class="reply-action like ${reply.liked ? 'liked' : ''}" onclick="toggleReplyLike(${commentId}, ${reply.id})">
                    <i class="fas fa-heart"></i>
                    <span class="like-count">${reply.likes}</span>
                </div>
                 <div class="reply-action"
        data-comment-id="${commentId}"
        data-user="${reply.user.replace('@', '')}"
        data-text="${encodeURIComponent(reply.text)}"
        onclick="handleReplyClick(this)">
        <i class="fas fa-reply"></i> رد
    </div>
                ${isCurrentUser ? `
                    
                    <div class="reply-action" onclick="deleteReply(${commentId}, ${reply.id})">
                        <i class="fas fa-trash"></i> حذف
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    return replyElement;
}

// تبديل عرض/إخفاء النص الكامل للتعليق
function toggleCommentText(button) {
    const commentText = button.previousElementSibling;
    commentText.classList.toggle('collapsed');
    
    if (commentText.classList.contains('collapsed')) {
        button.innerHTML = 'عرض المزيد <i class="fas fa-chevron-down"></i>';
    } else {
        button.innerHTML = 'عرض أقل <i class="fas fa-chevron-up"></i>';
    }
}

// تبديل عرض/إخفاء النص الكامل للرد
function toggleReplyText(button) {
    const replyText = button.previousElementSibling;
    replyText.classList.toggle('collapsed');
    
    if (replyText.classList.contains('collapsed')) {
        button.innerHTML = 'عرض المزيد <i class="fas fa-chevron-down"></i>';
    } else {
        button.innerHTML = 'عرض أقل <i class="fas fa-chevron-up"></i>';
    }
}

// تحميل المزيد من الردود
function loadMoreReplies(commentId) {
    const comment = findComment(commentsData[currentVideoId], commentId);
    if (!comment) return;
    
    const repliesContainer = document.querySelector(`#comment-${commentId} .replies-container`);
    if (!repliesContainer) return;
    
    const loadMoreBtn = repliesContainer.querySelector('.load-more-replies');
    if (loadMoreBtn) loadMoreBtn.remove();
    
    comment.replies.forEach(reply => {
        if (!repliesContainer.querySelector(`.reply-item[data-reply-id="${reply.id}"]`)) {
            const replyElement = createReplyElement(reply, commentId);
            repliesContainer.appendChild(replyElement);
        }
    });
}

// التعامل مع النقر على زر الرد
function handleReplyClick(element) {
    const commentId = parseInt(element.dataset.commentId);
    const username = element.dataset.user;
    const text = decodeURIComponent(element.dataset.text);

    startReply(commentId, username, text, true);
}

// تبديل إعجاب التعليق
function toggleCommentLike(commentId) {
    const comments = commentsData[currentVideoId];
    const comment = findComment(comments, commentId);
    
    if (!comment) return;
    
    comment.liked = !comment.liked;
    comment.likes += comment.liked ? 1 : -1;
    
    const commentElement = document.getElementById(`comment-${commentId}`);
    if (!commentElement) return;
    
    const likeButton = commentElement.querySelector('.like');
    const likeCount = commentElement.querySelector('.like-count');
    
    likeButton.classList.toggle('liked', comment.liked);
    likeCount.textContent = comment.likes;
    
    showToast(comment.liked ? 'Liked comment!' : 'Removed like from comment');
}

// تبديل إعجاب الرد
function toggleReplyLike(commentId, replyId) {
    const comment = findComment(commentsData[currentVideoId], commentId);
    if (!comment || !comment.replies) return;
    
    const reply = comment.replies.find(r => r.id === replyId);
    if (!reply) return;
    
    reply.liked = !reply.liked;
    reply.likes += reply.liked ? 1 : -1;
    
    const replyElement = document.querySelector(`.reply-item[data-comment-id="${commentId}"][data-reply-id="${replyId}"]`);
    if (!replyElement) return;
    
    const likeButton = replyElement.querySelector('.like');
    const likeCount = replyElement.querySelector('.like-count');
    
    likeButton.classList.toggle('liked', reply.liked);
    likeCount.textContent = reply.likes;
    
    showToast(reply.liked ? 'Liked reply!' : 'Removed like from reply');
}

// بدء الرد على تعليق
function startReply(commentId, username, commentText, isReply = false) {
    replyingToCommentId = commentId;
    replyingToUsername = username;
    replyingToCommentText = commentText;
    
    const replyContext = document.getElementById('replyContext');
    const replyContextText = replyContext.querySelector('.reply-context-text');
    
    replyContextText.textContent = `جارٍ الرد على ${username}: ${commentText.substring(0, 30)}${commentText.length > 30 ? '...' : ''}`;
    replyContext.style.display = 'flex';
    
    document.getElementById('commentInput').focus();
    document.getElementById('commentInput').placeholder = `اكتب رداً على ${username}...`;
    
    showToast(`جارٍ الرد على ${username}`);
}

// تحديث سياق الرد
function updateReplyContext() {
    const replyContext = document.getElementById('replyContext');
    const replyContextText = replyContext.querySelector('.reply-context-text');
    
    if (replyingToCommentId) {
        const comment = findComment(commentsData[currentVideoId], replyingToCommentId);
        if (comment) {
            replyContextText.textContent = `Replying to ${comment.user}: ${comment.text}`;
            replyContext.style.display = 'flex';
            return;
        }
    }
    
    replyContext.style.display = 'none';
}

// إلغاء سياق الرد
function cancelReplyContext() {
    replyingToCommentId = null;
    replyingToUsername = null;
    replyingToCommentText = null;
    document.getElementById('replyContext').style.display = 'none';
    document.getElementById('commentInput').placeholder = 'أضف تعليقاً...';
    showToast('تم أضف تعليق');
}

// نشر تعليق
function postComment() {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();
    
    if (!commentText) {
        showToast('الرجاء إدخال نص التعليق');
        return;
    }
    
    if (!currentUser) {
        showToast('يجب تسجيل الدخول لإضافة تعليق');
        return;
    }
    
    const newComment = {
        id: Date.now(),
        user: `@${currentUser.username}`,
        avatar: currentUser.profilePic,
        text: commentText,
        time: 'الآن',
        likes: 0,
        liked: false,
        replies: [],
        replyTo: replyingToCommentId ? replyingToUsername.replace('@', '') : null
    };
    
    if (replyingToCommentId) {
        const parentComment = findComment(commentsData[currentVideoId], replyingToCommentId);
        if (parentComment) {
            if (!parentComment.replies) parentComment.replies = [];
            parentComment.replies.push(newComment);
            showToast('تم نشر الرد بنجاح!');
        }
    } else {
        if (!commentsData[currentVideoId]) {
            commentsData[currentVideoId] = [];
        }
        commentsData[currentVideoId].unshift(newComment);
        showToast('تم نشر التعليق بنجاح!');
    }
    
    renderCommentsList();
    
    commentInput.value = '';
    cancelReplyContext();
    
    document.querySelector('.comments-list').scrollTop = 0;
}

// حذف تعليق
function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    const comments = commentsData[currentVideoId];
    
    const commentIndex = comments.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
        comments.splice(commentIndex, 1);
    }
    
    renderCommentsList();
    
    showToast('Comment deleted successfully!');
}

// حذف رد
function deleteReply(commentId, replyId) {
    if (!confirm('Are you sure you want to delete this reply?')) return;
    
    const comment = findComment(commentsData[currentVideoId], commentId);
    if (!comment || !comment.replies) return;
    
    const replyIndex = comment.replies.findIndex(r => r.id === replyId);
    if (replyIndex !== -1) {
        comment.replies.splice(replyIndex, 1);
    }
    
    renderCommentsList();
    
    showToast('Reply deleted successfully!');
}