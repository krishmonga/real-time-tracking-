const socket = io();
console.log("hey");
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(error);
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
    attribution: "OpenStreetMap contributors",
}).addTo(map);

const markers = {};
socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;

    if (!markers[id]) {
    
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    } else {
        
        markers[id].setLatLng([latitude, longitude]);
    }
});
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
      
        map.removeLayer(markers[id]); 
        delete markers[id];  
    }
});