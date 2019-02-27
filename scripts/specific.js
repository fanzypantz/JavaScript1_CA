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

        console.log('Fetched card', card);
        if ( !card.hasOwnProperty('imageUrl') && card.hasOwnProperty('variations') ) { // fix the different structure with missing info by getting the normal card version

            console.log('Has no imageUrl');
            fetch(`https://api.magicthegathering.io/v1/cards/${card.variations[0]}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function (json) {
                    if ( json.card.hasOwnProperty('imageUrl') ) {
                        console.log('Got old card', json.card);
                        card.imageUrl = json.card.imageUrl;
                    } else {
                        console.log("Didn't find old card");
                        card.imageUrl = './images/placeholder.png';
                    }
                })
                .catch(function (errors) {
                    console.log(errors);
                });
        } else if ( !card.hasOwnProperty('imageUrl') && !card.hasOwnProperty('variations') ){
            console.log('Has no imageUrl or variations');
            console.log("Didn't find old card or image");
            card.imageUrl = './images/placeholder.png';
        }
        createCard(card);
    })
.catch(function (errors) {
    console.log(errors);
});

let createCard = function (card) {
    document.querySelector('.loading').style.display = 'none';
    document.querySelector('#card').innerHTML = `
        <div class="row">
            <div class="col-sm-3" id="cardImage">
                <img src="${card.imageUrl}" width="100%">
            </div>
            <div class="col-sm-9" id="cardDetails">
                <h2>${card.name}</h2>
                <div><b>About:  </b>${card.text}</div>
                <div><b>Rarity: </b>${card.rarity}</div>
                <div><b>Color: </b>${card.colors[0]}</div>
            </div>
        </div>
    `; // FIX TEXT INCASE THERE IS NO TEXT

};




