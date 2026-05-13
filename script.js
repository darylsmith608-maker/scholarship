// Initialize Supabase
const supabaseUrl = 'https://uckyzrjhnbcjzyxfrhdg.supabase.co';
const supabaseKey = 'sb_publishable_tIncfVSxcUDc6ABeg-yULQ_nDyOt1_u';
const supabase = supabase.createClient(https://uckyzrjhnbcjzyxfrhdg.supabase.co, https://uckyzrjhnbcjzyxfrhdg.supabase.co);

// Selectors
const authSection = document.getElementById('auth-section');
const configSection = document.getElementById('config-section');
const signupFields = document.getElementById('signup-fields');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const showLogin = document.getElementById('show-login');
const showSignup = document.getElementById('show-signup');
const headerDesc = document.getElementById('header-desc');

let isSignUpMode = false;

// 1. Toggle Login/Signup
showLogin.addEventListener('click', () => {
    isSignUpMode = true;
    signupFields.classList.add('hidden');
    authSubmitBtn.textContent = "Login";
    showLogin.classList.add('active');
    showSignup.classList.remove('active');
});

showSignup.addEventListener('click', () => {
    isSignUpMode = true;
    signupFields.classList.remove('hidden');
    authSubmitBtn.textContent = "Sign Up";
    showSignup.classList.add('active');
    showLogin.classList.remove('active');
});

// 2. Handle Authentication
document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    let response;
    if (isSignUpMode) {
        response = await supabase.auth.signUp({
            email, password,
            options: { data: { 
                full_name: document.getElementById('name').value,
                phone: document.getElementById('tel').value 
            }}
        });
    } else {
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

// 3. PC Form Logic
document.getElementById('budget-range').addEventListener('input', (e) => {
    document.getElementById('budget-val').textContent = e.target.value;
});

document.getElementById('pc-form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('results').classList.remove('hidden');
    // Your component analysis logic goes here
});
