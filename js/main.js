document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION (Placeholder Data) ---
    const placeholderData = {
        "results": [
            { "id": 1022789, "title": "Inside Out 2", "overview": "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who've long been running a successful operation by all accounts, aren't sure how to feel when Anxiety shows up. And it looks like she's not alone.", "poster_path": "https://placehold.co/500x750/141414/E50914?text=Inside+Out+2", "vote_average": 7.7 },
            { "id": 653346, "title": "Kingdom of the Planet of the Apes", "overview": "Several generations in the future following Caesar's reign, apes are now the dominant species and live harmoniously while humans have been reduced to living in the shadows. As a new tyrannical ape leader builds his empire, one young ape undertakes a harrowing journey that will cause him to question all that he has known about the past and to make choices that will define a future for apes and humans alike.", "poster_path": "https://placehold.co/500x750/141414/E50914?text=Planet+of+Apes", "vote_average": 7.2 },
            { "id": 929590, "title": "Twisters", "overview": "As storm season intensifies, Kate Cooper, a former storm chaser haunted by a devastating encounter with a tornado, is lured back to the open plains by her friend, Javi, to test a groundbreaking new tracking system. She soon crosses paths with Tyler Owens, a charming and reckless social media superstar who thrives on posting his storm-chasing adventures.", "poster_path": "https://placehold.co/500x750/141414/E50914?text=Twisters", "vote_average": 7.4 },
            { "id": 748783, "title": "The Garfield Movie", "overview": "Garfield, the world-famous, Monday-hating, lasagna-loving indoor cat, is about to have a wild outdoor adventure! After an unexpected reunion with his long-lost father – scruffy street cat Vic – Garfield and his canine friend Odie are forced from their perfectly pampered life into joining Vic in a hilarious, high-stakes heist.", "poster_path": "https://placehold.co/500x750/141414/E50914?text=Garfield", "vote_average": 7.2 },
            { "id": 519182, "title": "Despicable Me 4", "overview": "Gru and Lucy and their girls — Margo, Edith and Agnes — welcome a new member to the Gru family, Gru Jr., who is intent on tormenting his dad. Meanwhile, Gru faces a new nemesis in Maxime Le Mal and his femme fatale girlfriend Valentina, forcing the family to go on the run.", "poster_path": "https://placehold.co/500x750/141414/E50914?text=Despicable+Me+4", "vote_average": 7.5 },
            { "id": 823464, "title": "Godzilla x Kong: The New Empire", "overview": "Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world, challenging their very existence – and our own.", "poster_path": "https://placehold.co/500x750/141414/E50914?text=Godzilla+x+Kong", "vote_average": 7.2 }
        ]
    };

    // --- DOM ELEMENTS ---
    const searchForm = document.getElementById('search-form');
    const resultsSection = document.getElementById('results-section');
    const modal = document.getElementById('details-modal');
    const modalContent = document.querySelector('.modal-content');

    // --- LIBRARY DATA (from localStorage) ---
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    let completed = JSON.parse(localStorage.getItem('completed')) || [];

    // --- FUNCTIONS ---
    const createMovieRow = (data, rowTitle) => {
        if (data.results && data.results.length > 0) {
            const movieRow = document.createElement('div');
            movieRow.classList.add('movie-row');

            const title = document.createElement('h2');
            title.classList.add('row-title');
            title.textContent = rowTitle;
            movieRow.appendChild(title);

            const rowContent = document.createElement('div');
            rowContent.classList.add('row-content');

            data.results.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                // Use poster_path directly as it's a full URL from the placeholder
                movieCard.innerHTML = `<img src="${movie.poster_path}" alt="${movie.title || movie.name}">`;
                movieCard.addEventListener('click', () => showDetails(movie));
                rowContent.appendChild(movieCard);
            });

            movieRow.appendChild(rowContent);
            resultsSection.appendChild(movieRow);
        }
    };
    
    const showDetails = (movie) => {
        modalContent.innerHTML = `
            <button class="close-modal">&times;</button>
            <div class="modal-poster">
                <img src="${movie.poster_path}" alt="${movie.title || movie.name}">
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
        
        // Find the movie data from our placeholder list
        const movieData = placeholderData.results.find(m => m.id === movieId);
        if (!movieData) return;

        if (e.target.classList.contains('remove')) {
            if (list === 'watchlist') watchlist = watchlist.filter(item => item.id !== movieId);
            if (list === 'completed') completed = completed.filter(item => item.id !== movieId);
        } else {
            // Remove from other list if adding to a new one
            if (list === 'watchlist') completed = completed.filter(item => item.id !== movieId);
            if (list === 'completed') watchlist = watchlist.filter(item => item.id !== movieId);
            
            // Add to the correct list, avoiding duplicates
            if (list === 'watchlist' && !watchlist.some(m => m.id === movieId)) watchlist.push(movieData);
            if (list === 'completed' && !completed.some(m => m.id === movieId)) completed.push(movieData);
        }
        saveLists();
        showDetails(movieData); // Refresh modal
    };

    const saveLists = () => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        localStorage.setItem('completed', JSON.stringify(completed));
    };

    // --- EVENT LISTENERS ---
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Search is disabled in this demo version.');
    });

    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            modal.classList.add('hidden');
        }
    });

    modalContent.addEventListener('click', handleLibraryAction);

    // --- INITIAL LOAD ---
    createMovieRow(placeholderData, 'Popular Movies');
});