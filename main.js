//Global variables
//let savedAds = [];
const showSavedAdsButton = document.getElementById('showSavedAds');
const searchButton = document.getElementById('searchButton');
let currentPage = 1;
let searchParams = {lanid: '1', antalrader: '10', yrkesomradeid: '', sida: '1'};

if (!location.search.split('jobAd=')[1]) {
    fetchAdHeadings();
}

function fetchAdHeadings() {
fetch('http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&sida=1&antalrader=10')
        .then((response) => response.json())
        .then((adHeadings) => {
			displayAdHeading(adHeadings);
        })
        .catch((error) => {
            console.log(error)
	})
}
/*-------erika--------- */
function fetchSearchList (searchParameter) {
    return fetch(`http://api.arbetsformedlingen.se/af/v0/arbetsformedling/soklista/${searchParameter}`)
        .then((response) => response.json())
            .then((searchList) => {
                return searchList;
            })
                .catch((error) => {
                    console.log(error);
                })
}

function fetchCountySearchList () {
    fetchSearchList('lan').then((searchList) => {
        for (lan of searchList.soklista.sokdata) {
            createOptionForSelector(lan.id, lan.namn, 'selectCounty');
            const countySelector = document.getElementById('selectCounty');
            countySelector.addEventListener('change', function() {
                const selectedCountyId = getSelectedValue(countySelector);
                fetchBySearchParameter(`lanid=${selectedCountyId}`, 10).then((ads) => {
                displayAdHeading(ads);
                searchParams.lanid = selectedCountyId;
                });
            });
        }
    });
}
fetchCountySearchList();
displaySelectedAmount();

function createOptionForSelector(optionValue, optionText, selectorId, optionClass) {
    const selector = document.getElementById(selectorId);
    const newOption = document.createElement('option');
    newOption.text = optionText;
    newOption.setAttribute('value', optionValue);
	newOption.className = optionClass;
    selector.add(newOption);
}

function getSelectedValue(selector) {
    let selectedIndex = selector.selectedIndex;
    const value = selector.value;
    return value;
}

function displaySelectedAmount () {
    const quantitySelector = document.getElementById('selectQuantity');
    quantitySelector.addEventListener('change', function() {
        const selectedQuantity = getSelectedValue(quantitySelector);
        fetchByQuantity(selectedQuantity).then((adHeadings) => {
            displayAdHeading(adHeadings);
            searchParams.antalrader = selectedQuantity;
        });
    });
}

function fetchBySearchParameter(searchParameter) {
    return fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?${searchParameter}&sida=1&antalrader=20`)
        .then((response) => response.json())
            .then((adHeadings) => {
                return adHeadings;
            })
                .catch((error) => {
                    console.log(error);
            });
}

function fetchByQuantity (amount) {
    return fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&sida=1&antalrader=${amount}`)
    .then((response) => response.json())
        .then((adHeadings) => {
            console.log(adHeadings);
            return adHeadings;
        })
            .catch((error) => {
                console.log(error);
        });
}

/*--------------- */

function displayAdHeading(adHeadings) {
   	const headingOutput = document.getElementById('headingOutput');
    const totalJobs = `<h2>Totalt antal lediga tjänster: ${adHeadings.matchningslista.antal_platsannonser}</h2>`;
    headingOutput.innerHTML = totalJobs;
	let ad = adHeadings.matchningslista.matchningdata;
	for(let i = 0; i < ad.length; i++){
    const adHeadingContainer = `
        <div id='adContainer'>
            <h2>${ad[i].annonsrubrik}</h2>
            <p>Arbetsplats: ${ad[i].arbetsplatsnamn}</p>
            <p>Kommun: ${ad[i].kommunnamn}</p>
            <p>Sista ansökningsdag: ${ad[i].sista_ansokningsdag}</p>
            <p>Yrke: ${ad[i].yrkesbenamning}</p>
            <p>Anställningstyp: ${ad[i].anstallningstyp}</p>
            <p>Läs mer: <a href='?jobAd=${ad[i].annonsid}'>HÄR</a></p>
        </div>
		`;
		headingOutput.insertAdjacentHTML('beforeend', adHeadingContainer);
	}
    headingOutput.insertAdjacentHTML('beforeend', displayPagination(adHeadings.matchningslista));
    const paginationButtons = document.getElementsByClassName('paginationButton');
    for (let pageButton of paginationButtons) {
        pageButton.addEventListener('click', function() {
            const requestPage = this.getAttribute('data-page');
            searchParams.sida = requestPage;
            paginate(requestPage);
        })
    }
}

