
function search() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    if (keyword.length >= 2) {  // minimum 2 letter to search
        //searchCombined(keyword).then(results => displayResults(results));
        searchCombined(keyword);
        //
    } else { //show error
        alert("Min. 2 letter search");
    }

}

async function searchCombined2(searchWord) {
    try {
        const response = await fetch('travel_recommendation_api.json');
        const data = await response.json();
        const result = [];

        for (const categorie in data) {
            const lista = data[categorie];

            lista.forEach(item => {
                // country, iterate cities
                if (categorie === 'countries' && item.cities) {
                    item.cities.forEach(or => {
                        if (
                            or.name.toLowerCase().includes(searchWord.toLowerCase())
                            /*or.name.toLowerCase().includes(searchWord.toLowerCase()) ||
                            or.description.toLowerCase().includes(searchWord.toLowerCase())*/
                        ) {
                            result.push({ tip: 'city', ...or });
                        }
                    });
                } else {
                    //  temple, beaches etc.
                    if (
                        item.name.toLowerCase().includes(searchWord.toLowerCase())
                        /*item.name.toLowerCase().includes(searchWord.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchWord.toLowerCase())*/
                    ) {
                        result.push({ tip: categorie.slice(0, -1), ...item });
                    }
                }
            });
        }

        //console.log(result);
        return result;
    } catch (error) {
        console.error('Eroare la fetch:', error);
    }
}


function displayResults2(results) {
    const container = document.getElementById('results');
    container.innerHTML = '';

    if (results.length > 0) {
        results.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('rezultat-item');

            div.innerHTML = `
                <img src="images/source/${item.imageUrl}" alt="${item.name}" class="imagine" />
                <h2 style="margin: 10px;">${item.name}</h2>
                <p style="margin: 10px;color: #2e2e2e;">${item.description}</p>
                <button style="margin: 10px;">Visit</button>      
                `;

            container.appendChild(div);
        });
    } else {
        const div = document.createElement('div');
        div.classList.add('rezultat-item');
        div.innerHTML = `              
                <h2 style="margin: 10px;">No result. Sorry!</h2>               
                `;
        container.appendChild(div);
    }
}
/**/


function searchCombined(cuvantCautat) {
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let rezultate = [];

            //const categorii = ['countries', 'temples', 'beaches'];
            const categorii = ['countries', 'temples', 'beaches'];
            var cuvant = cuvantCautat.toLowerCase();
            if (cuvant === 'country') {
                cuvant = 'countries';
            }
            if (cuvant === 'temple') {
                cuvant = 'temples';
            }
            if (cuvant === 'beach') {
                cuvant = 'beaches';
            }

            if (categorii.includes(cuvant)) {
                if (cuvant === 'countries') {
                    data.countries.forEach(tara => {
                        tara.cities.forEach(or => {
                            rezultate.push({
                                nume: or.name,
                                descriere: or.description,
                                imagine: or.imageUrl,
                                timeZone: or.timeZone,
                                categorie: 'cities'
                            });
                        });
                    });
                } else {
                    data[cuvant].forEach(item => {
                        rezultate.push({
                            nume: item.name,
                            descriere: item.description,
                            imagine: item.imageUrl,
                            timeZone: item.timeZone,
                            categorie: cuvant
                        });
                    });
                }
            } else {
                // cautare normala dupa cuvant in toate categoriile
                data.countries.forEach(tara => {
                    tara.cities.forEach(or => {
                        if (
                            or.name.toLowerCase().includes(cuvant) /*||
                            or.description.toLowerCase().includes(cuvant)*/
                        ) {
                            rezultate.push({
                                nume: or.name,
                                descriere: or.description,
                                imagine: or.imageUrl,
                                timeZone: or.timeZone,
                                categorie: 'cities'
                            });
                        }
                    });
                });

                ['temples', 'beaches'].forEach(cat => {
                    data[cat].forEach(item => {
                        if (
                            item.name.toLowerCase().includes(cuvant) /*||
                            item.description.toLowerCase().includes(cuvant)*/
                        ) {
                            rezultate.push({
                                nume: item.name,
                                descriere: item.description,
                                imagine: item.imageUrl,
                                timeZone: item.timeZone,
                                categorie: cat
                            });
                        }
                    });
                });
            }

            afiseazaRezultate(rezultate);
        });
}

function afiseazaRezultate(rezultate) {
    const container = document.getElementById('results');
    container.innerHTML = ''; // curata rezultatele anterioare

    if (rezultate.length === 0) {   // mo trdults
        const div = document.createElement('div');
        div.classList.add('rezultat-item');
        div.innerHTML = `              
                <h2 style="margin: 10px;">No result. Sorry!</h2>               
                `;
        container.appendChild(div);

        return;
    }

    rezultate.forEach(item => {
        const options = { timeZone: item.timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const cityTime = new Date().toLocaleTimeString('en-US', options);
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('rezultat-item');
        dateDiv.innerHTML = `<p style="margin: 10px;">Current time in ${item.nume}: ${cityTime}</p> `;
        container.appendChild(dateDiv);
        ////////////
        const div = document.createElement('div');
        div.classList.add('rezultat-item');

        div.innerHTML = `
                <img src="images/source/${item.imagine}" alt="${item.nume}" class="imagine" />
                <h2 style="margin: 10px;">${item.nume}</h2>                
                <p style="margin: 10px;color: #2e2e2e;">${item.descriere}</p>
                <button style="margin: 10px;">Visit</button>      
                `;

        container.appendChild(div);
    });
}




function clearResults() {
    document.getElementById("results").innerHTML = '';
    document.getElementById("searchInput").value = '';
}
