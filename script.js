window.onload = function () {
    document.documentElement.requestFullscreen();
    let wakeLock = null;
    try {
        wakeLock = navigator.wakeLock.request('screen').then(() => {
            console.log('Wake Lock is active!');
        });
    } catch (err) {
        console.log(err);
    }
    let namebox = document.getElementById("streetname");
    let maxspeed = document.getElementById("sign");

    let map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]),
            zoom: 1
        }),
        controls : [],
        interactions: []
    });

    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([4.35247, 50.84673]))
                })
            ]
        })
    });
    map.addLayer(layer);

    street_n_speed(namebox, maxspeed);
    follow(map);
}


