getAddHeadings();


function getAddHeadings() {
fetch('http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&sida=1&antalrader=10')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)

        })
        .catch((error) => {
            console.log(error)
	})
}

function sortAddHeadings(data) {

}


/* HERMAN */

function fetchSpecificAd(adID = 7663409) {
    fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${adID}`)
    .then((response) => response.json())
    .then((json) => {
        displaySpecificAd(json);
    })
    .catch((error) => {
        console.log(error);
    });
}

function displaySpecificAd(object) {
    const mainOutput = document.getElementById('mainOutput');
    const 
}

fetchSpecificAd();

/* HERMAN */
