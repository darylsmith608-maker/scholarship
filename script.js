// 1. Initialize Supabase Correctly
const supabaseUrl = 'https://uckyzrjhnbcjzyxfrhdg.supabase.co';
const supabaseKey = 'sb_publishable_tIncfVSxcUDc6ABeg-yULQ_nDyOt1_u';

// FIX: Change 'const supabase' to 'const supabaseClient' 
// to avoid colliding with the global 'supabase' object from the CDN
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

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

            // FIX: Use supabaseClient here
            result = await supabaseClient.auth.signUp({
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
            // Login Logic - FIX: Use supabaseClient here
            result = await supabaseClient.auth.signInWithPassword({ email, password });
        }

        const { data, error } = result;

        if (error) {
            alert(error.message);
        } else {
            authSection.classList.add('hidden');
            configSection.classList.remove('hidden');
            headerDesc.textContent = "Define your needs. Discover your build.";
            console.log("Auth success:", data);
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        alert("An unexpected error occurred.");
    }
});

// 4. PC Form Logic
const budgetRange = document.getElementById('budget-range');
if (budgetRange) {
    budgetRange.addEventListener('input', (e) => {
        document.getElementById('budget-val').textContent = e.target.value;
    });
}

document.getElementById('pc-form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('results').classList.remove('hidden');
});