function fetchSpecificAd(adID) {
    fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${adID}`)
    .then((response) => response.json())
    .then((json) => {

        //console.log(json);
         displaySpecificAd(json);

    })
    .catch((error) => {
        console.log(error);
    });
}

function displayPagination(items) {
    const firstPage = 1;
    const lastPage = items.antal_sidor;
    let paginationContainer = `
        <div id='paginationContainer'>
            <button type='button' class='paginationButton firstLastButton' data-page='${firstPage}'><<</button>`;
    if (currentPage > 1 && lastPage !== currentPage) {
        paginationContainer += `
                <button type='button' class='paginationButton' data-page='${currentPage - 1}'>${currentPage - 1}</button>
                <button type='button' class='paginationButton activePaginationButton' data-page='${currentPage}'>${currentPage}</button>
                <button type='button' class='paginationButton' data-page='${currentPage + 1}'>${currentPage + 1}</button>`
    }
    else if (currentPage === lastPage) {
        paginationContainer += `
                <button type='button' class='paginationButton' data-page='${currentPage - 2}'>${currentPage - 2}</button>
                <button type='button' class='paginationButton' data-page='${currentPage - 1}'>${currentPage - 1}</button>
                <button type='button' class='paginationButton activePaginationButton' data-page='${currentPage}'>${currentPage}</button>`
    }
    else {
        paginationContainer += `
                <button type='button' class='paginationButton activePaginationButton' data-page='${currentPage}'>${currentPage}</button>
                <button type='button' class='paginationButton' data-page='${currentPage + 1}'>${currentPage + 1}</button>
                <button type='button' class='paginationButton' data-page='${currentPage + 2}'>${currentPage + 2}</button>`
    }
    paginationContainer += `
            <button type='button' class='paginationButton firstLastButton' data-page='${lastPage}'>>></button>
        </div>`
    return paginationContainer;
}

function displaySpecificAd(item) {
    const ad = item.platsannons;
    const mainOutput = document.getElementById('mainOutput');
    const adContainer = `
        <div id='adContainer'>
            <h2>Rubrik: ${ad.annons.annonsrubrik}</h2>
            <p>Beskrivning: ${ad.annons.annonstext}</p>
            <p>Yrkesbenämning: ${ad.annons.yrkesbenamning}</p>
            <p>Antal platser: ${ad.annons.antal_platser}</p>
            <p>Ort: ${ad.annons.kommunnamn}</p>
            <p>Sista ansökningsdag: ${ad.ansokan.sista_ansokningsdag}</p>
            <p>Hemsida: ${ad.ansokan.webbplats}</p>
            <p>Arbetsplats: ${ad.arbetsplats.arbetsplatsnamn}</p>
            <p>Omfattning: ${ad.villkor.arbetstid}</p>
            <p>Lön: ${ad.villkor.lonetyp}</p>
            <p>Dela: ${window.location.href}</p>
            <button type="button" id="saveAd${ad.annons.annonsid}" value="${ad.annons.annonsid}">
            Spara annons</button>
        </div>
    `;
    mainOutput.innerHTML = adContainer;

    const saveAdButton = document.getElementById(`saveAd${ad.annons.annonsid}`);
    saveAdButton.addEventListener('click', function(event){
        saveAdToLocalStorage(this.value);
    });
}

function fetchAdFromURL() {
    const url = location.search.split('jobAd=')[1];
    fetchSpecificAd(url);
}

if (location.search.split('jobAd=')[1]) {
    fetchAdFromURL()
}

function saveAdToLocalStorage(id){
    if(!localStorage.getItem('savedAds')){
        localStorage.setItem('savedAds', JSON.stringify(savedAds));
    }
    savedAds = JSON.parse(localStorage.getItem('savedAds'));
    savedAds.push(id);
    localStorage.setItem('savedAds', JSON.stringify(savedAds));
}

showSavedAdsButton.addEventListener('click', function(event){
    displaySavedAds();
});

/* This displaySavedAds-function is under construction: */
function displaySavedAds(){
    console.log('Wow! Visa sparade annonser-button works!')

    /* Getting array of saved adID's from local storage: */
    savedAds = JSON.parse(localStorage.getItem('savedAds'));

    //displayAdHeading(savedAds);

    /* Looping out IDs */
    for(let i = 0; i < savedAds.length; i++){
        let adID = savedAds[i];

        console.log('Sparat annonsid:', adID);
        fetchSpecificAd(adID);
    }
}

function fetchSpecificAd(adID) {
    fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${adID}`)
    .then((response) => response.json())
    .then((json) => {

        //console.log(json);
         //displayAdHeadingsFromId(json);

        displaySpecificAd(json);

    })
    .catch((error) => {
        console.log(error);
    });
}






