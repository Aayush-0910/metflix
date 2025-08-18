document.addEventListener('DOMContentLoaded', () => {
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    const watchlistGrid = document.getElementById('watchlist-grid');
    const completedGrid = document.getElementById('completed-grid');

    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const completed = JSON.parse(localStorage.getItem('completed')) || [];

    const displayMovies = (movieList, container) => {
        container.innerHTML = '';
        if (movieList.length === 0) {
            container.innerHTML = "<p>No titles in this list yet.</p>";
            return;
        }
        movieList.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title || movie.name}">
                <div class="movie-card-title">${movie.title || movie.name}</div>
            `;
            // Optional: Add click to remove functionality here if desired
            container.appendChild(movieCard);
        });
    };

    displayMovies(watchlist, watchlistGrid);
    displayMovies(completed, completedGrid);
});