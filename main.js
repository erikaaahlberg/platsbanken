getAdHeadings();


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
	for(let i = 0; i < adHeadings.matchningslista.matchningdata.length; i++){
    const adHeadingContainer = `
        <div id="adContainer">
            <h2>${adHeadings.matchningslista.matchningdata[i].annonsrubrik}</h2>
            <p>Arbetsplats: ${adHeadings.matchningslista.matchningdata[i].arbetsplatsnamn}</p>
            <p>Kommun: ${adHeadings.matchningslista.matchningdata[i].kommunnamn}</p>
            <p>Sista ansökningsdag: ${adHeadings.matchningslista.matchningdata[i].sista_ansokningsdag}</p>
            <p>Yrke: ${adHeadings.matchningslista.matchningdata[i].yrkesbenamning}</p>
            <p>Anställningstyp: ${adHeadings.matchningslista.matchningdata[i].anstallningstyp}</p>
            <p>Läs mer: ${adHeadings.matchningslista.matchningdata[i].annonsid}</p>
        </div>
    `;
    headingOutput.insertAdjacentHTML('beforeend', adHeadingContainer);
	}
}

