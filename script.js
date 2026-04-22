document.addEventListener('DOMContentLoaded', () => {
    const budgetSlider = document.getElementById('budget-range');
    const budgetVal = document.getElementById('budget-val');
    const generateBtn = document.getElementById('generate-btn');
    const resultsArea = document.getElementById('results');
    const componentList = document.getElementById('component-list');

    // Update budget display in real-time (UX: Immediate Feedback)
    budgetSlider.addEventListener('input', (e) => {
        budgetVal.textContent = e.target.value;
    });

    generateBtn.addEventListener('click', () => {
        const budget = parseInt(budgetSlider.value);
        const useCase = document.getElementById('use-case').value;
        
        // Define budget allocation ratios based on research
        let allocation = {
            "CPU": 0.25,
            "GPU": 0.35,
            "RAM/Storage": 0.20,
            "Case/PSU/Mobo": 0.20
        };

        // Adjust logic for office use (less GPU, more storage/CPU)
        if (useCase === 'office') {
            allocation.GPU = 0.10;
            allocation.CPU = 0.40;
            allocation["Case/PSU/Mobo"] = 0.30;
            allocation["RAM/Storage"] = 0.20;
        }

        renderResults(budget, allocation);
    });

    function renderResults(total, ratios) {
        componentList.innerHTML = '';
        for (const [part, ratio] of Object.entries(ratios)) {
            const price = (total * ratio).toFixed(2);
            const item = document.createElement('div');
            item.className = 'component-item';
            item.innerHTML = `<span>${part}</span> <strong>$${price}</strong>`;
            componentList.appendChild(item);
        }
        resultsArea.classList.remove('hidden');
        resultsArea.scrollIntoView({ behavior: 'smooth' });
    }
});
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseKey = https://fzrbnyshfzseclbmmchj.supabase.co/rest/v1/
const supabase = createClient(supabaseUrl, supabaseKey)
async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')

  if (error) {
    console.error('Error fetching data:', error)
  } else {
    console.log('Your Data:', data)
    // Map this data to your HTML/UI here
  }
}document.addEventListener('DOMContentLoaded', async () => {
  const { data: posts } = await supabase.from('posts').select('*')
  
  const container = document.getElementById('api-content')
  posts.forEach(post => {
    const el = document.createElement('div')
    el.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`
    container.appendChild(el)
  })
})
