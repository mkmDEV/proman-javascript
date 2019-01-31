window.load = function (source) {
    apiRequest(source);


    function turnPage(e) {
        e.stopPropagation();
        let next_source = e.target.dataset['source'];
        fetch(next_source)
            .then((response) => response.json())
            .then((data) => {
                fillTable(data)
            });
    }

//kap egy url source-t , eslő 3 sor nem kell, amikor megkapja az adatot, JSON -> JS, meghívja a fillTable-t
    function apiRequest(source) {
        let pageTurner = document.getElementById('page-turner');
        pageTurner.addEventListener('click', turnPage);
        document.getElementById('loading-table').classList.remove('hidden');
        fetch(source)
            .then((response) => response.json())
            .then((data) => {
                document.getElementById('loading-table').classList.add('hidden');
                fillTable(data);
            });
    }


    function modifyPageButtons(data) {
        const nextPage = document.getElementById('next-page');
        if (data['next'] === null) {
            nextPage.parentElement.classList.add('disabled');
        } else {
            nextPage.parentElement.classList.remove('disabled');
            nextPage.setAttribute('data-source', data['next']);
        }

        const previousPage = document.getElementById('previous-page');
        if (data['previous'] === null) {
            previousPage.parentElement.classList.add('disabled');
        }
        else {
            previousPage.parentElement.classList.remove('disabled');
            previousPage.setAttribute('data-source', data['previous']);
        }
    }


    function formatCellValue(value, suffix){
        suffix = ' ' + suffix;
        return value + (value === 'unknown' ? '' : suffix);
    }

    function formatNumber(number) {
        let parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

//felépíti az adatokból a táblázatot.
    function fillTable(data) {
        let table_content = data['results'];
        let table = document.getElementById('planet-table');
        modifyPageButtons(data);
        table.innerText = '';
        if (table_content) {
            for (const planet of table_content) {
                let row = '<tr>';
                row += `<td>${planet.name}</td>`;
                row += `<td>${formatCellValue(formatNumber(planet.diameter), 'km')}</td>`;
                row += `<td>${planet.climate}</td>`;
                row += `<td>${planet.terrain}</td>`;
                row += `<td>${formatCellValue(planet.surface_water, '%')}</td>`;
                row += `<td>${formatCellValue(formatNumber(planet.population), 'people')}</td>`;


                if (planet['residents'].length === 0) {
                    row += '<td>No known residents</td>';
                } else {
                    const residentSources = planet['residents'];
                    const buttonValue = planet['residents'].length.toString();
                    const buttonId = 'resButton_' + i;

                    row += `
                        <input
                            id="${buttonId}"
                            type="button"
                            class="btn btn-dark residents-button"
                            data-target="#myModal"
                            data-source="${residentSources}"
                            data-planet="${planet.name}"
                            value="${formatCellValue(buttonValue, 'resident')}">
                    `;
                }
                const voteButtonClass = document.getElementById('session-user') ? '' : 'd-none';
                row += `<td><input type="button" class="btn btn-dark vote-button ${voteButtonClass}" value="Vote"></td>`;
                row += '</tr>';

                table.innerHTML += row
            }

            const residentButtons = document.querySelectorAll('#planet-table .residents-button');
            for(const button of residentButtons){
                if (button.dataset['source'].length > 0) {
                    button.addEventListener('click', createModal);
                }
            }
        }
    }


    function createModal(e) {
        let modal_sources = e.target.parentElement.dataset['source'];
        let modal_title = e.target.parentElement.dataset['planet'];
        document.getElementById('loading-modal').classList.remove('hidden');
        $('#myModal').modal('show');
        fillModal(modal_title, modal_sources);
    }


    function fillModal(modal_title, modal_sources) {
        let modal_table = document.getElementById('modal-table');
        let title = document.getElementById('modal-title');
        modal_table.innerHTML = '';
        title.innerText = '';
        let i = 0;
        let sources = modal_sources.split(',');
        for (i; i < sources.length; i++) {
            let current_source = sources[i];
            let row = modal_table.insertRow(i);

            fetch(current_source)  // set the path; the method is GET by default, but can be modified with a second parameter
                .then((response) => response.json())  // parse JSON format into JS object
                .then((data) => {
                    document.getElementById('loading-modal').classList.add('hidden');
                    title.innerText = 'Residents of ' + modal_title;

                    row.insertCell(0).innerText = data['name'];
                    row.insertCell(1).innerText = data['height'];
                    row.insertCell(2).innerText = data['weight'];
                    row.insertCell(3).innerText = data['mass'];
                    row.insertCell(4).innerText = data['skin_color'];
                    row.insertCell(5).innerText = data['eye_color'];
                    row.insertCell(6).innerText = data['birth_year'];
                    row.insertCell(7).innerHTML = '<i class="fa fa-' + (data['gender'] === 'female' ? 'venus' : 'mars') + '"></i>'
                });
        }

    }
}
;

window.load('https://swapi.co/api/planets/');