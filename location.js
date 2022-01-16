function url_constructor(lat, long, radius) {
    let base = "https://overpass-api.de/api/interpreter";
    return base + "?data=[out:json][timeout:5];way[%22highway%22]" +
        "[\"highway\"!~\"cycleway\"]" +
        "[\"highway\"!~\"path\"]" +
        "[\"highway\"!~\"footway\"]" +
        "(around:" + radius + "," + lat + "," + long + ");out%20qt;"
}

function street_n_speed(namebox, maxspeed){
    console.log("Fetching location");
    let tag_order = ["name", "ref", "service", "highway"];
    navigator.geolocation.getCurrentPosition(location => {
        console.table({
            latitude: location.coords.latitude,
            longtitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            heading: location.coords.heading,
            speed: location.coords.speed
        });
        fetch(url_constructor(location.coords.latitude, location.coords.longitude, location.coords.accuracy + 5))
            .then(res => res.json())
            .then(response => {
                let tags = response["elements"][0]["tags"];
                console.table(tags);

                function resize_to_fit() {
                    let fontSize = window.getComputedStyle(namebox).fontSize;
                    namebox.style.fontSize = (parseFloat(fontSize) - 1) + 'px';

                    if(namebox.clientWidth >= window.innerWidth - 20){
                        resize_to_fit();
                    }
                }

                let found = false;
                for(let key of tag_order){
                    if(key in tags){
                        namebox.innerText = tags[key].replace("_", " ");
                        namebox.style.fontSize = '7vh'; // Default font size
                        resize_to_fit();
                        found = true;
                        break;
                    }
                }
                if(!found){
                    namebox.innerText = "";
                }

                if("maxspeed" in tags){
                    maxspeed.style.visibility = "visible";
                    maxspeed.innerText = "" + tags["maxspeed"];
                }else{
                    maxspeed.style.visibility = "hidden";
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                console.log("Queuing next cycle");
                setTimeout(street_n_speed, 1000, namebox, maxspeed);
            });
    }, err => {
        console.error(err.message);
        setTimeout(street_n_speed, 2000, namebox, maxspeed);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0
    })
}
