console.log("Hello JavaScript");

//ブラウザの準備が出来たら実行する
window.onload = (event)=> {
    console.log("OnLoad");

    //MapIDタグに移したい場所の座標を代入  ([緯度,軽度],ズーム)
    var map = L.map('map').setView([35.370265, 139.416012], 16);

    //マップの情報(どこのマップデータを使うや、マックスズーム率やら)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //マーカーの設置
    L.marker([35.370265, 139.416012]).addTo(map).bindPopup("文教大学湘南キャンパス").openPopup;

    //範囲(円)の設置
    let = L.circle([35.370265, 139.416012],{
        color:"red",fillcolor:"#f03",fillOpacity:0.2,radius:120


    }).addTo(map)


    var startPoint = L.latLng(35.3698192,139.4134905); // 文教大学湘南キャンパス
    var endPoint = L.latLng(35.3303039,139.4042546); // 茅ヶ崎駅

    // Add markers for start and end points
    L.marker(startPoint).addTo(map).bindPopup('Start: 文教大学湘南キャンパス').openPopup();
    L.marker(endPoint).addTo(map).bindPopup('End: 茅ヶ崎駅');

    // Define the route using Leaflet Routing Machine
    L.Routing.control({
        waypoints: [
            startPoint,
            endPoint
        ],
        routeWhileDragging: true
    }).addTo(map);


}