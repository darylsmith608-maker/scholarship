// 1. Initialize Supabase Correctly
const supabaseUrl = 'https://uckyzrjhnbcjzyxfrhdg.supabase.co';
const supabaseKey = 'sb_publishable_tIncfVSxcUDc6ABeg-yULQ_nDyOt1_u';

// FIX: Use the variables defined above inside the parentheses
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Selectors
const authSection = document.getElementById('auth-section');
const configSection = document.getElementById('config-section');
const signupFields = document.getElementById('signup-fields');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const showLogin = document.getElementById('show-login');
const showSignup = document.getElementById('show-signup');
const headerDesc = document.getElementById('header-desc');

let isSignUpMode = false;

// 2. Toggle Login/Signup
showLogin.addEventListener('click', () => {
    isSignUpMode = false; // FIX: Should be false for login
    signupFields.classList.add('hidden');
    authSubmitBtn.textContent = "Login";
    showLogin.classList.add('active');
    showSignup.classList.remove('active');
});

showSignup.addEventListener('click', () => {
    isSignUpMode = true; // Correct: true for signup
    signupFields.classList.remove('hidden');
    authSubmitBtn.textContent = "Sign Up";
    showSignup.classList.add('active');
    showLogin.classList.remove('active');
});

// 3. Handle Authentication
document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    let response;
    
    if (isSignUpMode) {
        // Sign Up Logic
        response = await supabase.auth.signUp({
            email, 
            password,
            options: { 
                data: { 
                    full_name: document.getElementById('name').value,
                    phone: document.getElementById('tel').value 
                }
            }
        });
    } else {
        // Login Logic
        response = await supabase.auth.signInWithPassword({ email, password });
    }

    if (response.error) {
        alert(response.error.message);
    } else {
        // SUCCESS: Show Configurator
        authSection.classList.add('hidden');
        configSection.classList.remove('hidden');
        headerDesc.textContent = "Define your needs. Discover your build.";
    }
});

// 4. PC Form Logic
document.getElementById('budget-range').addEventListener('input', (e) => {
    document.getElementById('budget-val').textContent = e.target.value;
});

document.getElementById('pc-form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('results').classList.remove('hidden');
});
