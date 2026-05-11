// Initialize Supabase
const supabaseUrl = 'https://uckyzrjhnbcjzyxfrhdg.supabase.co;
const supabaseKey = 'sb_publishable_tIncfVSxcUDc6ABeg-yULQ_nDyOt1_u'
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const signupFields = document.getElementById('signup-fields');
const submitBtn = document.getElementById('submit-btn');
let isSignUp = true;

// Toggle between Sign Up and Login
document.getElementById('show-login').addEventListener('click', () => {
    isSignUp = false;
    signupFields.classList.add('hidden');
    submitBtn.textContent = "Login";
    document.getElementById('show-login').classList.add('active');
    document.getElementById('show-signup').classList.remove('active');
});

document.getElementById('show-signup').addEventListener('click', () => {
    isSignUp = true;
    signupFields.classList.remove('hidden');
    submitBtn.textContent = "Sign Up & Analyze";
    document.getElementById('show-signup').classList.add('active');
    document.getElementById('show-login').classList.remove('active');
});

// Update Budget Label
document.getElementById('budget-range').addEventListener('input', (e) => {
    document.getElementById('budget-val').textContent = e.target.value;
});

// Handle Form Submission
document.getElementById('pc-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    if (isSignUp) {
        // Sign Up Logic
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: document.getElementById('name').value,
                    phone: document.getElementById('tel').value
                }
            }
        });
        if (error) alert(error.message);
        else alert("Check your email for confirmation!");
    } else {
        // Login Logic
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) alert(error.message);
        else alert("Welcome back!");
    }
});
