const API_URL = "https://www.thesportsdb.com/api/v1/json/123/";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchFeedback = document.getElementById("searchFeedback");
const results = document.getElementById("results");
const searchForm = document.getElementById("searchForm");
const teamDetails = document.getElementById("teamDetails");
const emptyResults = document.getElementById("emptyResults");
const favoritesContainer = document.getElementById("favorites");
const emptyFavorites = document.getElementById("emptyFavorites");

// CONTROLLER RICHIESTE API
let searchController;

// RECUPERO PREFERITI DAL LOCALSTORAGE
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// SALVATAGGIO PREFERITI NEL LOCALSTORAGE
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

async function searchTeams() {
  const searchTerm = searchInput.value.trim();

  if (searchTerm === "") {
    return;
  }

  try {
    if (searchController) {
      searchController.abort();
    }

    searchController = new AbortController();

    // MOSTRA SPINNER DI CARICAMENTO
    searchFeedback.replaceChildren();

    const spinner = document.createElement("div");
    const spinnerIcon = document.createElement("div");
    const spinnerText = document.createElement("span");

    spinner.className = "d-flex align-items-center gap-2";
    spinnerIcon.className = "spinner-border spinner-border-sm text-primary";
    spinnerText.textContent = "Caricamento in corso...";

    spinner.appendChild(spinnerIcon);
    spinner.appendChild(spinnerText);

    searchFeedback.appendChild(spinner);

    // PULIZIA RISULTATI PRECEDENTI
    results.replaceChildren();
    emptyResults.classList.add("d-none");
    teamDetails.replaceChildren();
    teamDetails.classList.add("d-none");

    // RICHIESTA API
    const response = await fetch(`${API_URL}searchteams.php?t=${searchTerm}`, {
      signal: searchController.signal,
    });

    const data = await response.json();

    // ATTESA MINIMA DELLO SPINNER
    await new Promise(function (resolve) {
      setTimeout(resolve, 400);
    });

    // NASCONDI SPINNER
    searchFeedback.replaceChildren();

    results.replaceChildren();
    emptyResults.classList.add("d-none");

    if (data.teams === null) {
      emptyResults.textContent =
        "Nessuna squadra trovata. Prova con un altro nome.";
      emptyResults.classList.remove("d-none");
      return;
    }

    data.teams.forEach(function (team) {
      const teamCard = createTeamCard(team);

      results.appendChild(teamCard);
    });
  } catch (error) {
    if (error.name !== "AbortError") {

        // MOSTRA ALERT DI ERRORE
        searchFeedback.replaceChildren();

        const errorAlert = document.createElement("div");

        errorAlert.className = "alert alert-danger";
        errorAlert.textContent = "Si è verificato un errore durante la ricerca. Riprova.";

        searchFeedback.appendChild(errorAlert);

        console.error("Errore:", error);
    }
}
}

function createTeamCard(team, isFavorite = false) {
  // CREAZIONE ELEMENTI
  const col = document.createElement("div");
  const card = document.createElement("div");
  const cardBody = document.createElement("div");
  const badge = document.createElement("img");
  const name = document.createElement("h5");
  const league = document.createElement("p");
  const country = document.createElement("p");
  const favoriteButton = document.createElement("button");

  // CLASSI BOOTSTRAP
  col.className = "col";
  card.className = "card h-100 text-center shadow-sm team-card";
  cardBody.className = "card-body";
  badge.className = "mb-3";
  badge.width = 100;
  badge.height = 100;
  name.className = "card-title fw-bold";
  league.className = "text-secondary mb-1";
  country.className = "text-secondary";
  favoriteButton.className = "btn btn-outline-primary w-100 mt-3";
  if (isFavorite) {
    favoriteButton.className = "btn btn-danger w-100 mt-3";
    favoriteButton.textContent = "Rimuovi dai preferiti";
  } else {
    favoriteButton.textContent = "Aggiungi ai preferiti";
  }
  favoriteButton.type = "button";

  // EVENT LISTENER PREFERITI
  favoriteButton.addEventListener("click", function (e) {
    e.stopPropagation();

    if (isFavorite) {
      removeFavorite(team);
    } else {
      addFavorite(team);
    }
  });

  // INSERIMENTO DATI
  badge.src = team.strBadge;
  badge.alt = team.strTeam;

  name.textContent = team.strTeam;
  league.textContent = team.strLeague;
  country.textContent = team.strCountry;

  //   CLICK DELLA CARD
  card.addEventListener("click", function () {
    loadTeamEvents(team);
  });

  // ASSEMBLAGGIO ELEMENTI
  cardBody.appendChild(badge);
  cardBody.appendChild(name);
  cardBody.appendChild(league);
  cardBody.appendChild(country);
  cardBody.appendChild(favoriteButton);

  card.appendChild(cardBody);
  col.appendChild(card);

  return col;
}

