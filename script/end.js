const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore=document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem("mostRecentScore"); // localStorage dan score değerini aldık....
const highScores= JSON.parse(localStorage.getItem('highScores')) || [];  // localStorageda bulunan puanları array olarak değişkene aldık.. Yoksa da boş bir array oluşturacağız..

const MAX_HIGH_SCORES = 5;

finalScore.innerText=`High Score: ${mostRecentScore}`;



saveScoreBtn.disabled = true; // save butonu pasif olarak gelecek.
username.addEventListener("keyup", () => { // username girişi yapıldıktan sonra kaydetme butonu aktif olsun istiyoruz.
	saveScoreBtn.disabled = !username.value; //username.value değeri falsy, null, undefined dönerse disabled olsun diyoruz.
});

saveHighScore = (e) => {
    //console.log('save butonuna tıklandı!!');
    e.preventDefault();
    
    const score= {
        score:  mostRecentScore,
        username: username.value
    };
    highScores.push(score); // her yeni username ekleme de array'e objeyi atıcaz..

    highScores.sort((a,b) => b.score - a.score); // b sonraki eleman önceki elemandan büyükse ona göre sıralar, büyükten küçüğe sıraladık.
    
    highScores.splice(5); // en yüksek ilk beşi göstermek istiyoruz.
    
    localStorage.setItem('highScores', JSON.stringify(highScores)); // localStorage'a her yeni kayıtta güncellenmesi için yeni en yüksek skorlar arrayini ekledik.
    
    window.location.assign('./');
    
    //console.log(highScores);

    
};
