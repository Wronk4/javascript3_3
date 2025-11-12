const apiKey = "";

const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const gifContainer = document.getElementById('gifContainer');

const paginationContainer = document.getElementById('paginationContainer');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const pageInfo = document.getElementById('pageInfo');

let currentSearchTerm = "";
let currentOffset = 0;
const limit = 12;
let totalResults = 0;

async function fetchGifs(searchTerm, offset) {
    if (searchTerm.trim() === "") {
        gifContainer.innerHTML = "<p>Proszę wpisać frazę do wyszukania.</p>";
        paginationContainer.style.display = 'none';
        return;
    }

    gifContainer.innerHTML = "<p>Ładowanie GIF-ów...</p>";
    paginationContainer.style.display = 'none';

    currentSearchTerm = searchTerm;
    currentOffset = offset;

    const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(searchTerm)}&limit=${limit}&offset=${offset}&rating=g`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Błąd sieci: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

        totalResults = json.pagination.total_count;

        displayGifs(json.data);
        updatePaginationUI();

    } catch (error) {
        console.error("Nie udało się pobrać GIF-ów:", error);
        gifContainer.innerHTML = "<p>Wystąpił błąd podczas ładowania. Spróbuj ponownie.</p>";
        paginationContainer.style.display = 'none';
    }
}

function displayGifs(gifs) {
    gifContainer.innerHTML = "";

    if (gifs.length === 0) {
        gifContainer.innerHTML = "<p>Nie znaleziono GIF-ów dla tej frazy.</p>";
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';

    gifs.forEach(gif => {
        const img = document.createElement('img');
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title || "GIF";
        gifContainer.appendChild(img);
    });
}

function updatePaginationUI() {
    const currentPage = Math.floor(currentOffset / limit) + 1;
    pageInfo.textContent = `Strona: ${currentPage}`;

    prevButton.disabled = (currentOffset === 0);

    nextButton.disabled = (currentOffset + limit >= totalResults);
}

searchButton.addEventListener('click', () => {
    fetchGifs(searchInput.value, 0);
});

searchInput.addEventListener('keyup', (event) => {
    if (event.key === "Enter") {
        fetchGifs(searchInput.value, 0);
    }
});

nextButton.addEventListener('click', () => {
    fetchGifs(currentSearchTerm, currentOffset + limit);
});

prevButton.addEventListener('click', () => {
    const newOffset = Math.max(0, currentOffset - limit);
    fetchGifs(currentSearchTerm, newOffset);
});

paginationContainer.style.display = 'none';