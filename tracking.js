function follow(map){
    let current_speed = document.getElementById("travel");
    let max_speed = parseInt(document.getElementById("sign").innerText);

    const geolocation = new ol.Geolocation({
        // enableHighAccuracy must be set to true to have the heading value.
        trackingOptions: {
            enableHighAccuracy: true,
        },
        projection: map.getView().getProjection(),
    });

    const positionFeature = new ol.Feature();
    positionFeature.setStyle(
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 20,
                fill: new ol.style.Fill({
                    color: '#3399CC',
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 6,
                }),
            }),
        })
    );

    geolocation.addEventListener('change', () => {
        let speed = Math.round(geolocation.getSpeed() * 3.6)
        current_speed.innerText = ((isNaN(speed)) ? "0" : "" + speed);
        if(!isNaN(max_speed) && !isNaN(speed) && speed > max_speed + 5){
            current_speed.classList.add("overspeed");
        }else{
            current_speed.classList.remove("overspeed");
        }

        map.getView().animate({
            center: geolocation.getPosition(),
            duration: 100,
            zoom: -0.03 * speed + 20
        });

        const coordinates = geolocation.getPosition();
        positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
    });


    const accuracyFeature = new ol.Feature();
    geolocation.addEventListener('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });

    new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
            features: [accuracyFeature, positionFeature],
        }),
    });


    geolocation.setTracking(true);

}
