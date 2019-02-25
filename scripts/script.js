// refer to question 1 before development starts for scope document
// connect to this api https://api.magicthegathering.io/v1/cards


let myCards = (function () {

    const cardContainer = document.querySelector('#cards');
    let cardsObject = null;
    let isCreatingCards = false;

    fetch('https://api.magicthegathering.io/v1/cards')
        .then(function(response) {
            return response.json();
        })
        .then(function (json) {
            cardsObject = json.cards;
            createCards(cardsObject);
        })
        .catch(function (errors) {
            console.log(errors);
        });

    let createCards = function (cards) {
        cardContainer.innerHTML = '';
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];

            if (card.imageUrl == null) {
                let originalCard = cards.find(function (findCard) { // fix the special card imageUrl by finding the original variant
                    return findCard.id === card.variations[0]
                });
                card.imageUrl = originalCard.imageUrl;
            }

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
    };

    let filterCards = function (searchQuery) {
        return cardsObject.filter(function (card) {
            let name = card.name.toLowerCase();
            return name.includes(searchQuery.toLowerCase());
        });
    };

    let searchQuery = function () {
        let value = document.querySelector('#search').value;

        if ( !isCreatingCards ) {
            isCreatingCards = true;
            let cards = filterCards(value);

            // console.log(value, cards);
            createCards(cards);
        }

    };

    document.querySelector('#search').addEventListener("keyup", searchQuery);
    document.querySelector('#searchButton').addEventListener("click", searchQuery);

    // return {
    //     createCards: createCards,
    //     filterCards: filterCards
    // }
})();

