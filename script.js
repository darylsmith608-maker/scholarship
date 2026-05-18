document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. INITIALIZE SUPABASE
    // ==========================================
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

    // Dropdown UI Targets
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
            if (showSignupBtn) showSignupBtn.classList.remove('active');
            if (signupFields) signupFields.classList.add('hidden');
            if (authSubmitBtn) authSubmitBtn.textContent = 'Login';
            
            // Clear requirement rules so login engine skips name checking
            const nameField = document.getElementById('name');
            if (nameField) nameField.removeAttribute('required');
        });
    }

    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', () => {
            isLoginMode = false;
            showSignupBtn.classList.add('active');
            if (showLoginBtn) showLoginBtn.classList.remove('active');
            if (signupFields) signupFields.classList.remove('hidden');
            if (authSubmitBtn) authSubmitBtn.textContent = 'Sign Up';
            
            // Enforce username constraints on creation
            const nameField = document.getElementById('name');
            if (nameField) nameField.setAttribute('required', 'true');
        });
    }

    // ==========================================
    // 4. DROPDOWN CONTROLS
    // ==========================================
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop general window listener from hiding it instantly
            dropdownMenu.classList.toggle('hidden');
        });
    }

    // Clear dropdown window state if the user taps empty layout real estate
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
                        checkUser(); // Process dynamic application viewport modifications
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
                        if (showLoginBtn) showLoginBtn.click(); // Roll visual panels back to standard login
                    }
                }
            } catch (err) {
                console.error("Critical Auth Error:", err);
                alert("An unexpected error occurred during authentication.");
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
                // Purge active user interaction frames instantly
                if (configSection) configSection.classList.add('hidden');
                if (resultsSection) resultsSection.classList.add('hidden');
                checkUser(); // Reevaluate views to show authorization portal
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
                // --- USER IS LOGGED IN ---
                if (authSection) authSection.classList.add('hidden');
                if (configSection) configSection.classList.remove('hidden');
                if (userNav) userNav.classList.remove('hidden'); // Show layout controls right
                
                const userMetadata = session.user.user_metadata;
                const displayName = (userMetadata && userMetadata.full_name) || session.user.email;
                
                if (headerDesc) {
                    headerDesc.textContent = `Welcome back, ${displayName}! Plan your ultimate build below.`;
                }
                
                // Truncate names for button bounds
                if (dropdownUsername) {
                    dropdownUsername.textContent = displayName.split(' ')[0];
                }
                
                if (authForm) authForm.reset();
            } else {
                // --- USER IS LOGGED OUT ---
                if (authSection) authSection.classList.remove('hidden');
                if (configSection) configSection.classList.add('hidden');
                if (resultsSection) resultsSection.classList.add('hidden');
                if (userNav) userNav.classList.add('hidden'); // Collapse entire navigation context panel
                
                if (headerDesc) {
                    headerDesc.textContent = "Please login or sign up to discover your build.";
                }
            }
        } catch (err) {
            console.error("Session profile sync failure:", err);
        }
    }

    // Evaluate credentials on fresh lifecycle instantiation
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
});
