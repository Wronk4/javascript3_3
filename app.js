const apiKey = ""; 

const endpoint = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&rating=g`;

const gifButton = document.getElementById('gifButton');
const gifImage = document.getElementById('gifImage');

async function fetchRandomGif() {
    gifImage.src = "";
    gifImage.alt = "Ładowanie GIF-a...";

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Błąd sieci: ${response.status}`);
        }

        const json = await response.json();
        
        console.log(json); 

        const gifUrl = json.data.images.downsized_large.url;

        gifImage.src = gifUrl;
        gifImage.alt = "Losowy GIF";

    } catch (error) {
        console.error("Nie udało się pobrać GIF-a:", error);
        gifImage.alt = "Wystąpił błąd podczas ładowania GIF-a. Spróbuj ponownie.";
    }
}

gifButton.addEventListener('click', fetchRandomGif);

fetchRandomGif();