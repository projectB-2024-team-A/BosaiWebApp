// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
//import { getDatabase } from "firebase/database";


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDG9Pq3_aoeqn8cicipFOw9C10t2p3HD-o",
  authDomain: "bosaiwebapp.firebaseapp.com",
  databaseURL:"https://bosaiwebapp-default-rtdb.firebaseio.com/",
  projectId: "bosaiwebapp",
  storageBucket: "bosaiwebapp.appspot.com",
  messagingSenderId: "72888901207",
  appId: "1:72888901207:web:c636d82631369489e80d12",
  measurementId: "G-BK4W95VS7G"
};

// Initialize Firebase
const app =initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const database = getDatabase(app);


const databaseRef = ref(database);
get(databaseRef).then((snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    console.log(data);
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error("Error getting data:", error);
});

const collectionRef = collection(firestore, "Coordinate");
getDocs(collectionRef).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
  });
}).catch((error) => {
  console.error("Error getting documents: ", error);
});

/*
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
*/