function url_constructor(lat, long, radius) {
    let base = "https://overpass-api.de/api/interpreter"
    return base + "?data=[out:json];way[%22highway%22](around:" + radius + "," + lat + "," + long + ");out;"
}

function street_n_speed(namebox, maxspeed){
    let tag_order = ["name", "ref", "service", "highway"];
    navigator.geolocation.getCurrentPosition(location => {
        console.log(location.coords.accuracy, location.coords.heading, location.coords.speed);
        fetch(url_constructor(location.coords.latitude, location.coords.longitude, location.coords.accuracy))
            .then(res => res.json())
            .then(response => {
                let tags = response["elements"][0]["tags"];
                console.log(tags);

                for(let key of tag_order){
                    if(key in tags){
                        namebox.innerText = tags[key].replace("_", " ");
                        break;
                    }
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
                console.log("Starting next cycle")
                setTimeout(street_n_speed, 5000, namebox, maxspeed);
            });
    })
}
