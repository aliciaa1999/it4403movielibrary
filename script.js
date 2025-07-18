// === TMDb API Configuration ===
const API_KEY = 'd6b4596de6c29587705b230c6b3f1a64';
const BASE_URL = 'https://api.themoviedb.org/3';

// === Global Variables ===
let currentView = 'grid';

$(document).ready(function () {
  // === Initial Load ===
  loadPopularMovies();

  // === Navigation Events ===
  $('#nav-home').click(loadPopularMovies);

  $('#nav-search').click(function () {
    // Render Search UI
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

    // Search Handler
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

  // === Utility Function to Apply View Class ===
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
        html += renderMovieCard(movie);
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
        html += renderMovieCard(movie);
      });
      $('#search-results').html(`<div class="${applyViewClass()}">${html}</div>`);
    });
  }

  // === Render Movie Card ===
  function renderMovieCard(movie) {
    return `
      <div class="movie-card" data-id="${movie.id}">
        <h3>${movie.title}</h3>
        <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
        <p>${movie.overview}</p>
        <button class="btn add-fav" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path}">Add to Favorites</button>
        <button class="btn add-watch" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path}">Add to Watchlist</button>
        <button class="btn view-details" data-id="${movie.id}">View Details</button>
      </div>
    `;
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

  // === View Movie Details ===
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

