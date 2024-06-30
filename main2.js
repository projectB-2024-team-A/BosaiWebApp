//プラグインのライセンス表示
/*
  Leaflet.RotatedMarker
  https://github.com/bbecquet/Leaflet.RotatedMarker
  
  Copyright (c) 2015 Benjamin Becquet
  Released under the MIT license
  https://github.com/bbecquet/Leaflet.RotatedMarker/blob/master/LICENSE
*/


// //Firebaseの読み込み(SDKの読み込み)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyBnRE5XtYBlBIj6T83qdiZOd6-ba2axlaE",
  authDomain: "bosaiwebapp2.firebaseapp.com",
  databaseURL: "https://bosaiwebapp2-default-rtdb.firebaseio.com",
  projectId: "bosaiwebapp2",
  storageBucket: "bosaiwebapp2.appspot.com",
  messagingSenderId: "983527197845",
  appId: "1:983527197845:web:9be0c65a9ee207e733df9c",
  measurementId: "G-YJTT1JHYMF"
};

// Firebaseの初期化(使えるようにする)
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const database = getDatabase(app);

// Firestoreの"ChigasakiShelter"からデータを取得
const collectionRef = collection(firestore, "ChigasakiShelter");
getDocs(collectionRef).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {

    //施設の名前、緯度、経度を変数に入れる
    const nameShelter = doc.data()['施設・場所名'];
    const shellongitude = doc.data().緯度;
    const shellatitude = doc.data().経度;

    console.log(nameShelter,shellongitude,shellatitude);

    //避難所のマーカー設置
    addShelterMarker(shellongitude, shellatitude, nameShelter);

  });
}).catch((error) => {
  console.error("ドキュメントの取得エラー: ", error);
});

//ページが読み込まれた後にマップを表示させる(一番最初にだけ動く)
document.addEventListener('DOMContentLoaded', () => {
  console.log("ページ読み込み完了");
  drawMap();
});

let map; // マップオブジェクト
let nowPosition; // 現在地のマーカー
const shelterMarkers = []; // 避難所のマーカーを保持する配列(情報を残さないとマーカーの場所が上書きされてしまうため)

// マップを描画する関数
function drawMap() {

  // Geolocation APIに対応しているか確認
  if (!navigator.geolocation) {
    //対応していなかったら知らせる
    alert("お使いの端末では位置情報を取得できません");
  }

  // マップの初期位置
  map = L.map('map').setView([0, 0], 5); 


  // OpenStreetMapタイルを使用
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  //プラグインによる追加箇所
  /*
  var compass = new L.Control.Compass({ position: 'topright', autoActive: true, showDigit: true });
  compass.addTo(map);
  var option = {
    position: 'topright',
    strings: {
        title: "現在地を表示",
        popup: "いまここ"
    },
    locateOptions: {
      maxZoom: 16
    }
  }
   
  var lc = L.control.locate(option).addTo(map);
  lc.start();
*/
}

//ここから方向を示す印の位置更新についてのプログラム
window.onload = function(){
  //現在位置を定期的に更新
  navigator.geolocation.watchPosition(getPosition, errorIndication);

  //端末が対応していたら
  if (window.DeviceOrientationEvent) {
    //端末の方向が変わるたびに変更
    window.addEventListener('deviceorientation', function(event) {
      var nowHeading = event.alpha;
      headingMarker.setRotationAngle(nowHeading);
    })
  };
}
//ここまで方向を示す印の位置更新についてのプログラム


//ここから関数
// 避難所のマーカーを追加する関数(引数に緯度、経度、施設の名前がある)
function addShelterMarker(latitude, longitude, name) {
  //マーカーの描画
  const marker = L.marker([latitude, longitude]).addTo(map).bindPopup(name).openPopup();
  //マーカーの情報を配列に入れる
  shelterMarkers.push(marker);
}

//ここから位置情報関係の関数
// 位置情報取得に成功した場合に実行される関数
let nowIcon;
let headingIcon;
let headingMarker;
let nowIconDesign;
// 位置情報取得に成功した場合に実行される関数
function getPosition(position) {
  const nowLatitude = position.coords.latitude;
  const nowLongitude = position.coords.longitude;

  //向いている方向を示すマークの表示ここから
  headingIcon = L.icon({
    iconUrl:'images/heading-icon.png',
    iconsize:[50, 50],
    iconAnchor:[25,42]
  })

  if (headingMarker){
    headingMarker.setLatLng([nowLatitude,nowLongitude]);
  }else{
    headingMarker = L.marker([nowLatitude, nowLongitude], {
      icon: headingIcon,
    }).addTo(map);
  }
  //向いている方向を示すマークの表示ここまで


  //現在地の表示ここから
  nowIconDesign = L.icon({
    iconUrl:'images/now-icon.png',
    iconsize:[30, 30],
    iconAnchor:[15,15],
    zIndexOffset: 200
  })

  // すでに現在地が表示されている場合は位置を更新、なければ作成
  if (nowIcon) {
    nowIcon.setLatLng([nowLatitude,nowLongitude]);
  }else{
    nowIcon = L.marker([nowLatitude, nowLongitude], {
      icon: nowIconDesign,
    }).addTo(map);
  }
  //現在地の表示ここまで
}


// 位置情報取得に失敗した場合に実行される関数
function errorIndication() {
  alert("位置情報を取得する際にエラーが発生しました");
}
