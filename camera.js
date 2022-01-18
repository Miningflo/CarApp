function find_cameras(lat, long) {
    let base = "https://overpass-api.de/api/interpreter";
    return base + "?data=[out:json][timeout:25];node[\"highway\"=\"speed_camera\"]" +
        "(around:15000," + lat + "," + long + ");out%20qt;"
}

function speedcams(map){
    let camLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: function(feature){
            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: "speedcam.png",
                    scale: 0.1
                }),
                text: new ol.style.Text({
                    text: feature.get("description"),
                    offsetY: -60,
                    font: 'bold 80px Calibri,sans-serif',
                    fill: new ol.style.Fill({color: '#000'}),
                    stroke: new ol.style.Stroke({
                        color: '#fff', width: 15
                    }),
                })
            })
        },
        declutter: true
    });

    map.addLayer(camLayer);
    draw_speed_cams(camLayer);
}

function createMarker(lng, lat, id) {
    return new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat])),
        description: id
    });
}

function draw_speed_cams(camLayer){
    console.log("Drawing speed camera's")
    navigator.geolocation.getCurrentPosition(location => {
        fetch(find_cameras(location.coords.latitude, location.coords.longitude))
            .then(resp => resp.json())
            .then(response => {
                let cameras = response["elements"];
                camLayer.getSource().clear()
                cameras.forEach(camera => {
                    camLayer.getSource().addFeature(
                        createMarker(
                            camera["lon"],
                            camera["lat"],
                            ("maxspeed" in camera["tags"]) ? camera["tags"]["maxspeed"] : "")
                    )
                })
                setTimeout(draw_speed_cams, 5*60*1000, camLayer)
        }).catch(err => {
            console.error(err);
            draw_speed_cams(camLayer)
        })
    })
}


