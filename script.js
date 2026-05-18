// ==========================================
// 1. INITIALIZE SUPABASE
// ==========================================
// Using your active project credentials
const supabaseUrl = 'https://uckyzrjhnbcjzyxfrhdg.supabase.co';
const supabaseKey = 'sb_publishable_tIncfVSxcUDc6ABeg-yULQ_nDyOt1_u';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// 2. DOM ELEMENTS / SELECTORS
// ==========================================
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

// New Dropdown UI Selectors
const dropdownToggle = document.getElementById('dropdown-toggle');
const dropdownMenu = document.getElementById('dropdown-menu');
const dropdownUsername = document.getElementById('dropdown-username');

// State to track whether the user is looking at Login or Sign Up mode
let isLoginMode = true;

// ==========================================
// 3. TOGGLE LOGIN / SIGN UP VIEW
// ==========================================
if (showLoginBtn) {
    showLoginBtn.addEventListener('click', () => {
        isLoginMode = true;
        showLoginBtn.classList.add('active');
        showSignupBtn.classList.remove('active');
        if (signupFields) signupFields.classList.add('hidden');
        if (authSubmitBtn) authSubmitBtn.textContent = 'Login';
        
        // Remove "required" attribute from signup fields so login works smoothly
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
        
        // Make name required during registration
        const nameField = document.getElementById('name');
        if (nameField) nameField.setAttribute('required', 'true');
    });
}

// ==========================================
// 4. DROPDOWN CONTROLS
// ==========================================
if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents immediate close from global window listener
        dropdownMenu.classList.toggle('hidden');
    });
}

// Close the dropdown instantly if the user clicks anywhere else on the document
window.addEventListener('click', () => {
    if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
        dropdownMenu.classList.add('hidden');
    }
});

// ==========================================
// 5. HANDLE AUTHENTICATION FORM SUBMIT
// ==========================================
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
                    checkUser(); // Refresh UI View
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
                    if (showLoginBtn) showLoginBtn.click(); // Reset layout view to login
                }
            }
        } catch (err) {
            console.error("Critical Auth Error:", err);
            alert("An unexpected authentication error occurred.");
        }
    });
}

// ==========================================
// 6. HANDLE SIGN OUT
// ==========================================
if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert('Error signing out: ' + error.message);
        } else {
            alert('Logged out successfully.');
            // Instantly blank out personalized application spaces
            if (configSection) configSection.classList.add('hidden');
            if (resultsSection) resultsSection.classList.add('hidden');
            checkUser(); // Refresh UI View
        }
    });
}

// ==========================================
// 7. SESSION PERSISTENCE & UI STATES
// ==========================================
async function checkUser() {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            // --- USER LOGGED IN ---
            if (authSection) authSection.classList.add('hidden');
            if (configSection) configSection.classList.remove('hidden');
            if (userNav) userNav.classList.remove('hidden'); // Show right-side navigation
            
            // Generate display metadata name or fallback on user email context
            const userMetadata = session.user.user_metadata;
            const displayName = (userMetadata && userMetadata.full_name) || session.user.email;
            
            // Main page banner welcome text
            if (headerDesc) {
                headerDesc.textContent = `Welcome back, ${displayName}! Plan your ultimate build below.`;
            }
            
            // Dynamic text update for navbar button layout
            if (dropdownUsername) {
                dropdownUsername.textContent = displayName.split(' ')[0]; // Grabs first name or short text
            }
            
            if (authForm) authForm.reset();
        } else {
            // --- USER LOGGED OUT ---
            if (authSection) authSection.classList.remove('hidden');
            if (configSection) configSection.classList.add('hidden');
            if (resultsSection) resultsSection.classList.add('hidden');
            if (userNav) userNav.classList.add('hidden'); // Hide dropdown entirely
            
            if (headerDesc) {
                headerDesc.textContent = "Please login or sign up to discover your build.";
            }
        }
    } catch (err) {
        console.error("Session sync evaluation error:", err);
    }
}

// Run immediately on full page load
checkUser();

// ==========================================
// 8. PC CONFIGURATOR INTERFACE LOGIC
// ==========================================
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
