let participants =
JSON.parse(localStorage.getItem("participants"));

let questions = [
{
question:"Capital of India?",
options:["Delhi","Chennai","Mumbai","Goa"],
answer:"Delhi"
},
{
question:"2 + 2 = ?",
options:["3","4","5","6"],
answer:"4"
},
{
question:"Java is a ?",
options:["Language","Browser","OS","Database"],
answer:"Language"
}
];

let scores=[];
let times=[];

for(let i=0;i<participants.length;i++)
{
    scores.push(0);
    times.push(0);
}

let currentPlayer=0;
let currentQuestion=0;
let startTime=Date.now();

showQuestion();

function showQuestion()
{
    document.getElementById("playerName").innerHTML =
    participants[currentPlayer];

    document.getElementById("question").innerHTML =
    questions[currentQuestion].question;

    let html="";

    questions[currentQuestion].options.forEach(option=>{
        html +=
        `<button onclick="checkAnswer('${option}')">
        ${option}
        </button><br><br>`;
    });

    document.getElementById("options").innerHTML = html;

    startTime = Date.now();
}

function checkAnswer(ans)
{
    let endTime = Date.now();

    let taken = (endTime-startTime)/1000;

    times[currentPlayer]+=taken;

    if(ans===questions[currentQuestion].answer)
    {
        scores[currentPlayer]+=10;
    }

    currentQuestion++;

    if(currentQuestion>=questions.length)
    {
        currentQuestion=0;
        currentPlayer++;
    }

    if(currentPlayer>=participants.length)
    {
        localStorage.setItem("scores",JSON.stringify(scores));
        localStorage.setItem("times",JSON.stringify(times));

        window.location.href="leaderboard.html";
    }
    else
    {
        showQuestion();
    }
}
