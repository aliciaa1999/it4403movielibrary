// === TMDb API Configuration ===
const API_KEY = 'd6b4596de6c29587705b230c6b3f1a64';
const BASE_URL = 'https://api.themoviedb.org/3';

$(document).ready(function () {
  // === Initial Load ===
  loadPopularMovies();

  // === Navigation Events ===
  $('#nav-home').click(loadPopularMovies);

  $('#nav-search').click(function () {
    // Render search input and button
    $('#app').html(`
      <h2>Search Movies</h2>
      <input type="text" id="search-input" placeholder="Enter movie title">
      <button class="btn" id="search-btn">Search</button>
      <div id="search-results"></div>
    `);

    // Search button click event
    $('#search-btn').click(function () {
      const query = $('#search-input').val();
      searchMovies(query);
    });
  });

  $('#nav-favorites').click(function () {
    // Load and display favorites from localStorage
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    let html = '<h2>Your Favorite Movies</h2>';
    if (favs.length === 0) {
      html += '<p>No favorites yet.</p>';
    } else {
      favs.forEach(movie => {
        html += `
          <div class="movie-card">
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w200${movie.poster}" alt="${movie.title}">
          </div>
        `;
      });
    }
    $('#app').html(html);
  });

  $('#nav-watchlist').click(function () {
    // Load and display watchlist from localStorage
    const list = JSON.parse(localStorage.getItem('watchlist')) || [];
    let html = '<h2>Your Watchlist</h2>';
    if (list.length === 0) {
      html += '<p>No movies in your watchlist yet.</p>';
    } else {
      list.forEach(movie => {
        html += `
          <div class="movie-card">
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w200${movie.poster}" alt="${movie.title}">
          </div>
        `;
      });
    }
    $('#app').html(html);
  });

  // === Load Popular Movies ===
  function loadPopularMovies() {
    const description = `
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
            <button class="btn add-fav" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path}">Add to Favorites</button>
            <button class="btn add-watch" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path}">Add to Watchlist</button>
          </div>
        `;
      });
      $('#app').html(html);
    });
  }

  // === Search Movies ===
  function searchMovies(query) {
    $.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`, function (data) {
      let html = '<h2>Search Results</h2>';
      data.results.forEach(movie => {
        html += `
          <div class="movie-card">
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <p>${movie.overview}</p>
            <button class="btn add-fav" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path}">Add to Favorites</button>
            <button class="btn add-watch" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path}">Add to Watchlist</button>
          </div>
        `;
      });
      $('#search-results').html(html);
    });
  }

  // === Add to Favorites ===
  $(document).on('click', '.add-fav', function () {
    const movie = {
      id: $(this).data('id'),
      title: $(this).data('title'),
      poster: $(this).data('poster')
    };
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favs.find(m => m.id === movie.id)) {
      favs.push(movie);
      localStorage.setItem('favorites', JSON.stringify(favs));
      alert('Added to Favorites');
    }
  });

  // === Add to Watchlist ===
  $(document).on('click', '.add-watch', function () {
    const movie = {
      id: $(this).data('id'),
      title: $(this).data('title'),
      poster: $(this).data('poster')
    };
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.find(m => m.id === movie.id)) {
      watchlist.push(movie);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      alert('Added to Watchlist');
    }
  });
});


