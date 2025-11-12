const apiKey = "";

const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const gifImage = document.getElementById('gifImage');

async function fetchSearchedGif() {
    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
        gifImage.alt = "Proszę wpisać frazę do wyszukania.";
        gifImage.src = "";
        return; 
    }

    gifImage.src = "";
    gifImage.alt = "Ładowanie GIF-a...";

    const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(searchTerm)}&limit=1&rating=g`;

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Błąd sieci: ${response.status}`);
        }

        const json = await response.json();
        
        console.log(json); 

        if (json.data && json.data.length > 0) {
            const gifUrl = json.data[0].images.downsized_large.url;
            gifImage.src = gifUrl;
            gifImage.alt = `GIF dla frazy: ${searchTerm}`;
        } else {
            gifImage.src = "";
            gifImage.alt = "Nie znaleziono GIF-ów dla tej frazy.";
        }

    } catch (error) {
        console.error("Nie udało się pobrać GIF-a:", error);
        gifImage.alt = "Wystąpił błąd podczas ładowania GIF-a. Spróbuj ponownie.";
    }
}

searchButton.addEventListener('click', fetchSearchedGif);

searchInput.addEventListener('keyup', (event) => {
    if (event.key === "Enter") {
        fetchSearchedGif();
    }
});