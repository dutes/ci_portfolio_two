//event listener on the search bar ID to get the user input
document.getElementById('search-bar').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('search-query').value; //get the user input
    if (query) {
        searchQueryImage(query + ' toy'); //append toy to the user search query
    }
});

//function to take user input, form a url, pass it to google and get the images back
function searchQueryImage(query) {
    const apiKey = 'AIzaSyDfW4eFArqNyrreygkdM8GPcDzgneDC_h0';
    const cx = '40e807cc4d6bf4848';
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image`; 
    //https://developers.google.com/custom-search/v1/introduction -> google custom search docs

    console.log('Fetching URL:', url); //debug output

    fetch(url) //code to use custom google search and pass the data off to the displayimages function or if none, displaynoresults
        .then(response => response.json())
        .then(data => {
            console.log('Data received:', data); //debug output
            if (data.items && data.items.length > 0) {
                displayImages(data.items);
            } else {
                displayNoResults();
            }
        })
        .catch(error => console.error('Fetch error:', error)); //debug
}

//function to display images in the search result container
function displayImages(items) {//runs through the returned json blob and pulls out the image link, title and sets size to 200px
    const resultsContainer = document.getElementById('search-result');
    resultsContainer.innerHTML = ''; 

    items.forEach(item => {
        console.log('Item:', item); // Debugging: log each item
        const imgElement = document.createElement('img');
        imgElement.src = item.link;
        imgElement.alt = item.title;
        imgElement.style.width='200px';
        resultsContainer.appendChild(imgElement);       
    });
}

//function to output message when no images were found
function displayNoResults() {
    const resultsContainer = document.getElementById('seaerch-results');
    resultsContainer.innerHTML = '<p>No images found</p>';
}