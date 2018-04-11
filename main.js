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

function fetchSpecificAd(adID) {
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
    console.log(object);
    const mainOutput = document.getElementById('mainOutput');
    const adContainer = `
        <div id="adContainer">
            <h2>Rubrik: ${object.platsannons.annons.annonsrubrik}</h2>
            <p>Beskrivning: ${object.platsannons.annons.annonstext}</p>
            <p>Yrkesbenämning: ${object.platsannons.annons.yrkesbenamning}</p>
            <p>Antal platser: ${object.platsannons.annons.antal_platser}</p>
            <p>Ort: ${object.platsannons.annons.kommunnamn}</p>
            <p>Sista ansökningsdag: ${object.platsannons.ansokan.sista_ansokningsdag}</p>
            <p>Hemsida: ${object.platsannons.ansokan.webbplats}</p>
            <p>Arbetsplats: ${object.platsannons.arbetsplats.arbetsplatsnamn}</p>
            <p>Omfattning: ${object.platsannons.villkor.arbetstid}</p>
            <p>Lön: ${object.platsannons.villkor.lonetyp}</p>
            <p>Dela: ${window.location.href}</p>
        </div>
    `;
    mainOutput.innerHTML = adContainer;
}

function getAdFromURL() {
    const url = location.search.split('jobAd=')[1];
    fetchSpecificAd(url);
}

getAdFromURL();

/* HERMAN */
