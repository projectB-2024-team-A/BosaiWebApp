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
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition, errorIndication);
  } else {
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
}

//ここから方向を示す印の位置更新についてのプログラム
//1秒ごとに現在位置を更新
window.onload = function(){
  setInterval(() => {
    navigator.geolocation.getCurrentPosition(getPosition, errorIndication);
  }, 1000)
}

var eventElement = document.getElementById( "map" ) ;
//マップ上でクリックしたら実行
eventElement.addEventListener("onmousedown", function(){
  mapEvent();
});

//スクロールされたら実行
eventElement.addEventListener("wheel", function(){
  mapEvent();
});
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
let nowHeadingIcon = document.querySelector("#headingIcon");
// 位置情報取得に成功した場合に実行される関数
function getPosition(position) {
  const nowLatitude = position.coords.latitude;
  const nowLongitude = position.coords.longitude;
  const nowHeading = position.coords.heading;

  // すでに現在地が表示されている場合は削除
  if (nowPosition) {
    map.removeLayer(nowPosition);
  }

  // 現在地を表示
  nowIcon = L.circleMarker([nowLatitude, nowLongitude], {
    radius: 15,
    color: "#4781ed",
    fillColor: "#6495ed",
    fillOpacity: 0.5,
  }).addTo(map).openPopup();
  nowIcon._path.setAttribute('id', 'nowIcon');

  nowHeadingIcon.style.transform = "rotate("+ nowHeading +"deg)";
  alert(nowHeading);
  getHeading();
}

//方向を示すマークの位置を変更するためだけの関数（mapEventという関数の中で使われている）
function getHeading(){
  var haedingPosition = nowIcon._path.getBoundingClientRect();

  //マークがある位置を取得
  var x = haedingPosition.left;
  var y = haedingPosition.top;

  //CSSのプロパティーを変更して位置を更新
  let nowHeadingIcon = document.querySelector("#headingIcon");
  nowHeadingIcon.style.transform = "translate(" + (x - 35) + "px," + (y - 120) + "px)";
}


// 位置情報取得に失敗した場合に実行される関数
function errorIndication(error) {
  alert("エラーが発生しました");
}

//マップをズーム、スクロールしたりしたときに実行する用の関数
function mapEvent(){
  const headingTimer = setInterval(() => {
    let i = 0;
    //方向マークの位置を更新
    navigator.geolocation.getCurrentPosition(getHeading, errorIndication);
    i+=1;
    //もしクリックされなくなったら処理を中止
    eventElement.addEventListener("onmouseup", function(){
      clearInterval(headingTimer)
    });
    //クリックしなくなったときにonmouseupが反応しなかった場合の対処
    if (i>200){
      clearInterval(headingTimer)
    }
  }, 40)
  console.log("成功");
}