let participants = [];
let currentPlayerIdx = 0;
let currentQuestionIdx = 0;
let startTime;
let timerInterval;

const questions = [
    { q: "What is 5 + 5?", o: ["10", "12", "8"], a: "10" },
    { q: "Java is a ___ language.", o: ["Markup", "Programming", "Human"], a: "Programming" }
];

function setupParticipants() {
    const count = document.getElementById('pCount').value;
    const container = document.getElementById('name-inputs');
    for (let i = 1; i <= count; i++) {
        container.innerHTML += `<input type="text" class="pName" placeholder="Participant ${i} Name"><br>`;
    }
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

async function startQuiz() {
    const inputs = document.querySelectorAll('.pName');
    participants = Array.from(inputs).map(input => input.value);
    
    // Notify Backend
    const formData = new URLSearchParams();
    participants.forEach(name => formData.append('names[]', name));
    await fetch('quiz-api?action=init', { method: 'POST', body: formData });

    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-3').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    document.getElementById('current-player').innerText = `Turn: ${participants[currentPlayerIdx]}`;
    const q = questions[currentQuestionIdx];
    document.getElementById('question-box').innerText = q.q;
    
    const optBox = document.getElementById('options-box');
    optBox.innerHTML = '';
    q.o.forEach(opt => {
        optBox.innerHTML += `<button onclick="submitAnswer('${opt}')">${opt}</button>`;
    });

    startTime = Date.now();
    startTimer();
}

function startTimer() {
    let sec = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        sec++;
        document.getElementById('timer').innerText = `Time: ${sec}s`;
    }, 1000);
}

async function submitAnswer(selected) {
    clearInterval(timerInterval);
    const timeTaken = (Date.now() - startTime) / 1000;
    const isCorrect = selected === questions[currentQuestionIdx].a;
    const points = isCorrect ? 10 : 0;

    const formData = new URLSearchParams();
    formData.append('name', participants[currentPlayerIdx]);
    formData.append('points', points);
    formData.append('time', timeTaken);
    await fetch('quiz-api?action=submitScore', { method: 'POST', body: formData });

    // Logic for next turn
    currentPlayerIdx++;
    if (currentPlayerIdx >= participants.length) {
        currentPlayerIdx = 0;
        currentQuestionIdx++;
    }

    if (currentQuestionIdx >= questions.length) {
        showLeaderboard();
    } else {
        loadQuestion();
    }
}

async function showLeaderboard() {
    document.getElementById('step-3').style.display = 'none';
    document.getElementById('step-4').style.display = 'block';
    
    const res = await fetch('quiz-api');
    const data = await res.json();
    
    let html = '<tr><th>Rank</th><th>Name</th><th>Score</th><th>Total Time</th></tr>';
    data.forEach((p, i) => {
        html += `<tr><td>${i+1}</td><td>${p.name}</td><td>${p.score}</td><td>${p.totalTime.toFixed(2)}s</td></tr>`;
    });
    document.getElementById('leaderboard-table').innerHTML = html;
}
