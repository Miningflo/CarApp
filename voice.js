let speaking = false;

let recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = 'nl-BE';
recognition.interimResults = false;

let order = ["village", "town", "city_district", "city", "county"]

function speak(message, wait=false) {
    let msg = new SpeechSynthesisUtterance(message);
    msg.rate = 0.8;
    msg.pitch = 0.8;
    window.speechSynthesis.speak(msg);

    msg.onend = () => {recognition.start()}
}

recognition.onresult = function (event) {
    speaking = true;
    recognition.stop();
    let results = event.results
    let last = results[results.length - 1]
    let result = last[0].transcript.trim().toLowerCase()
    console.warn(result)

    if (result.includes("tijd") || result.includes("laat")) {
        let date = new Date()
        let msg = "Het is nu " + date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0") + " lokale tijd"
        speak(msg);
    } else if (result.includes("batterij")) {
        navigator.getBattery()
            .then(battery => {
                speak("Je batterij heeft nu " + (battery.level * 100) + "% resterend" + (battery.charging ? " en is aan het opladen" : ""))
            })
    } else if (result.includes("waar ben ik") || result.includes("locatie")) {
        if(position !== undefined && position !== null){
            let url = "https://nominatim.openstreetmap.org/reverse.php?format=json" +
                "&lat=" + position.coords.latitude +
                "&lon=" + position.coords.longitude +
                "&zoom=12";
            fetch(url)
                .then(response => response.json())
                .then(response => {
                    let address = response["address"];
                    for(let key of order){
                        if(key in address){
                            speak("Je bent nu in " + address[key] + ", " + address["country"])
                            break;
                        }
                    }
                })
        }else{
            speak("Ik kon je niet terugvinden, sorry")
        }

    } else {
        setTimeout(() => {recognition.start()}, 500)
    }
}

recognition.onstart = function (event) {
    console.log("listening")
}

recognition.onend = function (event) {
    if(!speaking){
        recognition.start()
    }
    speaking = false;
}

recognition.start();
