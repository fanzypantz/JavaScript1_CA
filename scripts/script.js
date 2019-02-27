// refer to question 1 before development starts for scope document
// connect to this api https://api.magicthegathering.io/v1/cards


let myCards = (function () {

    const cardContainer = document.querySelector('#cards');
    const loadingBar = document.querySelector('.loading');
    let isCreatingCards = false;
    let jsonObject = {};

    let createCards = function () {
        if ( jsonObject.length > 0 ) { // Found some cards with the criteria
            let card = {};
            let innerHtml = ``;
            let template = ``;

            for (let i = 0; i < jsonObject.length; i++) {
                // Get card and fix the imageUrl of the card
                card = fixCard(jsonObject[i]);

                // Produce the html and add it to the DOM
                template = `
                    <div class="col-sm-4">
                        <div class="card-container">
                            <h4>${card.number} - ${card.name}</h4>
                            <img class="card-image" src="${card.imageUrl}" width="100%">
                            <a href="card-specific.html?id=${card.id}" class="btn btn-success">View More</a>
                        </div>
                    </div>
                `;
                innerHtml += template;
            }
            // Append data to HTML
            cardContainer.innerHTML = innerHtml;
        } else { // Didn't find anything with that criteria
            displayErrors(['Nothing matches the given search query']);
        }
    };

    let fixCard = function (card) {
        let originalCard = {};

        if ( !card.hasOwnProperty('imageUrl') && card.hasOwnProperty('variations') ) {
            for (let j = 0; j < card.variations.length; j++) {
                originalCard = jsonObject.find(function (findCard) { // fix the special card imageUrl by finding the original variant
                    return findCard.id === card.variations[j]; // Use the variation id to filter the cards
                });
                // Insert the placeholder card if the original card version has image
                if ( originalCard != null && originalCard.hasOwnProperty('imageUrl') ) {
                    card.imageUrl = originalCard.imageUrl;
                    break;
                }
            }
            // If there was no card with a imageUrl in variations insert placeholder
            if ( !card.hasOwnProperty('imageUrl' ) ) {
                card.imageUrl = './images/placeholder.png';
            }

        } else if ( !card.hasOwnProperty('imageUrl') && !card.hasOwnProperty('variations') ) {
            card.imageUrl = './images/placeholder.png';
        }
        return card;
    };

    let searchQuery = function (event) {
        if ( !isCreatingCards && event.key === 'Enter' || event.button === 0 ) {
            // Remove cards and lock any new searches from coming trough, start search animation
            let value = document.querySelector('#search').value;
            isCreatingCards = true;
            loadingBar.style.display = 'block';
            cardContainer.innerHTML = '';
            initCards(value);
        }
    };

    let fetchCards = function (value) {
        return new Promise(function (resolve, reject) {
            let fetchUrl = ``;

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
                    resolve(json.cards);
                })
                .catch(function (errors) {
                    reject(errors);
                });
        });

    };

    let initCards = function (value) {
        // Create url and fetch the data
        fetchCards(value).then(function (cardsArray) {
            jsonObject = cardsArray;
            createCards();
            isCreatingCards = false;
            loadingBar.style.display = 'none';
        }).catch(function (errors) {
            displayErrors(errors);
        });
    };

    let displayErrors = function (errors) {
        // Produce the html and add it to the DOM
        let innerHtml = ``;
        let template = ``;

        for (let i = 0; i < errors.length; i++) {
            template = `
                <div class="col-sm-11">
                    <div class="card-container">
                        <h4>${errors[i]}</h4>
                    </div>
                </div>
            `;
            innerHtml += template;
        }
        cardContainer.innerHTML = innerHtml;
        isCreatingCards = false;
        loadingBar.style.display = 'none';
    };

    document.querySelector('#search').addEventListener("keyup", searchQuery);
    document.querySelector('#searchButton').addEventListener("click", searchQuery);

    return {
        initCards: initCards
    }
})();

myCards.initCards(''); // Initialize cards for the first time



