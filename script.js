// 1. Initialize Supabase Correctly
// Keeping your actual project credentials from your working code
const supabaseUrl = 'https://uckyzrjhnbcjzyxfrhdg.supabase.co';
const supabaseKey = 'sb_publishable_tIncfVSxcUDc6ABeg-yULQ_nDyOt1_u';

// Initializing as 'supabase' directly to remain consistent with your references
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. DOM Elements / Selectors
const authSection = document.getElementById('auth-section');
const configSection = document.getElementById('config-section');
const resultsSection = document.getElementById('results');
const authForm = document.getElementById('auth-form');
const signupFields = document.getElementById('signup-fields');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const showLoginBtn = document.getElementById('show-login');
const showSignupBtn = document.getElementById('show-signup');
const headerDesc = document.getElementById('header-desc');
const userNav = document.getElementById('user-nav');
const signoutBtn = document.getElementById('signout-btn');
const budgetRange = document.getElementById('budget-range');
const budgetVal = document.getElementById('budget-val');
const pcForm = document.getElementById('pc-form');

// State to track whether the user is looking at Login or Sign Up mode
let isLoginMode = true;

// 3. Toggle between Login and Sign Up Forms
if (showLoginBtn) {
    showLoginBtn.addEventListener('click', () => {
        isLoginMode = true;
        showLoginBtn.classList.add('active');
        showSignupBtn.classList.remove('active');
        if (signupFields) signupFields.classList.add('hidden');
        if (authSubmitBtn) authSubmitBtn.textContent = 'Login';
        
        // Remove "required" attribute from hidden fields so the form can submit
        const nameField = document.getElementById('name');
        if (nameField) nameField.removeAttribute('required');
    });
}

if (showSignupBtn) {
    showSignupBtn.addEventListener('click', () => {
        isLoginMode = false;
        showSignupBtn.classList.add('active');
        showLoginBtn.classList.remove('active');
        if (signupFields) signupFields.classList.remove('hidden');
        if (authSubmitBtn) authSubmitBtn.textContent = 'Sign Up';
        
        // Make name required during signup
        const nameField = document.getElementById('name');
        if (nameField) nameField.setAttribute('required', 'true');
    });
}

// 4. Handle Form Submission (Login & Sign Up)
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('pass').value;

        try {
            if (isLoginMode) {
                // --- LOGIN LOGIC ---
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) {
                    alert('Login failed: ' + error.message);
                } else {
                    alert('Successfully logged in!');
                    checkUser(); // Refresh UI
                }
            } else {
                // --- SIGN UP LOGIC ---
                const fullName = document.getElementById('name').value;
                const phone = document.getElementById('tel').value;

                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: fullName,
                            phone: phone
                        }
                    }
                });

                if (error) {
                    alert('Sign up failed: ' + error.message);
                } else {
                    alert('Sign up successful! Please check your email for a confirmation link (if enabled) or log in.');
                    // Automatically switch back to login view
                    if (showLoginBtn) showLoginBtn.click();
                }
            }
        } catch (err) {
            console.error("Critical Auth Error:", err);
            alert("An unexpected authentication error occurred.");
        }
    });
}

// 5. Handle Sign Out
if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert('Error signing out: ' + error.message);
        } else {
            alert('Logged out successfully.');
            // Force hide sections and reset views immediately
            if (configSection) configSection.classList.add('hidden');
            if (resultsSection) resultsSection.classList.add('hidden');
            checkUser(); // Refresh UI
        }
    });
}

// 6. Check User Session Status & Update UI
async function checkUser() {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            // User is LOGGED IN
            if (authSection) authSection.classList.add('hidden');
            if (configSection) configSection.classList.remove('hidden');
            if (userNav) userNav.classList.remove('hidden'); // Show Logout navigation
            
            // Greet user by name if available, otherwise use email
            const userMetadata = session.user.user_metadata;
            const displayName = (userMetadata && userMetadata.full_name) || session.user.email;
            if (headerDesc) {
                headerDesc.textContent = `Welcome back, ${displayName}! Plan your ultimate build below.`;
            }
            
            if (authForm) authForm.reset();
        } else {
            // User is LOGGED OUT
            if (authSection) authSection.classList.remove('hidden');
            if (configSection) configSection.classList.add('hidden');
            if (resultsSection) resultsSection.classList.add('hidden');
            if (userNav) userNav.classList.add('hidden'); // Hide Logout navigation
            if (headerDesc) {
                headerDesc.textContent = "Please login or sign up to discover your build.";
            }
        }
    } catch (err) {
        console.error("Session evaluation failed:", err);
    }
}

// 7. Run on Page Load to see if user is already logged in
checkUser();

// 8. PC Configurator UI / Form Logic
if (budgetRange) {
    budgetRange.addEventListener('input', (e) => {
        if (budgetVal) budgetVal.textContent = e.target.value;
    });
}

if (pcForm) {
    pcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (resultsSection) resultsSection.classList.remove('hidden');
        
        const componentList = document.getElementById('component-list');
        const useCaseField = document.getElementById('use-case');
        const useCaseValue = useCaseField ? useCaseField.value : 'your needs';
        const budgetValue = budgetRange ? budgetRange.value : '0';
        
        if (componentList) {
            componentList.innerHTML = `<p>Analyzing a $${budgetValue} build for ${useCaseValue}...</p>`;
        }
    });
}
