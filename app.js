document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Logic
    const navItems = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    let currentUser = "Sarah";

    const titles = {
        'dashboard': { title: `Good Morning, ${currentUser}`, subtitle: 'Here is your daily wellness AI summary.' },
        'cycle': { title: 'Cycle Tracker', subtitle: 'Understand your biological rhythm.' },
        'pregnancy': { title: 'Pregnancy Journey', subtitle: 'Track your baby\'s development week by week.' },
        'pcos': { title: 'PCOS Monitor', subtitle: 'Manage symptoms and understand your patterns.' },
        'ai-insights': { title: 'Aura AI Assistant', subtitle: 'Your personal health intelligence.' },
        'settings': { title: 'Settings', subtitle: 'Manage your Aura profile.' },
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all nav
            navItems.forEach(n => n.classList.remove('active'));
            // Add active to clicked nav
            item.classList.add('active');

            // Hide all sections
            sections.forEach(s => s.classList.remove('active'));
            
            // Show target section
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            // Update Headers
            if(titles[targetId]) {
                pageTitle.textContent = titles[targetId].title;
                pageSubtitle.textContent = titles[targetId].subtitle;
            }
        });
    });

    // 1.5. Onboarding Logic
    const onboardingForm = document.getElementById('onboarding-form');
    const onboardingScreen = document.getElementById('onboarding');
    const mainApp = document.getElementById('main-app');
    const profileName = document.getElementById('profile-name');
    const profileImg = document.getElementById('profile-img');
    const greetingName = document.getElementById('greeting-name');

    onboardingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get user data
        const name = document.getElementById('user-name').value;
        const goal = document.getElementById('user-goal').value;
        const cycleLength = document.getElementById('cycle-length').value;

        // Update UI Context
        currentUser = name;
        titles['dashboard'].title = `Good Morning, ${name}`;
        
        // Update DOM
        profileName.textContent = name;
        greetingName.textContent = name;
        profileImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffd1dc&color=b56576`;
        
        // Navigate to dashboard
        navItems.forEach(n => n.classList.remove('active'));
        document.querySelector('[data-target="dashboard"]').classList.add('active');
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById('dashboard').classList.add('active');
        pageTitle.innerHTML = `Good Morning, <span id="greeting-name">${name}</span>`;
        pageSubtitle.textContent = titles['dashboard'].subtitle;

        // Custom Dashboard Context Updating
        const statusTitle = document.getElementById('status-card-title');
        const statusMainValue = document.getElementById('status-main-value');
        const statusSubValue = document.getElementById('status-sub-value');
        const statusFooterText = document.getElementById('status-footer-text');
        const aiInsightText = document.getElementById('ai-insight-text');
        const chatWrapper = document.getElementById('chat-wrapper');

        const addAiMessage = (msg) => {
            const aiDiv = document.createElement('div');
            aiDiv.className = 'chat-bubble ai';
            aiDiv.innerHTML = msg;
            chatWrapper.appendChild(aiDiv);
        };

        if (goal === 'cycle') {
            statusTitle.textContent = 'Current Cycle';
            statusMainValue.textContent = 'Day 1';
            statusSubValue.textContent = 'Menstrual Phase';
            statusFooterText.innerHTML = `Next Period in <strong>${cycleLength} days</strong>`;
            aiInsightText.innerHTML = `Welcome to day 1 of your cycle. It's totally normal to feel a bit tired today. Prioritize rest and hydration.`;
            chatWrapper.innerHTML = '';
            addAiMessage(`Hello ${name}! I'm tracking your ${cycleLength}-day cycle. How are you feeling on day 1?`);
        } else if (goal === 'pregnancy') {
            statusTitle.textContent = 'Pregnancy Journey';
            statusMainValue.textContent = 'Week 4';
            statusSubValue.textContent = 'Trimester 1';
            statusFooterText.innerHTML = `Estimated Due Date: <strong>Calculated</strong>`;
            aiInsightText.innerHTML = `You are in your first trimester. Ensure you are taking your prenatal vitamins and getting plenty of rest.`;
            chatWrapper.innerHTML = '';
            addAiMessage(`Hello ${name}! Congratulations on your pregnancy journey. I am here to aid you and track your baby's development. What can I help with today?`);
        } else if (goal === 'pcos') {
            statusTitle.textContent = 'PCOS Monitor';
            statusMainValue.textContent = 'Tracking Logs';
            statusSubValue.textContent = 'Symptom Phase';
            statusFooterText.innerHTML = `Cycle length varies`;
            aiInsightText.innerHTML = `Tracking daily symptoms is key for PCOS management. Don't forget to log your mood, diet, and any specific symptoms today.`;
            chatWrapper.innerHTML = '';
            addAiMessage(`Hello ${name}! Managing PCOS can be challenging, but tracking symptoms helps. Have you logged anything today?`);
        }

        // Hide onboarding, show app
        onboardingScreen.style.display = 'none';
        mainApp.style.display = 'flex';
        
        // Also pre-fill the settings update box with the current cycle length
        document.getElementById('update-cycle-val').value = cycleLength;
    });

    // 1.8 Logout & Reset Logic
    const performLogout = () => {
        onboardingForm.reset();
        document.getElementById('chat-wrapper').innerHTML = ''; // Clear chat history
        mainApp.style.display = 'none';
        onboardingScreen.style.display = 'flex';
    };

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', performLogout);

    const topbarLogoutBtn = document.getElementById('topbar-logout-btn');
    if (topbarLogoutBtn) topbarLogoutBtn.addEventListener('click', performLogout);

    // 1.9 Update Menstrual Value Logic
    const updateCycleBtn = document.getElementById('update-cycle-btn');
    const updateCycleVal = document.getElementById('update-cycle-val');
    updateCycleBtn.addEventListener('click', () => {
        const newVal = updateCycleVal.value;
        if(newVal && newVal > 0) {
            const currentGoal = document.getElementById('user-goal').value;
            // Also update the original onboarding input so the data stays consistent
            document.getElementById('cycle-length').value = newVal;

            if (currentGoal === 'cycle') {
                document.getElementById('status-footer-text').innerHTML = `Next Period in <strong>${newVal} days</strong>`;
                alert(`Successfully updated menstrual cycle length to ${newVal} days.`);
            } else {
                alert(`Cycle length updated to ${newVal} days in your profile.`);
            }
        } else {
            alert('Please enter a valid number of days.');
        }
    });

    // 2. Modal Logic for Symptom Logging
    const logBtn = document.getElementById('log-symptom-btn');
    const modal = document.getElementById('symptom-modal');
    const closeBtn = document.querySelector('.close-modal');
    const saveBtn = document.getElementById('save-log-btn');
    const chips = document.querySelectorAll('.chip');

    logBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.classList.remove('active');
        }
    });

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('selected');
        });
    });

    saveBtn.addEventListener('click', () => {
        // Collect selected symptoms
        const selected = Array.from(document.querySelectorAll('.chip.selected')).map(c => c.textContent);
        if(selected.length > 0) {
            alert(`Logged: ${selected.join(', ')}. AI is analyzing your data...`);
        }
        modal.classList.remove('active');
        // Reset chips
        chips.forEach(c => c.classList.remove('selected'));
    });

    // 3. AI Chat Simulation
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat');
    const chatWrapper = document.getElementById('chat-wrapper');

    function sendChatMessage() {
        const text = chatInput.value.trim();
        if(!text) return;

        // User message
        const userDiv = document.createElement('div');
        userDiv.className = 'chat-bubble user';
        userDiv.textContent = text;
        chatWrapper.appendChild(userDiv);

        chatInput.value = '';
        chatWrapper.scrollTop = chatWrapper.scrollHeight;

        // Simulate AI thinking and response
        setTimeout(() => {
            const aiDiv = document.createElement('div');
            aiDiv.className = 'chat-bubble ai';
            
            // Basic keyword responses
            if(text.toLowerCase().includes('pcos')) {
                aiDiv.textContent = 'For PCOS management, maintaining stable blood sugar through a balanced diet with low glycemic index foods can help manage symptoms like fatigue and irregular cycles. Have you tracked your symptoms today?';
            } else if (text.toLowerCase().includes('pregnancy')) {
                aiDiv.textContent = 'During the first trimester, fatigue is very common due to rising progesterone levels. Ensure you are taking your prenatal vitamins and resting when needed.';
            } else {
                aiDiv.textContent = 'Based on your cycle data, that is completely normal for this phase. I suggest staying well-hydrated and practicing light stretching. How is your mood today?';
            }

            chatWrapper.appendChild(aiDiv);
            chatWrapper.scrollTop = chatWrapper.scrollHeight;
        }, 1000);
    }

    sendBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendChatMessage();
    });

});
