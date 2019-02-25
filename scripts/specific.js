// refer to question 2 before development starts for scope document
// get URL query string
function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
// variable for the id
var id = getQueryStringValue("id");


fetch(`https://api.magicthegathering.io/v1/cards/${id}`)
    .then(function(response) {
        return response.json();
    })
    .then(function (json) {
        let card = json.card;
        console.log('Current card', card);

        if (card.imageUrl == null) { // fix the different structure with missing info by getting the normal card version
            fetch(`https://api.magicthegathering.io/v1/cards/${card.variations[0]}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function (json) {
                    console.log('Fetched original card', json.card);
                    card.imageUrl = json.card.imageUrl;
                    createCard(card);
                })
                .catch(function (errors) {
                    console.log(errors);
                });
        } else {
            createCard(card);
        }


    })
    .catch(function (errors) {
        console.log(errors);
    });

let createCard = function (card) {
    document.querySelector('#card').innerHTML = `
        <div class="row">
            <div class="col-sm-3" id="cardImage">
                <img src="${card.imageUrl}" width="100%">
            </div>
            <div class="col-sm-9" id="cardDetails">
                <h2>${card.name}</h2>
                <div><b>About:  </b>${card.text}</div>
                <div><b>Rarity: </b>${card.rarity}</div>
                <div><b>Color: </b>${card.color}</div>
            </div>
        </div>
    `;
};




