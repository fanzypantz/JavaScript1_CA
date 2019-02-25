// refer to question 1 before development starts for scope document
// connect to this api https://api.magicthegathering.io/v1/cards


(function () {
    const cardContainer = document.querySelector('#cards');
    const loadingBar = document.querySelector('.loading');
    let isCreatingCards = false;

    let createCards = function (json) {
        if ( json.length > 0 ) { // Found some cards with the criteria
            for (let i = 0; i < json.length; i++) {
                // Check if the card is missing anything
                let card = json[i];
                if ( card.imageUrl == null && card.variations != null ) {
                    let originalCard = json.find(function (findCard) { // fix the special card imageUrl by finding the original variant
                        return findCard.id === card.variations[0]; // Use the variation id to filter the cards
                    });
                    card.imageUrl = originalCard.imageUrl;
                } else if ( card.imageUrl == null && card.variations == null ) {
                    delete json[card]; // remove card if there is no way to find a picture
                    continue;
                }

                // Produce the html and add it to the DOM
                let template = `
                        <div class="col-sm-4">
                            <div class="card-container">
                                <h4>${card.number} - ${card.name}</h4>
                                <img src="${card.imageUrl}" width="100%">
                                <a href="card-specific.html?id=${card.id}" class="btn btn-success">View More</a>
                            </div>
                        </div>
                    `;
                cardContainer.innerHTML += template;
            }
            isCreatingCards = false;
            loadingBar.style.display = 'none';
        } else { // Didn't find anything with that criteria
            displayErrors(['Nothing matches the given search query']);
        }
    };

    let searchQuery = function (event) {
        let value = document.querySelector('#search').value;
        if ( !isCreatingCards && event.key === 'Enter' || event.button === 0 ) {
            let fetchUrl = null;
            isCreatingCards = true;
            loadingBar.style.display = 'block';
            cardContainer.innerHTML = '';

            // Create url and fetch the data
            if ( isNaN(value) ) { // change the api url based on whether or not it's a number or string
                fetchUrl = `https://api.magicthegathering.io/v1/cards?name=${value}`
            } else {
                fetchUrl = `https://api.magicthegathering.io/v1/cards?number=${value}`
            }
            fetch(fetchUrl)
                .then(function(response) {
                    return response.json();
                })
                .then(function (json) {
                    createCards(json.cards);
                })
                .catch(function (errors) {
                    console.log(errors);
                    displayErrors(errors);
                });
        }
    };

    let displayErrors = function (errors) {
        // Produce the html and add it to the DOM
        for (let i = 0; i < errors.length; i++) {
            let template = `
                <div class="col-sm-11">
                    <div class="card-container">
                        <h4>${errors[i]}</h4>
                    </div>
                </div>
            `;
            cardContainer.innerHTML += template;
        }
        isCreatingCards = false;
        loadingBar.style.display = 'none';
    };

    document.querySelector('#search').addEventListener("keyup", searchQuery);
    document.querySelector('#searchButton').addEventListener("click", searchQuery);
    document.querySelector('#searchButton').click(); // instead of redundant fetch function

    // return {
    //     searchQuery: searchQuery,
    //     createCards: createCards
    // }
})();



