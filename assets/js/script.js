/**
 * Event listener for DOMContentLoaded event
 * Initialises the application when the DOM content is finished loading.
 */
document.addEventListener("DOMContentLoaded", () => {
  const firstPage = document.getElementById("first-page");
  const galleryPage = document.getElementById("gallery-page");
  const gamePage = document.getElementById("game-page");
  const successPage = document.getElementById("success-page");
  const chosenImage = document.getElementById("chosen-image");
  const priceElement = document.getElementById("price");
  const totalElement = document.getElementById("total");
  const successSound = document.getElementById("success-sound");
  const toyDescription = document.getElementById("toy-description");
  const feedbackMessage = document.getElementById("feedback-message");
  const successChosenToy = document.getElementById("chosen-toy-image");
  const newGameInstruct = document.getElementById("new-game-instruction");
  const searchInput = document.getElementById("search-query");

  //setting empty vars for price and a purchased items array
  let price = 0;
  let total = 0;
  let purchasedItems = [];

  // Show the first page on load
  showSection("first-page");

  document.querySelector('.navigation-button[href="#gallery-page"]').addEventListener('click', (evt)=> {
    evt.preventDefault();
    showSection("gallery-page");
  })

  document.querySelector('.navigation-button[href="#first-page"]').addEventListener('click', (evt)=> {
    evt.preventDefault();
    showSection("first-page");
  })


/**
 * Event listener for the search bar submission
 * Captures the user input appends 'toy' it and passes it to the searchQueryImage function
 */
  document
    .getElementById("search-bar")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const query = document.getElementById("search-query").value.trim(); //get the user input
      if (query) {
        searchQueryImage(query + " toy"); //append toy to the user search query
      } else {
        document.querySelector(".error").innerHTML = "Please enter a search query";
      }
    });

/**
 * Function to perform a search query using Google Custom Search API
 * @param {string} query - Search query string
 */
  function searchQueryImage(query) {
    const apiKey = "AIzaSyDfW4eFArqNyrreygkdM8GPcDzgneDC_h0";
    const cx = "40e807cc4d6bf4848";
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(
      query
    )}&searchType=image&num=5`;
    //https://developers.google.com/custom-search/v1/introduction -> google custom search docs
    fetch(url) //code to use custom google search and pass the data off to the display images function or if none, display no results
      .then((response) => response.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          const filteredItems = data.items=data.items.filter(item => !purchasedItems.includes(item.link));
          displayImages(data.items); 
          showSection("gallery-page");
        } else {
          displayNoResults();
        }
      })
      .catch((error) => console.error("Fetch error:", error)); //debug
  }

  /**
   * Function to display images in the search result container
   * @param {Array} items - Array of image items from the search results
   */
  function displayImages(items) {
    //runs through the returned json blob and pulls out the image link, title and sets size to 200px
    const resultsContainer = document.getElementById("search-result");
    resultsContainer.innerHTML = "";
    items.forEach((item) => {
      const imgWrapper = document.createElement("div");
      imgWrapper.style.position ="relative";
      const imgElement =document.createElement("img");
      imgElement.src = item.link;
      imgElement.alt = item.title;
      imgElement.style.width = "200px";
      imgElement.addEventListener("click", () => {
        chosenImage.src = item.link;
        price = generateRandomPrice();
        priceElement.textContent = `${price.toFixed(2)}€`;
        total = 0;
        totalElement.textContent = `${total.toFixed(2)}€`;
        imgElement.remove();
        showSection("game-page");
      });
      imgWrapper.appendChild(imgElement);
      resultsContainer.appendChild(imgWrapper);
    });
  }

  /**
   * Function to display a message when no images were found.
   */
  function displayNoResults() {
    const resultsContainer = document.getElementById("gallery-page");
    resultsContainer.innerHTML = "<p>No images found</p>";
  }

  /**
   * Function to show the active section and hide the no active 
   * @param {string} sectionId - The ID of the sectionto be shown
   */
  function showSection(sectionId) {
    firstPage.style.display = "none";
    galleryPage.style.display = "none";
    gamePage.style.display = "none";
    successPage.style.display = "none";
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
      sectionToShow.style.display = "flex";
    } else {
      console.error("section not found", sectionId);
    }
  }
  
  /**
   * Function to generate a number between 0.05 and 5.00 in increments of 0.05
   * @returns {Number} - Random price in range 0.05 - 5.00
   */
  function generateRandomPrice() {
    let maxPrice = 5.0;
    let minPrice = 0.05;
    let steps = (maxPrice - minPrice) / 0.05; //establish range and number of steps between 0.05 and 5
    let randomStep = Math.floor(Math.random() * steps); //make a random increment of steps
    let price = (minPrice + randomStep * 0.05).toFixed(2); //make the step number into a money amount.
    return parseFloat(price);
  }

  /** 
   * Event listeners for coin buttons which update the total
   */
  document.querySelectorAll(".coin").forEach((coin) => {
    coin.addEventListener("click", () => {
      const coinValue = parseFloat(coin.getAttribute("data-value"));
      total += coinValue;
      totalElement.textContent = `${total.toFixed(2)}€`;
    });
  });

  /** 
   * Event listener for the 'give money' button 
   * Provides user feedback on the total amount tendered
   */
  document.getElementById("give-money").addEventListener("click", () => {
    if (total.toFixed(2) === price.toFixed(2)) {
      successSound.play();
      purchasedItems.push(chosenImage.src);
      showSection("success-page");
      successChosenToy.src = chosenImage.src;
      successChosenToy.style.display = "block";
      if (purchasedItems.length >= 5) {
        toyDescription.textContent =
          "You have bought all the toys you searched for! Start a new game and look for another toy!";
        document.getElementById("continue-game").style.display = "none";
        newGameInstruct.style.display="none";
      } else {
        toyDescription.textContent =
          "If you would like to go back to pick another of the toys you just looked for, press the continue button";
        document.getElementById("continue-game").style.display = "block";
        newGameInstruct.style.display="block";
      }
    } else if (total < price) {
      feedbackMessage.textContent =
        "That's not enough I'm afraid, try adding more coins.";
    } else {
      feedbackMessage.textContent =
        "That's too much. Start over and try again.";
    }
  });

  /** 
   * Event listener for the reset button to reset the total and clears the feedback message
   */
  document.getElementById("reset-total").addEventListener("click", () => {
    total = 0;
    totalElement.textContent = `${total.toFixed(2)}€`;
    feedbackMessage.textContent = "";
  });
  /**
   * Event listener for the continue game button to show the gallery page
   */
  document.getElementById("continue-game").addEventListener("click", () => {
    showSection("gallery-page");
  });
  /**
   * Event listener for the new game btton which resets the game state
   */
  document.getElementById("new-game").addEventListener("click", () => {
    purchasedItems=[];
    searchInput.value='';
    showSection("first-page");
  });
});
