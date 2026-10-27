
const config = window.BLUEFLIX_CONFIG;

const grid = document.getElementById("movieGrid");
const search = document.getElementById("searchInput");
const empty = document.getElementById("emptyState");

let movies = [];
let activeFilter = "All";

const genreNames = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

const classics = [
  {
    title: "His Girl Friday",
    year: "1940",
    genre: "Comedy",
    description: "A fast-talking newsroom comedy classic.",
    poster: "",
    archive: "https://archive.org/details/his_girl_friday"
  },
  {
    title: "The General",
    year: "1926",
    genre: "Comedy",
    description: "A legendary silent-era comedy starring Buster Keaton.",
    poster: "",
    archive: "https://archive.org/details/TheGeneral1926"
  },
  {
    title: "A Trip to the Moon",
    year: "1902",
    genre: "Sci-Fi",
    description: "A pioneering fantasy film from early cinema.",
    poster: "",
    archive: "https://archive.org/details/LeVoyagedanslaLune"
  },
  {
    title: "Charade",
    year: "1963",
    genre: "Mystery",
    description: "A stylish mystery with romance and suspense.",
    poster: "",
    archive: "https://archive.org/details/Charade1963"
  },
  {
    title: "Detour",
    year: "1945",
    genre: "Drama",
    description: "An atmospheric film-noir classic.",
    poster: "",
    archive: "https://archive.org/details/Detour1945"
  },
  {
    title: "The Cabinet of Dr. Caligari",
    year: "1920",
    genre: "Horror",
    description: "A landmark of German expressionist cinema.",
    poster: "",
    archive: "https://archive.org/details/TheCabinetOfDrCaligari"
  }
];

function renderMovies() {
  if (!grid || !search || !empty) return;

  const query = search.value.trim().toLowerCase();

  const filtered = movies.filter(movie => {
    const matchesFilter =
      activeFilter === "All" || movie.genre === activeFilter;

    const matchesSearch =
      movie.title.toLowerCase().includes(query) ||
      movie.year.includes(query) ||
      movie.genre.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  grid.innerHTML = filtered.map(movie => `
    <article class="movie-card">
      <div class="poster" style="--poster-glow:#1d77b5">
        ${
          movie.poster
            ? `<img src="${movie.poster}" alt="${movie.title} poster"
                 loading="lazy"
                 style="width:100%;height:100%;object-fit:cover;">`
            : `<div class="poster-title">${movie.title}</div>`
        }
        <span class="poster-year">${movie.year}</span>
      </div>

      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p class="movie-desc">
          ${movie.description || "Discover this movie on BlueFlix."}
        </p>

        <div class="card-bottom">
          <span class="tag">${movie.genre}</span>
          ${
            movie.archive
              ? `<a class="download-link"
                   href="${movie.archive}"
                   target="_blank"
                   rel="noopener noreferrer">VIEW ARCHIVE ↗</a>`
              : `<span class="tag">MOVIE INFO</span>`
          }
        </div>
      </div>
    </article>
  `).join("");

  empty.hidden = filtered.length > 0;
}

async function loadMovies() {
  const supabaseFunctionUrl =
    "https://zpyarlytclxwmctedpzs.supabase.co/functions/v1/quick-worker";

  const paths = [
    "trending/movie/week",
    "movie/popular",
    "movie/now_playing"
  ];

  try {
    const results = await Promise.all(
      paths.map(async path => {
        const url = new URL(supabaseFunctionUrl);
        url.searchParams.set("path", path);
        url.searchParams.set("language", "en-US");

        if (path === "movie/now_playing") {
          url.searchParams.set("region", "IN");
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Movie API error: ${response.status}`);
        }

        return response.json();
      })
    );

    const uniqueMovies = new Map();

    results.forEach(result => {
      (result.results || []).forEach(movie => {
        uniqueMovies.set(movie.id, movie);
      });
    });

    const tmdbMovies = Array.from(uniqueMovies.values()).map(movie => ({
      title: movie.title || movie.original_title || "Untitled",
      year: (movie.release_date || "").slice(0, 4),
      genre:
        (movie.genre_ids || [])
          .map(id => genreNames[id])
          .find(Boolean) || "Drama",
      description: movie.overview || "Movie details are not available.",
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",
      archive: ""
    }));

    movies = [...tmdbMovies, ...classics];
    renderMovies();

    console.log("BlueFlix movies loaded:", movies.length);
    console.log("TMDB movies:", tmdbMovies.length, "| Classics:", classics.length);
  } catch (error) {
    console.error("Could not load TMDB movies:", error);

    movies = [...classics];
    renderMovies();
  }
}

if (search) {
  search.addEventListener("input", renderMovies);
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    activeFilter = button.dataset.filter || "All";
    renderMovies();
  });
});

loadMovies();