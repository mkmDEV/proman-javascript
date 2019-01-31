window.load = function (source) {
    console.log(source);
    apiRequest(source);


     function apiRequest(source) {
        fetch(source)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            });
    }
};

window.load("{{ url_for('get_data') }}");