// AGGIUNTA SQUADRA AI PREFERITI
function addFavorite(team) {
  const alreadyFavorite = favorites.some(function (favorite) {
    return favorite.idTeam === team.idTeam;
  });

  if (alreadyFavorite) {
    return;
  }

  favorites.push(team);

  saveFavorites();

  renderFavorites();
}

// VISUALIZZAZIONE DEI PREFERITI
function renderFavorites() {
  favoritesContainer.replaceChildren();

  emptyFavorites.classList.toggle("d-none", favorites.length > 0);

  favorites.forEach(function (team) {
    const teamCard = createTeamCard(team, true);
    favoritesContainer.appendChild(teamCard);
  });
}

// RIMOZIONE SQUADRA DAI PREFERITI
function removeFavorite(team) {
  favorites = favorites.filter(function (favorite) {
    return favorite.idTeam !== team.idTeam;
  });

  saveFavorites();

  renderFavorites();
}

async function loadTeamEvents(team) {
  const teamId = team.idTeam;

  try {
    const nextResponse = await fetch(`${API_URL}eventsnext.php?id=${teamId}`);
    const nextData = await nextResponse.json();
    const lastResponse = await fetch(`${API_URL}eventslast.php?id=${teamId}`);
    const lastData = await lastResponse.json();

    teamDetails.replaceChildren();
    teamDetails.classList.remove("d-none");

    const teamTitle = document.createElement("h3");
    teamTitle.className = "fw-bold mb-3";
    teamTitle.textContent = team.strTeam;

    const eventsContainer = document.createElement("div");
    eventsContainer.className = "row g-3";

    const lastEventContainer = document.createElement("div");
    lastEventContainer.className = "col-12 col-md-6";

    const nextEventContainer = document.createElement("div");
    nextEventContainer.className = "col-12 col-md-6";

    eventsContainer.appendChild(lastEventContainer);
    eventsContainer.appendChild(nextEventContainer);

    teamDetails.appendChild(teamTitle);
    teamDetails.appendChild(eventsContainer);

    if (lastData.results !== null) {
      const lastEventCard = createEventCard(
        lastData.results[0],
        "Ultima partita",
      );
      lastEventContainer.appendChild(lastEventCard);
    }

    if (nextData.events !== null) {
      const nextEventCard = createEventCard(
        nextData.events[0],
        "Prossima partita",
      );
      nextEventContainer.appendChild(nextEventCard);
    }
  } catch (error) {
    console.error("Errore:", error);
  }
}

function createEventCard(event, title) {
  // CREAZIONE ELEMENTI
  const card = document.createElement("div");
  const cardBody = document.createElement("div");
  const heading = document.createElement("h5");
  const eventName = document.createElement("h6");
  const homeTeam = document.createElement("p");
  const awayTeam = document.createElement("p");
  const eventDate = document.createElement("p");
  const score = document.createElement("h4");

  // CLASSI BOOTSTRAP
  card.className = "card h-100 shadow-sm";
  cardBody.className = "card-body text-center";
  heading.className = "fw-bold mb-3";
  eventName.className = "fw-semibold";
  homeTeam.className = "mb-1";
  awayTeam.className = "mb-1";
  eventDate.className = "text-secondary mt-3";
  score.className = "fw-bold my-3";

  // INSERIMENTO DATI
  heading.textContent = title;
  eventName.textContent = event.strEvent;
  homeTeam.textContent = event.strHomeTeam;
  awayTeam.textContent = event.strAwayTeam;
  eventDate.textContent = event.dateEvent;
  if (event.intHomeScore !== null && event.intAwayScore !== null) {
    score.textContent = `${event.intHomeScore} - ${event.intAwayScore}`;
  }

  // ASSEMBLAGGIO ELEMENTI
  cardBody.appendChild(heading);
  cardBody.appendChild(eventName);
  cardBody.appendChild(homeTeam);
  cardBody.appendChild(awayTeam);
  cardBody.appendChild(eventDate);
  card.appendChild(cardBody);
  cardBody.appendChild(score);

  return card;
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  searchTeams();
});

renderFavorites();
