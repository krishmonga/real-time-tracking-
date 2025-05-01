const socket = io();
console.log("Connected to the server");

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude }); // Send location to the server
        },
        (error) => {
            console.error("Error getting location:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

const markers = {};

// Listen for location updates from the server
socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;

    if (!markers[id]) {
        // Create a new marker for a new user
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    } else {
        // Update the marker's position for an existing user
        markers[id].setLatLng([latitude, longitude]);
    }

    console.log(`Updated location for user ${id}:`, latitude, longitude);
});

// Listen for user disconnection
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        // Remove the marker for the disconnected user
        map.removeLayer(markers[id]);
        delete markers[id];
        console.log(`User ${id} disconnected and marker removed`);
    }
});