function follow(map, current_speed){
    const geolocation = new ol.Geolocation({
        // enableHighAccuracy must be set to true to have the heading value.
        trackingOptions: {
            enableHighAccuracy: true,
        },
        projection: map.getView().getProjection(),
    });

    geolocation.addEventListener('change', () => {
        current_speed.innerText = "" + (geolocation.getSpeed() * 3.6)
        map.getView().animate({
            center: geolocation.getPosition(),
            duration: 100,
            zoom: 20
        });
    });


    const accuracyFeature = new ol.Feature();
    geolocation.addEventListener('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
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

    geolocation.addEventListener('change:position', function () {
        const coordinates = geolocation.getPosition();
        positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
    });

    new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
            features: [accuracyFeature, positionFeature],
        }),
    });


    geolocation.setTracking(true);

}
