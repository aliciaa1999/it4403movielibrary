// === TMDb API Configuration ===
const API_KEY = 'd6b4596de6c29587705b230c6b3f1a64';
const BASE_URL = 'https://api.themoviedb.org/3';

let currentView = 'grid';

$(document).ready(function () {
  // === Initial Load ===
  loadPopularMovies();

  // === Navigation Events ===
  $('#nav-home').click(loadPopularMovies);

  $('#nav-search').click(function () {
    // Search section UI setup
    $('#app').html(`
      <h2>Search Movies</h2>
      <input type="text" id="search-input" placeholder="Enter movie title">
      <button class="btn" id="search-btn">Search</button>
      <div class="view-toggle">
        <button id="grid-view" class="btn">Grid View</button>
        <button id="list-view" class="btn">List View</button>
      </div>
      <div id="search-results" class="movie-container ${currentView}"></div>
    `);

    // Trigger search
    $('#search-btn').click(function () {
      const query = $('#search-input').val();
      searchMovies(query);
    });
  });

  // === View Toggle Events ===
  $(document).on('click', '#grid-view', function () {
    currentView = 'grid';
    $('.movie-container').removeClass('list').addClass('grid');
  });

  $(document).on('click', '#list-view', function () {
    currentView = 'list';
    $('.movie-container').removeClass('grid').addClass('list');
  });

  // === Favorites Navigation ===
  $('#nav-favorites').click(function () {
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    let html = '<h2>Your Favorite Movies</h2>';
    if (favs.length === 0) {
      html += '<p>No favorites yet.</p>';
    } else {
      html += `<div class="movie-container ${currentView}">`;
      favs.forEach(movie => {
        html += `
          <div class="movie-card">
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w200${movie.poster}" alt="${movie.title}">
            <button class="btn remove-fav" data-id="${movie.id}">Remove from Favorites</button>
          </div>
        `;
      });
      html += '</div>';
    }
    $('#app').html(html);
  });

  // === Watchlist Navigation ===
  $('#nav-watchlist').click(function () {
    const list = JSON.parse(localStorage.getItem('watchlist')) || [];
    let html = '<h2>Your Watchlist</h2>';
    if (list.length === 0) {
      html += '<p>No movies in your watchlist yet.</p>';
    } else {
      html += `<div class="movie-container ${currentView}">`;
      list.forEach(movie => {
        html += `
          <div class="movie-card">
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w200${movie.poster}" alt="${movie.title}">
            <button class="btn remove-watch" data-id="${movie.id}">Remove from Watchlist</button>
          </div>
        `;
      });
      html += '</div>';
    }
    $('#app').html(html);
  });

  // === Utility: Return container class ===
  function applyViewClass() {
    return `movie-container ${currentView}`;
  }

  // === Load Popular Movies ===
  function loadPopularMovies(sortBy = 'popularity.desc') {
    const description = `
      <div id="home-description">
        <p>Welcome to <strong>Movie Explorer</strong>! This single-page application allows you to browse, search, and explore movies using The Movie Database (TMDb) API. You can:</p>
        <ul>
          <li>📽️ View trending and popular movies</li>
          <li>🔍 Search for specific movie titles</li>
          <li>❤️ Save favorites</li>
          <li>🎬 Build your personal watchlist</li>
          <li>✨ Explore movie details with poster previews and summaries</li>
        </ul>
        <div class="view-toggle">
          <button id="grid-view" class="btn">Grid View</button>
          <button id="list-view" class="btn">List View</button>
        </div>
      </div>
    `;

    $.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}`, function (data) {
      let html = '<h2>Popular Movies</h2>' + description;
      html += `<div class="${applyViewClass()}">`;
      data.results.forEach(movie => {
        html += `
          <div class="movie-card" data-id="${movie.id}">
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <p>${movie.overview}</p>
            <button class="btn add-fav" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path}">Add to Favorites</button>
            <button class="btn add-watch" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path}">Add to Watchlist</button>
            <button class="btn view-details" data-id="${movie.id}">View Details</button>
          </div>
        `;
      });
      html += '</div>';
      $('#app').html(html);
    });
  }

  // === Search Movies ===
  function searchMovies(query) {
    $.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`, function (data) {
      let html = '';
      data.results.forEach(movie => {
        html += `
          <div class="movie-card" data-id="${movie.id}">
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <p>${movie.overview}</p>
            <button class="btn add-fav" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path}">Add to Favorites</button>
            <button class="btn add-watch" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path}">Add to Watchlist</button>
            <button class="btn view-details" data-id="${movie.id}">View Details</button>
          </div>
        `;
      });
      $('#search-results').html(`<div class="${applyViewClass()}">${html}</div>`);
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

  // === Remove from Favorites ===
  $(document).on('click', '.remove-fav', function () {
    const id = $(this).data('id');
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    favs = favs.filter(m => m.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favs));
    $('#nav-favorites').click();
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

  // === Remove from Watchlist ===
  $(document).on('click', '.remove-watch', function () {
    const id = $(this).data('id');
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(m => m.id !== id);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    $('#nav-watchlist').click();
  });

  // === View Movie Details: Cast and Reviews ===
  $(document).on('click', '.view-details', function () {
    const movieId = $(this).data('id');
    $.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,reviews`, function (movie) {
      let html = `
        <h2>${movie.title}</h2>
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
        <p>${movie.overview}</p>
        <h3>Cast</h3>
        <ul>
      `;
      if (movie.credits && movie.credits.cast) {
        movie.credits.cast.slice(0, 5).forEach(actor => {
          html += `<li><a href="#" class="actor-link" data-id="${actor.id}">${actor.name}</a> as ${actor.character}</li>`;
        });
      } else {
        html += '<li>No cast information available.</li>';
      }
      html += '</ul><h3>Reviews</h3>';
      if (movie.reviews && movie.reviews.results.length > 0) {
        movie.reviews.results.slice(0, 3).forEach(review => {
          html += `<p><strong>${review.author}</strong>: ${review.content.substring(0, 200)}...</p>`;
        });
      } else {
        html += '<p>No reviews available.</p>';
      }
      $('#app').html(html);
    });
  });

  // === View Actor Details ===
  $(document).on('click', '.actor-link', function (e) {
    e.preventDefault();
    const actorId = $(this).data('id');
    $.get(`${BASE_URL}/person/${actorId}?api_key=${API_KEY}`, function (actor) {
      let html = `
        <h2>${actor.name}</h2>
        <img src="https://image.tmdb.org/t/p/w300${actor.profile_path}" alt="${actor.name}">
        <p><strong>Biography:</strong> ${actor.biography || 'No biography available.'}</p>
        <p><strong>Birthday:</strong> ${actor.birthday || 'N/A'}</p>
        <p><strong>Place of Birth:</strong> ${actor.place_of_birth || 'N/A'}</p>
      `;
      $('#app').html(html);
    });
  });
});

