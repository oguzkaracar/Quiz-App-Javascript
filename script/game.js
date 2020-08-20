const question = document.querySelector("#question");
const choices = Array.from(document.getElementsByClassName("choice-text")); // Array.from ile iterable olan HTMLCollection'ı array e çevirdik..
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {}; // sorularıımızı ekleyeceğimiz obje
let acceptingAnswers = false; // sorulan default olarak cevaplanmadı, seçildi.
let score = 0; // skor
let questionCounter = 0; // soru sıralaması
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=22&difficulty=medium&type=multiple")
	.then((res) => {
		return res.json();
	})
	.then((loadedQuestions) => {
		console.log(loadedQuestions.results);
		questions = loadedQuestions.results.map((loadedQuestion) => {
			const formattedQuestion = {
				question: loadedQuestion.question,
			};

			const answerChoices = [...loadedQuestion.incorrect_answers]; // önce yanlış olan 3 cevabı aldık.
			formattedQuestion.answer = Math.floor(Math.random() * 3) + 1; // 4 tane soru oluşturacaz onun için rastgele olması lazım.(A,B,C,D)
			answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

			answerChoices.forEach((choice, index) => {
				formattedQuestion["choice" + (index + 1)] = choice;
			});
			//console.log(loadedQuestion.question)
			//console.log(formattedQuestion);
			return formattedQuestion;
		});

		startGame(); // sorular yüklenene kadar quizi başlatmak istemiyoruz.
	})
	.catch((err) => {
		console.log("Errror", err);
	});

//console.log(questions.length);

const CORRECT_BONUS = 10;

var MAX_QUESTIONS;
startGame = () => {
	MAX_QUESTIONS = questions.length; // gelen soru sayısına göre şekillenecek..
	questionCounter = 0;
	score = 0;
	availableQuestions = [...questions];
	// spread operator kullandık, kaç tane soru olduğunu bilmiyor olabiliriz, sorular dinamik olarak geliyor olabilir.
	//console.log(availableQuestions);
	getNewQuestion();
	game.classList.remove("hidden");
	loader.classList.add("hidden");
};

getNewQuestion = () => {
	if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
		// eğer sorular bittiyse son sayfaya yönelt
		localStorage.setItem("mostRecentScore", score); // sorular bittikten sonra score'u localStorage a attık.
		return window.location.assign("./end.html");
	}

	questionCounter++; // soru sıra sayısını arttır.
	progressText.innerText = `Question: ${questionCounter} / ${MAX_QUESTIONS}`; // hangi sorudayız ve toplam kaç soru var listeledik.

	// Update the progress Bar
	progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
	// toplam soru sayısı ve şuan ki soru oranına göre width değeri verilecek..

	const questionIndex = Math.floor(Math.random() * availableQuestions.length); // rastgele soru gelmesi için...
	currentQuestion = availableQuestions[questionIndex]; // şimdiki soru değişkenine, sorular arrayinden rastgele indexe göre soru atadık.
	question.innerHTML = currentQuestion.question; // soruları h2 etiketine gömdük.
	console.log(currentQuestion);
	choices.forEach((choice) => {
		const number = choice.dataset["number"]; // html dataset olarak herbir elemente sayı vermiştik.. ona ulaştık.
		choice.innerText = currentQuestion["choice" + number]; // currentQuestion['choice1-2-3-4'] vs anlamına geliyor.
		// console.log(choice);
	});

	availableQuestions.splice(questionIndex, 1); // gösterilen-kullanılan soruyu, arrayden siliyoruz..

	acceptingAnswers = true;
};

// Event ekleme kısmı

choices.forEach((choice) => {
	choice.addEventListener("click", (e) => {
		//console.log(e.target);
		if (!acceptingAnswers) return; // eğer cevaplanacak soru kalmadıysa fonk. çalışmayacak.

		acceptingAnswers = false;
		const selectedChoice = e.target;
		const selectedAnswer = selectedChoice.dataset["number"]; // bunu objedeki doğru cevap ile karşılaştıracaz.

		const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
		// butonlara tıkladıktan sonra cevap kontrolü için class ekleme, stillendirme için yapıyoruz.. cevap doğru ise elemente 'correct' class ı eklenecek. yanlış ise 'incorrect' classı eklenecek...



		if (classToApply === "correct") {
			// her doğru cevapta puan arttırma işlemi...
			
			incrementScore(CORRECT_BONUS);
		} else {
			console.log(currentQuestion.incorrect_answers);
		}
		selectedChoice.parentElement.classList.add(classToApply); // seçilen butonun parent elementine class eklenecek.
		setTimeout(() => {
			selectedChoice.parentElement.classList.remove(classToApply);
			// seçilen butonda birden fazla class olmasın diye parent elementinden class silinecek...
			getNewQuestion(); // tıklama yapıldıktan sonra bir sonraki soruya geçiş yapılacak...
		}, 1000);
	});
});

incrementScore = (num) => {
	score += num;
	scoreText.innerText = score;
};
