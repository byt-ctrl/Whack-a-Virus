// DOM references
const introScreen=document.getElementById('introScreen') ;
const gameScreen=document.getElementById('gameScreen') ;
const holes=document.querySelectorAll('.hole') ;
const scoreEl=document.getElementById('score') ;
const highScoreEl=document.getElementById('highScore') ;
const timerEl=document.getElementById('timer') ; 
const darkModeToggle=document.getElementById('darkModeToggle') ;
const soundToggle=document.getElementById('soundToggle') ;
const levelButtons=document.querySelectorAll('.level-buttons button') ;

let score=0;
let highScore=localStorage.getItem('highScore') || 0;
let timeLeft=30;
let spawnSpeed=1000;
let isGameRunning=false;
let gameInterval,virusTimeout;
let isSoundEnabled=true;  // default sound is enabled

// difficulty settings
const settings= 
{
  easy:{ time:30,speed:1200 },
  medium:{ time:30,speed:800 },
  hard:{ time: 30,speed:500 }
};

highScoreEl.textContent=highScore;

function startGame(level) 
{
  const config=settings[level];
  spawnSpeed=config.speed;
  timeLeft=config.time;

  // reset UI
  score=0;
  scoreEl.textContent=score;
  timerEl.textContent=timeLeft;
  holes.forEach(h=>h.innerHTML=''); // clear holes

  // show game screen
  introScreen.classList.remove('active');
  gameScreen.classList.add('active');
  isGameRunning=true;

  disableLevelButtons();

  gameInterval=setInterval(updateTimer,1000);
  showVirus();
}

function updateTimer() 
{
  timeLeft--;
  timerEl.textContent=timeLeft;

  if (timeLeft<=0) 
    {
    endGame();
  }
}

function showVirus() 
{
  if (!isGameRunning) return;

  const hole=holes[Math.floor(Math.random()*holes.length)];
  const virus=document.createElement('img');
  virus.src='assets/virus.png';
  virus.className='virus';

  // removes the virus after a certain time 
  const virusRemovalTimeout = setTimeout(() => 
    {   
    virus.remove() ;
  }, 800); // virus will disappear after 0.8 seconds if not clicked

  // if the virus is clicked
  virus.onclick = () => 
    {
    clearTimeout(virusRemovalTimeout) ; // stop the timeout for virus removal
    score++;
    scoreEl.textContent=score;
    if (isSoundEnabled) playSound() ;  // play sound if enabled
    virus.remove() ; // remove virus immediately
  };

  hole.innerHTML=''; // clear previous virus if any
  hole.appendChild(virus) ;

  virusTimeout=setTimeout(showVirus,spawnSpeed) ; // show a new virus after the specified spawn speed
}

function endGame() 
{
  clearInterval(gameInterval) ;
  clearTimeout(virusTimeout) ;
  isGameRunning=false;

  // play game over sound if enabled
  if (isSoundEnabled) playGameOverSound();

  // save high score
  if (score>highScore) 
    {
    highScore=score;
    localStorage.setItem('highScore',highScore);
    highScoreEl.textContent=highScore;
  }

  setTimeout(() => 
    {
    alert(`Game Over! Your score : ${score}`);
    resetGame();
  },200);
}

function resetGame() 
{
  clearInterval(gameInterval);
  clearTimeout(virusTimeout);
  holes.forEach(h=>h.innerHTML=''); // clear holes

  gameScreen.classList.remove('active');
  introScreen.classList.add('active');
  enableLevelButtons();
}

function disableLevelButtons() 
{
  levelButtons.forEach(btn=>btn.disabled=true);
}

function enableLevelButtons() 
{
  levelButtons.forEach(btn=>btn.disabled=false);
}

// SOUND EFFECT FUNCTION FOR HITTING A VIRUS
function playSound() 
{
  const sound=new Audio('assets/hit.wav');
  sound.play();
}

// SOUND EFFECT FUNCTION FOR GAME OVER
function playGameOverSound() 
{
  const sound=new Audio('assets/succes.wav');
  sound.play();
}

// dark Mode Setup
darkModeToggle.addEventListener('change', () => 
    {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode',document.body.classList.contains('dark'));
});

// sound toggle setup
soundToggle.addEventListener('change',()=>
    {
  isSoundEnabled=soundToggle.checked;
  localStorage.setItem('soundEnabled',isSoundEnabled);
});

// load saved preferences (dark mode and sound)
if (localStorage.getItem('darkMode')==='true') 
    {
  document.body.classList.add('dark');
  darkModeToggle.checked=true;
}

if (localStorage.getItem('soundEnabled')==='false') 
    {
  isSoundEnabled=false;
  soundToggle.checked=false;
}


/* END */