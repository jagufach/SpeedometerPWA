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

