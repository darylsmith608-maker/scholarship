// 1. Initialize Supabase Correctly
// 'supabase' is the library (from your HTML script tag)
// 'db' is your specific project connection instance
const supabaseUrl = 'https://uckyzrjhnbcjzyxfrhdg.supabase.co';
const supabaseKey = 'sb_publishable_tIncfVSxcUDc6ABeg-yULQ_nDyOt1_u';

const db = supabase.createClient(supabaseUrl, supabaseKey);

// Selectors
const authSection = document.getElementById('auth-section');
const configSection = document.getElementById('config-section');
const signupFields = document.getElementById('signup-fields');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const showLogin = document.getElementById('show-login');
const showSignup = document.getElementById('show-signup');
const headerDesc = document.getElementById('header-desc');

let isSignUpMode = false;

// 2. Toggle Login/Signup UI
showLogin.addEventListener('click', () => {
    isSignUpMode = false; 
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

// 3. Handle Authentication
document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    let result; 
    
    try {
        if (isSignUpMode) {
            // Sign Up Logic
            const fullName = document.getElementById('name').value;
            const phone = document.getElementById('tel').value;

            result = await db.auth.signUp({
                email, 
                password,
                options: { 
                    data: { 
                        full_name: fullName,
                        phone: phone 
                    }
                }
            });
        } else {
            // Login Logic
            result = await db.auth.signInWithPassword({ email, password });
        }

        const { data, error } = result;

        if (error) {
            alert(error.message);
        } else {
            // SUCCESS: Transition UI
            authSection.classList.add('hidden');
            configSection.classList.remove('hidden');
            headerDesc.textContent = "Define your needs. Discover your build.";
            console.log("Success!", data);
        }
    } catch (err) {
        console.error("Critical error:", err);
        alert("An unexpected error occurred.");
    }
});

// 4. PC Form Logic
const budgetRange = document.getElementById('budget-range');
if (budgetRange) {
    budgetRange.addEventListener('input', (e) => {
        const valDisplay = document.getElementById('budget-val');
        if (valDisplay) valDisplay.textContent = e.target.value;
    });
}

const pcForm = document.getElementById('pc-form');
if (pcForm) {
    pcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const resultsSection = document.getElementById('results');
        if (resultsSection) resultsSection.classList.remove('hidden');
    });
}
