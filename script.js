document.addEventListener('DOMContentLoaded', () => {
    const talkData = [
        {
            id: 'talk1',
            title: 'The Future of WebAssembly in Cloud',
            speakers: ['Dr. Anya Sharma'],
            category: ['Cloud', 'WebAssembly', 'Performance'],
            duration: 60,
            description: 'Explore the exciting advancements of WebAssembly beyond the browser, focusing on its role in serverless functions and edge computing within cloud environments. We will cover real-world use cases and future predictions.'
        },
        {
            id: 'talk2',
            title: 'Demystifying AI in Frontend Development',
            speakers: ['Ben Carter', 'Sophia Lee'],
            category: ['AI', 'Frontend', 'JavaScript'],
            duration: 60,
            description: 'Dive into practical applications of Artificial Intelligence that are revolutionizing frontend development. Learn how AI-powered tools and techniques can enhance user experience, automate design processes, and personalize content delivery.'
        },
        {
            id: 'talk3',
            title: 'Scaling Microservices with Kubernetes: Best Practices',
            speakers: ['Carlos Rodriguez'],
            category: ['Development', 'Cloud', 'Kubernetes'],
            duration: 60,
            description: 'This session provides an in-depth look at scaling microservices effectively using Kubernetes. We will cover architectural patterns, deployment strategies, and troubleshooting tips to ensure high availability and performance.'
        },
        {
            id: 'talk4',
            title: 'Data Mesh vs. Data Lakehouse: Choosing the Right Architecture',
            speakers: ['Emily Chen'],
            category: ['Data', 'Architecture'],
            duration: 60,
            description: 'Understand the fundamental differences and trade-offs between Data Mesh and Data Lakehouse architectures. This talk will guide you through selecting the optimal data strategy for your organization's needs and challenges.'
        },
        {
            id: 'talk5',
            title: 'Advanced State Management in React with XState',
            speakers: ['David Kim'],
            category: ['Frontend', 'JavaScript', 'Development'],
            duration: 60,
            description: 'Master complex application states in React using XState, a powerful state machine library. Learn how to model intricate user flows, manage async operations, and build resilient and predictable UIs with confidence.'
        },
        {
            id: 'talk6',
            title: 'Ethical AI: Building Responsible Machine Learning Systems',
            speakers: ['Grace Hopper', 'Alan Turing'],
            category: ['AI', 'Ethics', 'Data'],
            duration: 60,
            description: 'A critical discussion on the principles and practices of building ethical AI systems. We will explore bias detection, fairness metrics, interpretability, and the societal impact of artificial intelligence.'
        }
    ];

    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('searchInput');
    const categoryFiltersContainer = document.querySelector('.category-filters');
    const resetFilterButton = document.getElementById('resetFilterButton');

    let currentFilters = [];

    // Helper to format time
    const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Function to generate the full schedule with calculated times
    const generateSchedule = (talks) => {
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

        const fullSchedule = [];

        talks.forEach((talk, index) => {
            // Add talk to schedule
            talk.startTime = formatTime(currentTime);
            currentTime.setMinutes(currentTime.getMinutes() + talk.duration);
            talk.endTime = formatTime(currentTime);
            fullSchedule.push(talk);

            // Add transition after each talk except the last one
            if (index < talks.length - 1) {
                currentTime.setMinutes(currentTime.getMinutes() + 10); // 10 min transition
            }

            // Insert lunch break after the 3rd talk
            if (index === 2) {
                const lunchStartTime = new Date(currentTime);
                currentTime.setMinutes(currentTime.getMinutes() + 60); // 1 hour lunch
                fullSchedule.push({
                    id: 'lunch',
                    title: 'Lunch Break',
                    startTime: formatTime(lunchStartTime),
                    endTime: formatTime(currentTime),
                    isBreak: true
                });
            }
        });
        return fullSchedule;
    };

    const fullSchedule = generateSchedule(talkData);

    // Function to render the schedule
    const renderSchedule = (scheduleToRender) => {
        scheduleContainer.innerHTML = ''; // Clear previous schedule
        scheduleToRender.forEach(item => {
            if (item.isBreak) {
                const lunchDiv = document.createElement('div');
                lunchDiv.classList.add('lunch-break');
                lunchDiv.innerHTML = `
                    <span>${item.startTime} - ${item.endTime}</span>
                    <h3>${item.title}</h3>
                `;
                scheduleContainer.appendChild(lunchDiv);
            } else {
                const talkDiv = document.createElement('div');
                talkDiv.classList.add('talk-card');
                talkDiv.id = item.id;
                item.category.forEach(cat => talkDiv.classList.add(`category-${cat.replace(/\s/g, '')}`)); // Add category class
                talkDiv.innerHTML = `
                    <span class="talk-time">${item.startTime} - ${item.endTime}</span>
                    <h3 class="talk-title">${item.title}</h3>
                    <p class="talk-speakers">${item.speakers.join(' and ')}</p>
                    <div class="talk-categories">
                        ${item.category.map(cat => `<span class="talk-category">${cat}</span>`).join('')}
                    </div>
                    <p class="talk-description">${item.description}</p>
                `;
                scheduleContainer.appendChild(talkDiv);
            }
        });
    };

    // Function to get unique categories and render filter buttons
    const renderCategoryFilters = () => {
        const allCategories = new Set();
        talkData.forEach(talk => {
            talk.category.forEach(cat => allCategories.add(cat));
        });

        categoryFiltersContainer.innerHTML = '';
        allCategories.forEach(category => {
            const button = document.createElement('button');
            button.classList.add('category-button');
            button.textContent = category;
            button.dataset.category = category;
            button.addEventListener('click', () => {
                toggleCategoryFilter(category);
                applyFilters();
            });
            categoryFiltersContainer.appendChild(button);
        });
    };

    const toggleCategoryFilter = (category) => {
        const index = currentFilters.indexOf(category);
        if (index > -1) {
            currentFilters.splice(index, 1); // Remove filter
            document.querySelector(`.category-button[data-category="${category}"]`).classList.remove('active');
        } else {
            currentFilters.push(category); // Add filter
            document.querySelector(`.category-button[data-category="${category}"]`).classList.add('active');
        }
    };

    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const talkCards = document.querySelectorAll('.talk-card');

        talkCards.forEach(card => {
            const categories = Array.from(card.querySelectorAll('.talk-category')).map(span => span.textContent.toLowerCase());
            const matchesCategoryFilter = currentFilters.length === 0 || currentFilters.some(filter => categories.includes(filter.toLowerCase()));
            const matchesSearchTerm = searchTerm === '' || categories.some(cat => cat.includes(searchTerm));

            if (matchesCategoryFilter && matchesSearchTerm) {
                card.classList.remove('filtered');
            } else {
                card.classList.add('filtered');
            }
        });
    };

    // Event Listeners
    searchInput.addEventListener('keyup', applyFilters);
    resetFilterButton.addEventListener('click', () => {
        searchInput.value = '';
        currentFilters = [];
        document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
        applyFilters();
    });

    // Initial render
    renderSchedule(fullSchedule);
    renderCategoryFilters();
});