function constructUrlParameters(url) {
    searchParamKeys = ['lanid', 'antalrader', 'yrkesomradeid', 'sida'];
    for (let i = 0; i < searchParamKeys.length; i++) {
        if (searchParams[searchParamKeys[i]]) {
            if (i === 0) {
                url += `${searchParamKeys[i]}=${searchParams[searchParamKeys[i]]}`;
            }
            else {
                url += `&${searchParamKeys[i]}=${searchParams[searchParamKeys[i]]}`;
            }
        }
    }
    return url;
}

function paginate(pageNumber = 1) {
    currentPage = parseInt(pageNumber);
    let baseUrl = 'http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?';
    const baseUrlWithParams = constructUrlParameters(baseUrl);
    fetch(`${baseUrlWithParams}`)
        .then((response) => response.json())
            .then((adHeadings) => displayAdHeading(adHeadings))
                .catch((error) => console.log(error))
}


searchButton.addEventListener('click', function(event){
    event.preventDefault();
    searchJob();
});

function searchJob(){
    const searchField = document.getElementById('searchField');
    let searchWord = searchField.value;
    console.log(searchField.value);

    fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrken/${searchWord}`)
    .then((response) => response.json())
    .then((json) => {

        let data = json.soklista.sokdata;
        console.log(data);

        for(i = 0; i < data.length; i++){
            //fetchSpecificAdSearch();
//            console.log(data[i].id);
//            console.log(data[i].namn);
            fetchCareerSearch(data[i].id);
        }

    })
    .catch((error) => {
        console.log(error);
    });
}

function fetchCareerSearch(id) {
    fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?yrkesid=${id}&sida=1&antalrader=20`)
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        displayAdHeading(json);
    })
    .catch((error) => {
        console.log(error);
    });
}

fetchProfessionalCategories();


function fetchProfessionalCategories() {
	fetch('http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden')
	.then((response) => response.json())
	.then((categories) => {
		displayProfessionalCategories(categories);
	})
	.catch((error) => {
		console.log(error);
	})
}

function displayProfessionalCategories(categories) {
	for (let i = 0; i < categories.soklista.sokdata.length; i++ ) {
			createOptionForSelector(categories.soklista.sokdata[i].id, categories.soklista.sokdata[i].namn, 'selectCategory', 'professionalCategory');
		}
		const selector = document.getElementById('selectCategory');
		selector.addEventListener('change', function() {
			let selectedIndex = selector.selectedIndex;
			const id = selector.value;
			fetchAllByProfessionalCategory(id);
		})
}


function fetchAllByProfessionalCategory(id) {
		fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&yrkesomradeid=${id}&sida=1&antalrader=20`)
		.then((response) => response.json())
		.then((adHeadings) => {
			displayAdHeading(adHeadings);
            searchParams.yrkesomradeid = id;
		})
		.catch((error) => {
			console.log(error);
		});
	}
