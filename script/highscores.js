const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; // localStorageda bulunan puanları array olarak değişkene aldık.. Yoksa da boş bir array oluşturacağız..

highScoresList.innerHTML = highScores.map((score) => {      
	return `<li class='high-score'>${score.username} -- ${score.score}</li>`;
}).join(""); //map metodu ile arraydaki her bir elemanla işlemler yapabiliyoruz.join metodu ile obje olan array elemanlarını stringe çevirdik.


//console.log(highScores);
