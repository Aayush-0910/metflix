document.addEventListener('DOMContentLoaded', () => {
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
            // In the demo version, poster_path is the full URL
            movieCard.innerHTML = `
                <img src="${movie.poster_path}" alt="${movie.title || movie.name}">
            `;
            // In a full version, you might want a click event to show details or remove
            container.appendChild(movieCard);
        });
    };

    displayMovies(watchlist, watchlistGrid);
    displayMovies(completed, completedGrid);
});