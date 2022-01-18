window.onload = function () {
    let wakeLock = null;
    try {
        wakeLock = navigator.wakeLock.request('screen').then(() => {
            console.warn('Wake Lock is active!');
        });
    } catch (err) {
        console.log(err);
    }

    document.body.addEventListener("dblclick", () => {
        window.location.reload()
    })

    let namebox = document.getElementById("streetname");
    let maxspeed = document.getElementById("sign");

    let map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
                preload: Infinity
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]),
            zoom: 1
        }),
        controls : [],
        interactions: []
    });

    speedcams(map);
    street_n_speed(namebox, maxspeed);
    follow(map);
};


