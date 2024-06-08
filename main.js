// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
//import { getDatabase } from "firebase/database";

//Firebaseライブラリの読み込み
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

//データベースの設定
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

//ライブラリを使用できるようにする
const app =initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const database = getDatabase(app);

//リアルタイムデータベースからデータの取得
/*
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
*/

//firestore databaseのCoordinateからデータの取得
const collectionRef = collection(firestore, "Coordinate");
getDocs(collectionRef).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log("緯度は "+doc.data().longitude);
    console.log("経度は "+doc.data().latitude);

    //取得した緯度経度データの代入
    let longitude=doc.data().longitude;
    let latitude=doc.data().latitude;

    //マップの表示
    drawMap(longitude,latitude);

  });
}).catch((error) => {
  console.error("Error getting documents: ", error);
});

//マップ描画関数(引数に緯度経度を持たせている)
function drawMap(longitude,latitude) {
//MapIDタグに移したい場所の座標を代入  ([緯度,軽度],ズーム)
    var map = L.map('map').setView([35.370265, 139.416012], 16);

    //マップの情報(どこのマップデータを使うや、マックスズーム率やら)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //マーカーの設置
    L.marker([longitude, latitude]).addTo(map).bindPopup("文教大学湘南キャンパス").openPopup;

    
    //以下現在地の取得
    //Geolocation APIに端末が対応しているか判定
    if(navigator.geolocation)
    {
      //対応している場合
      //現在地を取得
      navigator.geolocation.watchPosition( getPosition , errorIndication) ;
    }
    else
    {
      //対応していない場合
      alert("お使いの端末では位置情報を取得できません")
    }
  
    //位置情報の取得に成功した場合に実行される関数
    let nowPosition; //位置情報を地図に表示したかどうか確認するための変数
    function getPosition(position)
    {
      //位置情報が既に表示してあるかどうか
      //してある場合は表示を消す（複数マークが出ないように）
      if (nowPosition){
        map.removeLayer(nowPosition);
      }
      //現在地を表示
      // 緯度を取得
      let nowLatitude = position.coords.latitude;

      // 経度を取得
      let nowLongitude = position.coords.longitude;

      //向いている方向を取得
      let nowHeading = position.coords.heading;

      //円で現在地を表示
      nowPosition = L.circle([nowLatitude, nowLongitude], {
        radius: 10,
        color: "#4781ed",
        fillColor: "#6495ed",
        fillOpacity: 0.5,
      }).addTo(map).bindPopup("現在地").openPopup;
    }

    //拡大率によって現在地を示す円の大きさを変えるとき使う"map.getZoom()"のお試し文。キーを何か押すとコンソールにマップの拡大率を表示
    //document.onkeydown = event => console.log(map.getZoom());

    //位置情報の取得に失敗した場合に実行される関数
    function errorIndication(error)
    {
      // エラーコードのメッセージを表示
      alert("エラーが発生しました") ;
    }

    //現在地の取得ここまで

    /*
    //範囲(円)の設置
    L.circle([35.370265, 139.416012],{
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
*/
}

    

