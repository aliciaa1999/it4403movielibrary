// Replace with your actual TMDb API key
const API_KEY = 'd6b4596de6c29587705b230c6b3f1a64';
const BASE_URL = 'https://api.themoviedb.org/3';

$(document).ready(function () {
  // Load popular movies by default
  loadPopularMovies();

  $('#nav-home').click(function () {
    loadPopularMovies();
  });

  $('#nav-search').click(function () {
    $('#app').html(`
      <h2>Search Movies</h2>
      <input type="text" id="search-input" placeholder="Enter movie title">
      <button class="btn" id="search-btn">Search</button>
      <div id="search-results"></div>
    `);

    $('#search-btn').click(function () {
      const query = $('#search-input').val();
      searchMovies(query);
    });
  });

  function loadPopularMovies() {
    let description = `
      <p>Welcome to Movie Explorer! This single-page application allows users to discover, search, and explore movies and TV shows using The Movie Database (TMDb) API. Browse popular titles, view detailed information, learn more about your favorite actors, and manage your personalized favorites and watchlist — all from one seamless interface.</p>
    `;

    $.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`, function (data) {
      let html = '<h2>Popular Movies</h2>' + description;
      data.results.forEach(movie => {
        html += `
          <div class="movie-card">
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <p>${movie.overview}</p>
          </div>
        `;
      });
      $('#app').html(html);
    });
  }

  function searchMovies(query) {
    $.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`, function (data) {
      let html = '<h2>Search Results</h2>';
      data.results.forEach(movie => {
        html += `
          <div class="movie-card">
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <p>${movie.overview}</p>
          </div>
        `;
      });
      $('#search-results').html(html);
    });
  }
});

