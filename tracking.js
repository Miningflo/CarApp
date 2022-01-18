function follow(map){
    let current_speed = document.getElementById("travel");
    let speedbox = document.getElementById("sign");

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
            image: new ol.style.Icon({
                src: 'arrow.png',
                scale: 0.2,
            }),
        })
    );

    geolocation.addEventListener('change', () => {
        let speed = Math.round(geolocation.getSpeed() * 3.6) || 0;
        current_speed.innerText = "" + speed;

        let max_speed = parseInt(speedbox.innerText);
        if(!isNaN(max_speed) && speed > max_speed + 5){
            current_speed.classList.add("overspeed");
        }else{
            current_speed.classList.remove("overspeed");
        }

        let rotation = map.getView().getRotation();
        map.getView().animate({
            center: geolocation.getPosition(),
            duration: 500,
            zoom: -0.03 * speed + 20,
            rotation: ((speed > 5) ? -geolocation.getHeading() || rotation : rotation)
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
