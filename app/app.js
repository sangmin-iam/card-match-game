const HIDDEN_CLASS_NAME = "hidden";
const SHOW_CLASS_NAME = "show-card";

const $mainContainer = document.querySelector("#main__container");
const $cardContainer = document.querySelector("#card__container");

const $startBtn = document.querySelector("#start-btn");
const $reStartBtn = document.querySelector("#restart-btn");

const $info = document.querySelector("#info");
const $infoPeopleLeft = document.querySelector("#info__people-left");
const $infoTimeLeft = document.querySelector("#info__time-left");

const $cards = [...document.querySelectorAll(".card")];
const $backs = [...document.querySelectorAll(".back")];
const $fronts = [...document.querySelectorAll(".front")];

const $finishPage = document.querySelector("#finish-page");

let peopleLeft = 8;
let timeLeft = 30;
let frontCards = [];
let clickedTwoCards = [];
let clickedCount = 0;
let timer;

function playAudio(audioName) {
  const $audio = document.querySelector(`[data-audio=${audioName}]`);
  $audio.currentTime = 0;
  $audio.volume = 0.05;
  $audio.play();
}

function stopAudio(audioName) {
  const $audio = document.querySelector(`[data-audio=${audioName}]`);
  $audio.pause();
}

function createFrontImage(i) {
  const $image = document.createElement("img");
  $image.src = `/images/image__${i}.jpg`;
  $image.dataset.cardNum = i;
  $image.classList.add("front");
  return $image;
}

function shuffleCard(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function pushFrontImages() {
  for (let i = 0; i < 8; i++) {
    frontCards.push(createFrontImage(i));
    frontCards.push(createFrontImage(i));
  }
}

function appendFrontImages() {
  shuffleCard(frontCards);
  for (let i = 0; i < $cards.length; i++) {
    $cards[i].appendChild(frontCards[i]);
  }
}

function handleStartBtn() {
  pushFrontImages();
  appendFrontImages();
  playAudio("opening");

  $infoPeopleLeft.textContent = `남은 야인: ${peopleLeft}`;
  $infoTimeLeft.textContent = `남은시간: ${timeLeft}`;

  $mainContainer.classList.toggle(HIDDEN_CLASS_NAME);
  $cardContainer.classList.toggle(HIDDEN_CLASS_NAME);
  $startBtn.classList.toggle(HIDDEN_CLASS_NAME);
  $reStartBtn.classList.toggle(HIDDEN_CLASS_NAME);
  $info.classList.toggle(HIDDEN_CLASS_NAME);
}

function startTimer() {
  timer = setTimeout(function reduce() {
    $infoTimeLeft.textContent = `남은시간: ${timeLeft}`;
    timeLeft -= 1;
    timer = setTimeout(reduce, 1000);
    if (timeLeft < 0) {
      finishGame("fail");
    } else if (peopleLeft === 0) {
      finishGame("success");
    }
  }, 1000);
}

function handleGuess(e) {
  const clickedCard = e.target.closest("figure");
  if (!clickedCard) return;
  const frontImage = clickedCard.firstChild;
  frontImage.classList.add(SHOW_CLASS_NAME);
  clickedCount += 1;
  clickedTwoCards.push(frontImage);
}

function handleMatch() {
  if (clickedCount === 2) {
    if (
      clickedTwoCards[0].dataset?.cardNum ===
        clickedTwoCards[1].dataset?.cardNum &&
      clickedTwoCards[0] !== clickedTwoCards[1] &&
      clickedTwoCards.length === 2
    ) {
      clickedTwoCards = [];
      clickedCount = 0;
      peopleLeft -= 1;
      $infoPeopleLeft.textContent = `남은 야인: ${peopleLeft}`;
      playAudio("right");
      return;
    }
    setTimeout(function () {
      clickedTwoCards.map((element) => {
        element.classList.remove(SHOW_CLASS_NAME);
        clickedCount = 0;
        clickedTwoCards = [];
      });
    }, 500);
    playAudio("wrong");
  }
}

function finishGame(game) {
  clearTimeout(timer);

  if (game === "fail") {
    playAudio("fail");
    stopAudio("opening");

    showFinishPage("fail");

    return;
  }
  playAudio("success");
  stopAudio("opening");

  showFinishPage("success");
}

function showFinishPage(imageName) {
  const figure = document.createElement("figure");
  const image = document.createElement("img");

  image.src = `./images/${imageName}.jpg`;
  figure.appendChild(image);
  $finishPage.appendChild(figure);
  $cardContainer.classList.add(HIDDEN_CLASS_NAME);
  $finishPage.classList.remove(HIDDEN_CLASS_NAME);
}

function handle_Re_StartBtn() {
  clearTimeout(timer);
  stopAudio("opening");
  stopAudio("success");
  stopAudio("fail");
  clickedCount = 0;
  timeLeft = 30;
  peopleLeft = 8;
  frontCards = [];
  tracking = [];

  $cards.map((element) => {
    element.innerHTML = "";
  });

  $cardContainer.classList.add(HIDDEN_CLASS_NAME);
  $finishPage.classList.add(HIDDEN_CLASS_NAME);
  $reStartBtn.classList.add(HIDDEN_CLASS_NAME);
  $info.classList.add(HIDDEN_CLASS_NAME);
  $startBtn.classList.remove(HIDDEN_CLASS_NAME);
  $mainContainer.classList.remove(HIDDEN_CLASS_NAME);
}

$reStartBtn.addEventListener("click", handle_Re_StartBtn);
$startBtn.addEventListener("click", handleStartBtn);
$startBtn.addEventListener("click", startTimer);
$cardContainer.addEventListener("click", handleGuess);
$cardContainer.addEventListener("click", handleMatch);
