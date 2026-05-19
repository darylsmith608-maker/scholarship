// 1. Initialize Supabase as 'db' at the very top to prevent initialization exceptions
const db = supabase.createClient'https://uckyzrjhnbcjzyxfrhdg.supabase.co', 'sb_publishable_tIncfVSxcUDc6ABeg-yULQ_nDyOt1_u');

// Track the current mode ('login' or 'signup')
let isLoginMode = true;

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const submitBtn = document.getElementById('submit-btn');
    const toggleAuthLink = document.getElementById('toggle-auth-link');
    const toggleText = document.getElementById('toggle-text');
    const toggleContainer = document.getElementById('toggle-container');
    const userProfile = document.getElementById('user-profile');
    const userEmailDisplay = document.getElementById('user-email-display');
    const signoutBtn = document.getElementById('signout-btn');

    // Toggle between Login and Sign Up views
    toggleAuthLink.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;

        if (isLoginMode) {
            authTitle.textContent = 'Log In';
            submitBtn.textContent = 'Log In';
            toggleText.innerHTML = `Don't have an account? <a href="#" id="toggle-auth-link">Sign Up</a>`;
        } else {
            authTitle.textContent = 'Create Account';
            submitBtn.textContent = 'Sign Up';
            toggleText.innerHTML = `Already have an account? <a href="#" id="toggle-auth-link">Log In</a>`;
        }
        
        // Re-bind the click event listener to the newly generated link
        document.getElementById('toggle-auth-link').addEventListener('click', arguments.callee);
    });

    // Handle Form Submission (Login OR Sign Up)
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (isLoginMode) {
            // Log In execution
            const { data, error } = await db.auth.signInWithPassword({ email, password });
            if (error) {
                alert(`Login failed: ${error.message}`);
            } else {
                showAuthenticatedUI(data.user);
            }
        } else {
            // Sign Up execution
            const { data, error } = await db.auth.signUp({ email, password });
            if (error) {
                alert(`Sign up failed: ${error.message}`);
            } else {
                alert('Sign up successful! Please check your email for verification if required.');
                if (data.user) showAuthenticatedUI(data.user);
            }
        }
    });

    // Handle Sign Out
    signoutBtn.addEventListener('click', async () => {
        const { error } = await db.auth.signOut();
        if (error) {
            alert(`Error signing out: ${error.message}`);
        } else {
            showLoggedOutUI();
        }
    });

    // Helper functions to manage view rendering smoothly
    function showAuthenticatedUI(user) {
        authForm.classList.add('hidden');
        toggleContainer.classList.add('hidden');
        authTitle.classList.add('hidden');
        
        userEmailDisplay.textContent = user.email;
        userProfile.classList.remove('hidden');
    }

    function showLoggedOutUI() {
        userProfile.classList.add('hidden');
        
        authForm.classList.remove('hidden');
        toggleContainer.classList.remove('hidden');
        authTitle.classList.remove('hidden');
        authForm.reset();
    }
});
