// تهيئة حالة المصادقة
function initAuth() {
    const userData = localStorage.getItem('tiktok_user');
    
    if (userData) {
        currentUser = JSON.parse(userData);
        document.body.classList.add('authenticated');
    } else {
        document.body.classList.remove('authenticated');
    }
}

// وظيفة تسجيل الدخول
function loginUser(email, password) {
    const loginError = document.getElementById('loginError');
    const loginSuccess = document.getElementById('loginSuccess');
    
    loginError.style.display = 'none';
    loginSuccess.style.display = 'none';
    
    if (!email || !password) {
        loginError.textContent = 'Please enter email and password';
        loginError.style.display = 'block';
        return;
    }
    
    setTimeout(() => {
        if (email.trim() !== '' && password.trim() !== '') {
            const user = {
                id: 'user_' + Math.random().toString(36).substr(2, 9),
                username: email.split('@')[0],
                email: email,
                profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
                joinedDate: new Date().toISOString()
            };
            
            localStorage.setItem('tiktok_user', JSON.stringify(user));
            currentUser = user;
            
            loginSuccess.style.display = 'block';
            
            setTimeout(() => {
                document.body.classList.add('authenticated');
            }, 1000);
        } else {
            loginError.textContent = 'Invalid email or password';
            loginError.style.display = 'block';
        }
    }, 800);
}

// وظيفة التسجيل
function signupUser(username, email, password, confirmPassword) {
    const signupError = document.getElementById('signupError');
    const signupSuccess = document.getElementById('signupSuccess');
    
    signupError.style.display = 'none';
    signupSuccess.style.display = 'none';
    
    if (!username || !email || !password || !confirmPassword) {
        signupError.textContent = 'Please fill all fields';
        signupError.style.display = 'block';
        return;
    }
    
    if (password !== confirmPassword) {
        signupError.textContent = 'Passwords do not match';
        signupError.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        signupError.textContent = 'Password must be at least 6 characters';
        signupError.style.display = 'block';
        return;
    }
    
    setTimeout(() => {
        const existingUsers = JSON.parse(localStorage.getItem('tiktok_users')) || [];
        const userExists = existingUsers.some(user => user.email === email);
        
        if (userExists) {
            signupError.textContent = 'User with this email already exists';
            signupError.style.display = 'block';
            return;
        }
        
        const newUser = {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            username: username,
            email: email,
            profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
            joinedDate: new Date().toISOString()
        };
        
        existingUsers.push(newUser);
        localStorage.setItem('tiktok_users', JSON.stringify(existingUsers));
        
        localStorage.setItem('tiktok_user', JSON.stringify(newUser));
        currentUser = newUser;
        
        signupSuccess.style.display = 'block';
        
        setTimeout(() => {
            document.body.classList.add('authenticated');
        }, 1000);
    }, 800);
}

// وظيفة نسيت كلمة المرور
function forgotPassword(email) {
    const forgotError = document.getElementById('forgotError');
    const forgotSuccess = document.getElementById('forgotSuccess');
    
    forgotError.style.display = 'none';
    forgotSuccess.style.display = 'none';
    
    if (!email) {
        forgotError.textContent = 'Please enter your email';
        forgotError.style.display = 'block';
        return;
    }
    
    setTimeout(() => {
        const existingUsers = JSON.parse(localStorage.getItem('tiktok_users')) || [];
        const userExists = existingUsers.some(user => user.email === email);
        
        if (userExists) {
            forgotSuccess.style.display = 'block';
        } else {
            forgotError.textContent = 'No account found with that email';
            forgotError.style.display = 'block';
        }
    }, 800);
}

// وظيفة تسجيل الخروج
function logout() {
    localStorage.removeItem('tiktok_user');
    currentUser = null;
    document.body.classList.remove('authenticated');
}

// إظهار نموذج التسجيل
function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('forgotPasswordForm').style.display = 'none';
}

// إظهار نموذج تسجيل الدخول
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'none';
}

// إظهار نموذج نسيت كلمة المرور
function showForgotPassword() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
}