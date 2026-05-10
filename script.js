// 1.Initialize Supabase
const supabaseUrl = 'https://uckyzrjhnbcjzyxfrhdg.supabase.co';
const supabaseKey = 'sb_publishable_tIncfVSxcUDc6ABeg-yULQ_nDyOt1_u';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const authSection = document.getElementById('auth-section');
const configSection = document.getElementById('config-section');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authMessage = document.getElementById('auth-message');
const budgetRange = document.getElementById('budget-range');
const budgetVal = document.getElementById('budget-val');

// Update Budget Display
budgetRange.addEventListener('input', (e) => {
    budgetVal.textContent = e.target.value;
});

// 2. Register Function
document.getElementById('register-btn').addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        authMessage.textContent = error.message;
    } else {
        authMessage.textContent = "Registration successful! Please check your email to verify.";
        authMessage.style.color = "green";
    }
});

// 3. Login Function
document.getElementById('login-btn').addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        authMessage.textContent = error.message;
    } else {
        authMessage.textContent = "";
        checkUser(); // Update UI
    }
});

// 4. Logout Function
document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    checkUser(); // Update UI
});

// 5. Check User Session & Update UI
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        // User is logged in: Hide auth, show configurator
        authSection.classList.add('hidden');
        configSection.classList.remove('hidden');
    } else {
        // User is logged out: Show auth, hide configurator
        authSection.classList.remove('hidden');
        configSection.classList.add('hidden');
    }
}

// Run on page load
checkUser();
