document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const API_KEY = 'YOUR_TMDB_API_KEY'; // <-- IMPORTANT: ADD YOUR KEY HERE
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    // --- DOM ELEMENTS ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsGrid = document.getElementById('results-grid');
    const modal = document.getElementById('details-modal');
    const modalContent = document.querySelector('.modal-content');

    // --- LIBRARY DATA (from localStorage) ---
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    let completed = JSON.parse(localStorage.getItem('completed')) || [];

    // --- FUNCTIONS ---
    const fetchAndDisplay = async (url, container) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            container.innerHTML = ''; // Clear previous results
            
            data.results.forEach(movie => {
                if (!movie.poster_path) return; // Skip items without posters

                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.innerHTML = `
                    <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title || movie.name}">
                    <div class="movie-card-title">${movie.title || movie.name}</div>
                `;
                movieCard.addEventListener('click', () => showDetails(movie));
                container.appendChild(movieCard);
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    const showDetails = (movie) => {
        modalContent.innerHTML = `
            <button class="close-modal">&times;</button>
            <div class="modal-poster">
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title || movie.name}">
            </div>
            <div class="modal-details">
                <h2>${movie.title || movie.name}</h2>
                <p>${movie.overview}</p>
                <p><strong>Rating:</strong> <span class="rating">${movie.vote_average.toFixed(1)} / 10</span></p>
                <div class="watchlist-btns">
                    ${getWatchlistButtons(movie.id)}
                </div>
            </div>
        `;
        modal.classList.remove('hidden');
        document.querySelector('.close-modal').addEventListener('click', () => modal.classList.add('hidden'));
    };

    const getWatchlistButtons = (movieId) => {
        const onWatchlist = watchlist.some(item => item.id === movieId);
        const onCompleted = completed.some(item => item.id === movieId);

        if (onWatchlist) {
            return `<button class="remove" data-id="${movieId}" data-list="watchlist">Remove from Watchlist</button>`;
        }
        if (onCompleted) {
            return `<button class="remove" data-id="${movieId}" data-list="completed">Remove from Completed</button>`;
        }
        return `
            <button data-id="${movieId}" data-list="watchlist">Add to Watchlist</button>
            <button data-id="${movieId}" data-list="completed">Add to Completed</button>
        `;
    };

    const handleLibraryAction = (e) => {
        if (e.target.tagName !== 'BUTTON') return;

        const movieId = parseInt(e.target.dataset.id);
        const list = e.target.dataset.list;
        
        if (e.target.classList.contains('remove')) {
            // Remove logic
            if (list === 'watchlist') watchlist = watchlist.filter(item => item.id !== movieId);
            if (list === 'completed') completed = completed.filter(item => item.id !== movieId);
        } else {
            // Add logic
            fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
                .then(res => res.json())
                .then(movieData => {
                    if (list === 'watchlist') watchlist.push(movieData);
                    if (list === 'completed') completed.push(movieData);
                    saveLists();
                    showDetails(movieData); // Refresh modal buttons
                });
        }
        saveLists();
        e.target.parentElement.innerHTML = getWatchlistButtons(movieId);
    };

    const saveLists = () => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        localStorage.setItem('completed', JSON.stringify(completed));
    };

    // --- EVENT LISTENERS ---
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            const searchURL = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`;
            fetchAndDisplay(searchURL, resultsGrid);
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            modal.classList.add('hidden');
        }
    });

    modalContent.addEventListener('click', handleLibraryAction);

    // --- INITIAL LOAD ---
    const trendingURL = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`;
    fetchAndDisplay(trendingURL, resultsGrid);
});