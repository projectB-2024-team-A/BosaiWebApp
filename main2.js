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
const shelterMarkers = []; // 避難所のマーカーを保持する配列(情報を残さないとマーカーの場所が上書きされてしまうため)

// マップを描画する関数
function drawMap() {

  // マップの初期位置
  map = L.map('map').setView([35.682839, 139.759455], 5);


  // OpenStreetMapタイルを使用
  var baseLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var tansyokuLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var photoLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);



  // ハザードマップレイヤー（仮想の例）
var kazanLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/vbm/{z}/{x}/{y}.png', {
  attribution: '&copy; Hazard Map Data Provider'
});

var tunamiLayer = L.tileLayer('https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png', {
  attribution: '&copy; Hazard Map Data Provider'
});

var dosyaLayer = L.tileLayer('https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png', {
  attribution: '&copy; Hazard Map Data Provider'
});

var kozuiLayer = L.tileLayer('https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png', {
  attribution: '&copy; Hazard Map Data Provider'
});

// レイヤーコントロールのオブジェクトを作成
var baseMaps = {
  "ベースマップ": baseLayer,
  "淡色地図": tansyokuLayer,
  "写真": photoLayer
};

var overlayMaps = {
  "火山基本図": kazanLayer,
  "津波浸水想定マップ": tunamiLayer,
  "土砂災害警戒区域（土石流）マップ": dosyaLayer,
  "洪水浸水想定区域マップ": kozuiLayer
};

// レイヤーコントロールをマップに追加
L.control.layers(baseMaps, overlayMaps).addTo(map);

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


window.onload = function(){
  //現在位置を定期的に更新
  setInterval(() => {
    navigator.geolocation.getCurrentPosition(getPosition, errorIndication);
  }, 1000)
}


//ここから関数
// 避難所のマーカーを追加する関数(引数に緯度、経度、施設の名前がある)
function addShelterMarker(latitude, longitude, name) {
  //マーカーの描画
  const marker = L.marker([latitude, longitude]).addTo(map).bindPopup(name).openPopup();
  //マーカーの情報を配列に入れる
  shelterMarkers.push(marker);
}

//ここから位置情報関係の関数
let nowIcon;
let headingIcon;
let headingMarker;
let nowIconDesign;
let nowLatitude;
let nowLongitude;
let showPosition = false;
let showHeading = false;
let bigNowIcon;
// 位置情報取得に成功した場合に実行される関数
function getPosition(position) {
  nowLatitude = position.coords.latitude;
  nowLongitude = position.coords.longitude;
  

  //向いている方向を示すマークの表示ここから
  headingIcon = L.icon({
    iconUrl:'images/heading-icon.png',
    iconsize:[50, 50],
    iconAnchor:[25,42]
  })

  //デバイスの向きが取得出来る場合に方向マークを表示
  if(showHeading){
    if (headingMarker){
      headingMarker.setLatLng([nowLatitude,nowLongitude]);
    }else{
      headingMarker = L.marker([nowLatitude, nowLongitude], {
        icon: headingIcon,
      }).addTo(map);
    }
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
    //作成すると同時に現在地を表示
    map.setView([nowLatitude, nowLongitude], 18.5);
  }
  //現在地の表示ここまで


  //現在地を強調する
  if(showPosition){
    let bigIconDesign = L.icon({
      iconUrl:'images/big-now-icon.png',
      iconsize:[150, 150],
      iconAnchor:[75,75],
    })
    if (bigNowIcon) {
      bigNowIcon.setLatLng([nowLatitude,nowLongitude]);
    }else{
      bigNowIcon = L.marker([nowLatitude, nowLongitude], {
        icon: bigIconDesign,
      }).addTo(map);
    }
  }
  else{
    if (bigNowIcon) {
      map.removeLayer(bigNowIcon); 
      bigNowIcon = null;
    }
  }
}


// 位置情報取得に失敗した場合に実行される関数
//1回のみアラートで知らせる
let errorAlert = false;
function errorIndication() {
  if (!errorAlert){
    // Geolocation APIに対応しているか確認
    if (!navigator.geolocation) {
      //対応していなかったら知らせる
      alert("お使いの端末では位置情報を取得できません");
    }
    else{
      alert("位置情報を取得する際にエラーが発生しました");
    }
    errorAlert = true;
  }
}


//ボタンが押されたら現在地を表示する関数
document.getElementById("positionButton").onclick = function() {
  //現在地を強調する
  showPosition = true;
  map.setView([nowLatitude, nowLongitude], 18.5);
 
  //10秒たったら強調マークを消す
  window.setTimeout(() => {
    showPosition = false;
  }, 10000);
};

//ボタンが押されたら方向マークを表示
document.getElementById("headingButton").onclick = function() {
  //ボタンを押したらダイアログを表示
  let answer = confirm("デバイスの向きの取得を許可しますか？");
  //許可した場合
  if(answer) {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
          .then(response => {
              if (response === "granted") {
                  window.addEventListener("deviceorientation", getHeading);
                  showHeading = true; //方向マークの位置を表示するようにする
              } else {
                  alert("デバイスの向きの許可が拒否されました");
              }
          })
          .catch(error => {
              console.error("許可の取得中にエラーが発生しました", error);
          });
    } else {
      let device = navigator.userAgent.toLowerCase();
      if (!/iphone|ipad|ipod/.test(device) && !/android/.test(device)) {
        // デバイスの向きが取得出来ないブラウザだった場合
        alert("デバイスの向きの取得はこのブラウザではサポートされていません");
      } else if (/android/.test(device)) {
        //Androidの場合
        showHeading = true; //方向マークの位置を表示するようにする
        window.addEventListener("deviceorientation", getHeading);
      }
    }
  }
};

//デバイスの向きを取得してマークの向きを更新する
function getHeading(){
  window.addEventListener('deviceorientationabsolute', function(event) {
    var nowHeading = event.alpha;
    headingMarker.setRotationAngle(nowHeading);
  })
}
