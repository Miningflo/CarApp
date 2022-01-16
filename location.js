function url_constructor(lat, long, radius) {
    let base = "https://overpass-api.de/api/interpreter";
    return base + "?data=[out:json][timeout:5];way[%22highway%22]" +
        "[\"highway\"!~\"cycleway\"]" +
        "[\"highway\"!~\"path\"]" +
        "(around:" + radius + "," + lat + "," + long + ");out%20qt;"
}

function street_n_speed(namebox, maxspeed){
    console.log("Fetching location");
    let tag_order = ["name", "ref", "service", "highway"];
    navigator.geolocation.getCurrentPosition(location => {
        console.log(location.coords.accuracy, location.coords.heading, location.coords.speed);
        fetch(url_constructor(location.coords.latitude, location.coords.longitude, location.coords.accuracy + 5))
            .then(res => res.json())
            .then(response => {
                let tags = response["elements"][0]["tags"];
                console.log(tags);

                let found = false;
                for(let key of tag_order){
                    if(key in tags){
                        namebox.innerText = tags[key].replace("_", " ");
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
                console.log("Starting next cycle");
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
