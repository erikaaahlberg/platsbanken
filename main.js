if (!location.search.split('jobAd=')[1]) {
    getAdHeadings();
}


function getAdHeadings() {
fetch('http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&sida=1&antalrader=10')
        .then((response) => response.json())
        .then((adHeadings) => {
            console.log(adHeadings)
			displayAdHeading(adHeadings);
        })
        .catch((error) => {
            console.log(error)
	})
}


function displayAdHeading(adHeadings) {
   	const headingOutput = document.getElementById('headingOutput');
    const totalJobs = `<h2>${adHeadings.matchningslista.antal_platsannonser}</h2>`;
    headingOutput.innerHTML = totalJobs;

	for(let i = 0; i < adHeadings.matchningslista.matchningdata.length; i++){
    const adHeadingContainer = `
        <div id="adContainer">
            <h2>${adHeadings.matchningslista.matchningdata[i].annonsrubrik}</h2>
            <p>Arbetsplats: ${adHeadings.matchningslista.matchningdata[i].arbetsplatsnamn}</p>
            <p>Kommun: ${adHeadings.matchningslista.matchningdata[i].kommunnamn}</p>
            <p>Sista ansökningsdag: ${adHeadings.matchningslista.matchningdata[i].sista_ansokningsdag}</p>
            <p>Yrke: ${adHeadings.matchningslista.matchningdata[i].yrkesbenamning}</p>
            <p>Anställningstyp: ${adHeadings.matchningslista.matchningdata[i].anstallningstyp}</p>
            <p>Läs mer: <a href="?jobAd=${adHeadings.matchningslista.matchningdata[i].annonsid}">HÄR</a></p>
        </div>
    `;
    headingOutput.insertAdjacentHTML('beforeend', adHeadingContainer);
    
	}
    
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

if (location.search.split('jobAd=')[1]) {
    getAdFromURL()
}


/* HERMAN */
