
//event listener for page changes to move through states
document.addEventListener('DOMContentLoaded', () => {
    const firstPage = document.getElementById('first-page');
    const gamePage = document.getElementById('game-page');
    const successPage = document.getElementById('success-page');
    const chosenImage = document.createElement('img');
    chosenImage.classList.add('chosenImage');
    successPage.appendChild(chosenImage);


 // Initialize to show the first page
    showSection('first-page');

//search functionality
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
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image&num=5`; 
    //https://developers.google.com/custom-search/v1/introduction -> google custom search docs

    console.log('Fetching URL:', url); //debug output

    fetch(url) //code to use custom google search and pass the data off to the displayimages function or if none, displaynoresults
        .then(response => response.json())
        .then(data => {
            console.log('Data received:', data); //debug output
            if (data.items && data.items.length > 0) {
                displayImages(data.items);
                showSection('game-page');
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
        imgElement.addEventListener('click', () => {
            console.log('image clicked', item.link);
            chosenImage.src=item.link;
            showSection('success-page');
        })
        resultsContainer.appendChild(imgElement);       
    });
}

//function to output message when no images were found
function displayNoResults() {
    const resultsContainer = document.getElementById('seaerch-results');
    resultsContainer.innerHTML = '<p>No images found</p>';
}
//function to show the active section
function showSection(sectionId) {
    console.log('trying to load', sectionId);
    firstPage.style.display = 'none';
    gamePage.style.display = 'none';
    successPage.style.display = 'none';

    const sectionToShow=document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.style.display='flex';
        console.log('Section shown:', sectionId);
    } else {
        console.error('section not found', sectionId);
    }
}


});
