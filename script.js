const body = document.querySelector('.quizBody');

const question__counter = document.querySelector(".question__counter");
const question__text = document.querySelector(".question__text");

const radioButtons = document.querySelectorAll(".quizBody__answerOption-selector")

const answerOption1 = document.querySelector(".answerOption1>span");
const answerOption2 = document.querySelector(".answerOption2>span");
const answerOption3 = document.querySelector(".answerOption3>span");
const answerOption4 = document.querySelector(".answerOption4>span");

const nextButton = document.querySelector(".quizBody>button");

const BUTTONS = {
    status : {
        disabled: true,
        enabled: false,
    },
    class : {
        disabled: "quizBody__nextButton-disabled",
        enabled : "quizBody__nextButton",
    },
    color : {
        disabled: "white",
        enabled: "cadetblue",
    },
    innerText: {
        result: "Перейти к результатам",
        reset: "Попробовать ещё раз",
    },
}

const RESULT = {
    text: {
        class: "resultText",
        innerText: ()=>{return `Правильных ответов : 
        ${Number(sessionStorage.getItem('corretAnswersTotal'))} из ${(getQuestions()).length}`
    }},
    page: {
        class: "resultPage"
    }
}

fetch('questions.json').then(response => response.json()).then(data => {setQuestions(data); renderPage()})

function initializeQuestions(){
    sessionStorage.setItem("currentQuestion", 0);
    return sessionStorage.getItem("currentQuestion");
}

function getQuestions(){
    return JSON.parse(sessionStorage.getItem("questions"));
}

function setQuestions(arr){
    sessionStorage.setItem("questions", JSON.stringify(arr));
}

function answerOnClick(option){
    nextButton.className = BUTTONS.class.enabled;
    nextButton.disabled = BUTTONS.status.enabled;
    nextButton.addEventListener('click', nextQuestion)
    const button = document.querySelector(`.${option}>input[type="radio"]`);
    const answers = document.querySelectorAll(".quizBody__answerOption")
    button.checked = 'checked';
    answers.forEach((el)=>{
        const currentButton = el.querySelector('input[type="radio"]');
        if (currentButton.checked){
            el.style.background = BUTTONS.color.enabled;
        } else {
            el.style.background = BUTTONS.color.disabled;
        }
    })
}

function renderPage(){
    let currentQuestion = sessionStorage.getItem('currentQuestion') || initializeQuestions();
    const questions = getQuestions();
    if (questions[currentQuestion]){
        const question = questions[currentQuestion];
        question__counter.textContent = `${+currentQuestion + 1}/${questions.length}`
        question__text.textContent = question.questionText;
        answerOption1.textContent = question["option1"];
        answerOption2.textContent = question["option2"];
        answerOption3.textContent = question["option3"];
        answerOption4.textContent = question["option4"];
        if (currentQuestion == questions.length - 1) {
            nextButton.innerText = BUTTONS.innerText.result;
            nextButton.disabled  = BUTTONS.status.disabled;
        }
    } else {
        nextButton.className = BUTTONS.class.disabled;
        const toHide = document.querySelectorAll('.quizBody>*')
        toHide.forEach((el)=>{
            el.style.display = 'none';
        })
        getScore();
    }
}

function nextQuestion(){
    const answers = document.querySelectorAll(".quizBody__answerOption");
    const questions = getQuestions();
    sessionStorage.setItem("currentQuestion", Number(sessionStorage.getItem("currentQuestion")) + 1);
    nextButton.className = BUTTONS.class.disabled;
    nextButton.disabled = BUTTONS.status.disabled;
    answers.forEach((el)=>{
        const currentButton = el.querySelector('input[type="radio"]');
        if (currentButton.checked == true){
            const userAnswerText = document.querySelector(`.${el.classList[1]}>span`);
            questions[sessionStorage.getItem("currentQuestion") - 1].userAnswer = userAnswerText.textContent;
        }
        el.style.background = BUTTONS.color.disabled;
        currentButton.checked = false;
    })
    setQuestions(questions);
    renderPage();
}

function getScore(){
    const questions = getQuestions();
    let corretAnswersTotal = 0;
    questions.forEach((el)=>{
        if(el.userAnswer == el.correctAnswer){
            corretAnswersTotal += 1;
        }
        sessionStorage.setItem("corretAnswersTotal", corretAnswersTotal);
    })
    const resultPage = document.createElement('div');
    resultPage.className = RESULT.page.class;
    
    const resultText = document.createElement('span');
    resultText.className = RESULT.text.class; 
    resultText.innerText = RESULT.text.innerText();
    
    const resetButton = document.createElement('button');
    resetButton.className = BUTTONS.class.enabled;
    resetButton.onclick = resetQuiz;
    resetButton.innerText = BUTTONS.innerText.reset;
    resultPage.appendChild(resultText);
    resultPage.appendChild(resetButton);
    body.appendChild(resultPage);
}

function resetQuiz(){
    sessionStorage.setItem("corretAnswersTotal", 0);
    sessionStorage.setItem("currentQuestion", 0);
    const resultPage = document.querySelector(".resultPage")
    resultPage.remove();
    const toShow = document.querySelectorAll('.quizBody>div');
    toShow.forEach((el)=>{
        el.style.display = 'flex';
    })
    const button = document.querySelector('.quizBody>button');
    button.style.display = 'block';
    button.className = BUTTONS.class.disabled;
    button.disabled = BUTTONS.status.disabled;
    renderPage();
}