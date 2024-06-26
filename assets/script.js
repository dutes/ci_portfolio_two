//event listener for page changes to move through states
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

  let price = 0;
  let total = 0;
  let purchasedItems = [];

  // Initialize to show the first page
  showSection("first-page");

  //search functionality
  document
    .getElementById("search-bar")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const query = document.getElementById("search-query").value; //get the user input
      if (query) {
        searchQueryImage(query + " toy"); //append toy to the user search query
      }
    });

  //function to take user input, form a url, pass it to google and get the images back
  function searchQueryImage(query) {
    const apiKey = "AIzaSyDfW4eFArqNyrreygkdM8GPcDzgneDC_h0";
    const cx = "40e807cc4d6bf4848";
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(
      query
    )}&searchType=image&num=5`;
    //https://developers.google.com/custom-search/v1/introduction -> google custom search docs
    console.log("Fetching URL:", url); //debug output
    fetch(url) //code to use custom google search and pass the data off to the displayimages function or if none, displaynoresults
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received:", data); //debug output
        if (data.items && data.items.length > 0) {
          displayImages(data.items);
          showSection("gallery-page");
        } else {
          displayNoResults();
        }
      })
      .catch((error) => console.error("Fetch error:", error)); //debug
  }

  //function to display images in the search result container
  function displayImages(items) {
    //runs through the returned json blob and pulls out the image link, title and sets size to 200px
    const resultsContainer = document.getElementById("search-result");
    resultsContainer.innerHTML = "";
    items.forEach((item) => {
      console.log("Item:", item); // Debugging: log each item
      const imgWrapper = document.createElement("div");
      imgWrapper.style.position ="relative";
      
      const imgElement =document.createElement("img");
      imgElement.src = item.link;
      imgElement.alt = item.title;
      imgElement.style.width = "200px";
      imgElement.addEventListener("click", () => {
        console.log("image clicked", item.link);
        chosenImage.src = item.link;
        price = generateRandomPrice();
        priceElement.textContent = `${price.toFixed(2)}€`;
        total = 0;
        totalElement.textContent = `${total.toFixed(2)}€`;
        showSection("game-page");
      });
      if (purchasedItems.includes(item.link)) {
        imgElement.classList.add("sold");
        const overlay = document.createElement("div");
        overlay.classList.add("sold-overlay");
        overlay.textContent = "SOLD";
        imgWrapper.appendChild(overlay);
      }
      imgWrapper.appendChild(imgElement);
      resultsContainer.appendChild(imgWrapper);
    });
  }

  //function to output message when no images were found
  function displayNoResults() {
    const resultsContainer = document.getElementById("gallery-page");
    resultsContainer.innerHTML = "<p>No images found</p>";
  }

  //function to show the active section
  function showSection(sectionId) {
    console.log("trying to load", sectionId);
    firstPage.style.display = "none";
    galleryPage.style.display = "none";
    gamePage.style.display = "none";
    successPage.style.display = "none";
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
      sectionToShow.style.display = "flex";
      console.log("Section shown:", sectionId);
    } else {
      console.error("section not found", sectionId);
    }
  }

  function generateRandomPrice() {
    const coinValues = [0.05, 0.1, 0.2, 0.5, 1.0, 2.0];
    let maxPrice = 5.0;
    let minPrice = 0.05;
    let steps = (maxPrice - minPrice) / 0.05; //establish range and number of steps between 0.05 and 5
    let randomStep = Math.floor(Math.random() * steps); //make a random increment of steps
    let price = (minPrice + randomStep * 0.05).toFixed(2); //make the step number into a money amount.
    return parseFloat(price);
  }

  //coin button event listener total sum
  document.querySelectorAll(".coin").forEach((coin) => {
    coin.addEventListener("click", () => {
      const coinValue = parseFloat(coin.getAttribute("data-value"));
      total += coinValue;
      totalElement.textContent = `${total.toFixed(2)}€`;
    });
  });

  //submit button event listener (give-money). Feeback on over or under
  document.getElementById("give-money").addEventListener("click", () => {
    if (total.toFixed(2) === price.toFixed(2)) {
      successSound.play();
      showSection("success-page");
      successChosenToy.src = chosenImage.src;
      successChosenToy.style.display = "block";
      purchasedItems.push(chosenImage.src);
      console.log(purchasedItems);
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

  //reset button
  document.getElementById("reset-total").addEventListener("click", () => {
    total = 0;
    totalElement.textContent = `${total.toFixed(2)}€`;
    feedbackMessage.textContent = "";
  });

  document.getElementById("continue-game").addEventListener("click", () => {
    showSection("gallery-page");
  });

  document.getElementById("new-game").addEventListener("click", () => {
    purchasedItems=[];
    searchInput.value='';
    showSection("first-page");
  });
});
