
let lastUpdateTime = 0;
let lastLat = null;
let lastLon = null;
const MIN_DISTANCE_METERS = 3;
const MIN_SPEED_KMH = 0.25;


function updateSpeed(position) {
   Mps = position.coords.speed;
    if (speedMps !== null && speedMps >= 0) {
        const speedKmh = speedMps * 3.6;
        const speedKnots = speedKmh / 1.852;
        document.getElementById('speedKmh').textContent = speedKmh.toFixed(2);
        document.getElementById('speedKnots').textContent = speedKnots.toFixed(2);
    } else {
        document.getElementById('speedKmh').textContent = '0';
        document.getElementById('speedKnots').textContent = '0';
    }


    if (heading !== null && heading >= 0) {
        document.getElementById('heading').textContent = heading.toFixed(0);
    } else {
        document.getElementById('heading').textContent = '–';
    }
}

function handleError(error) {
    console.error('GPS Fehler:', error);
}

if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(updateSpeed, handleError, {
        enableHighAccuracy: true,
        maximumAge: 1000
    });
} else {
    alert('GPS wird nicht unterstützt.');
}


function updateSpeed(position) {
    const speedMps = position.coords.speed;
    const heading = position.coords.heading;
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Geschwindigkeit
    if (speedMps !== null && speedMps >= 0) {
        const speedKmh = speedMps * 3.6;
        const speedKnots = speedKmh / 1.852;
        document.getElementById('speedKmh').textContent = speedKmh.toFixed(2);
        document.getElementById('speedKnots').textContent = speedKnots.toFixed(2);
    } else {
        document.getElementById('speedKmh').textContent = '0';
        document.getElementById('speedKnots').textContent = '0';
    }

    // Richtung
    if (heading !== null && heading >= 0) {
        document.getElementById('heading').textContent = heading.toFixed(0);
        const compassNeedle = document.getElementById('compassNeedle');
        compassNeedle.style.transform = `rotate(${heading}deg)`;
    } else {
        document.getElementById('heading').textContent = '–';
    }

    // Geo-Koordinaten
    document.getElementById('latitude').textContent = latitude.toFixed(6);
    document.getElementById('longitude').textContent = longitude.toFixed(6);
}


document.getElementById('copyCoords').addEventListener('click', () => {
    const lat = document.getElementById('latitude').textContent;
    const lon = document.getElementById('longitude').textContent;
    const coords = `https://maps.google.com/?q=${lat},${lon}`;

    navigator.clipboard.writeText(coords).then(() => {
        document.getElementById('copyStatus').textContent = 'Koordinaten kopiert!';
        setTimeout(() => {
            document.getElementById('copyStatus').textContent = '';
        }, 2000);
    }).catch(err => {
        document.getElementById('copyStatus').textContent = 'Fehler beim Kopieren.';
    });
});

function updateSpeed3(position) {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime < 5000) return;

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const speedMps = position.coords.speed;
    const heading = position.coords.heading;

    // Berechne Distanz zur letzten Position
    let distanceMoved = 0;
    if (lastLat !== null && lastLon !== null) {
        distanceMoved = getDistanceFromLatLonInMeters(lastLat, lastLon, lat, lon);
    }

    const speedKmh = speedMps !== null ? speedMps * 3.6 : 0;

    // Nur aktualisieren, wenn Bewegung erkennbar
    if (speedKmh < MIN_SPEED_KMH && distanceMoved < MIN_DISTANCE_METERS) return;

    lastUpdateTime = currentTime;
    lastLat = lat;
    lastLon = lon;

    // Geschwindigkeit anzeigen
    document.getElementById('speedKmh').textContent = speedKmh.toFixed(2);
    document.getElementById('speedKnots').textContent = (speedKmh / 1.852).toFixed(2);

    // Richtung
    if (heading !== null && heading >= 0) {
        document.getElementById('heading').textContent = heading.toFixed(0);
        const compassNeedle = document.getElementById('compassNeedle');
        compassNeedle.style.transform = `rotate(${heading}deg)`;
    } else {
        document.getElementById('heading').textContent = '–';
    }

    // Koordinaten
    document.getElementById('latitude').textContent = lat.toFixed(6);
    document.getElementById('longitude').textContent = lon.toFixed(6);
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Erdradius in Metern
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
