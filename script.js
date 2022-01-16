window.onload = function () {
    document.documentElement.requestFullscreen();
    let namebox = document.getElementById("streetname");
    let maxspeed = document.getElementById("sign");
    let current_speed = document.getElementById("travel")

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
        controls : ol.control.defaults({
            attribution : false,
            zoom : false,
        }),
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
    follow(map, current_speed);
}


