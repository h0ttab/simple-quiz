const body = document.querySelector('.quizBody');

const question__counter = document.querySelector(".question__counter");
const question__text = document.querySelector(".question__text");

const radioButtons = document.querySelectorAll(".quizBody__answerOption-selector")

const answerOption1 = document.querySelector(".answerOption1>span");
const answerOption2 = document.querySelector(".answerOption2>span");
const answerOption3 = document.querySelector(".answerOption3>span");
const answerOption4 = document.querySelector(".answerOption4>span");

const nextButton = document.querySelector(".quizBody>button");

class Question {

    constructor(text, o1, o2, o3, o4, correct){
        this.orderNumber = this.getOrderNumber();
        this.questionText = text;
        this.option1 = o1;
        this.option2 = o2;
        this.option3 = o3;
        this.option4 = o4;
        this.correctAnswer = correct;
    }

    getOrderNumber = ()=> {
        const count = +sessionStorage.getItem("questionsTotalCount");
        if (count){
            sessionStorage.setItem("questionsTotalCount", +sessionStorage.getItem("questionsTotalCount") + 1)
            return +sessionStorage.getItem("questionsTotalCount");
        } else {
            sessionStorage.setItem("questionsTotalCount", 1);
            return 1
        }
    }
}

const questions = [new Question('Столица США?', 'Вашингтон', "Сиэттл", "Нью-Йорк", "Даллас", "Вашингтон"), new Question('Как звали Пушкина?', 'Алексей', "Александр", "Андрей", "Анатолий", "Александр")]

function answerOnClick(option){
    nextButton.className = "quizBody__nextButton";
    nextButton.removeAttribute('disabled');
    nextButton.addEventListener('click', nextQuestion)
    const button = document.querySelector(`.${option}>input[type="radio"]`);
    const answers = document.querySelectorAll(".quizBody__answerOption")
    button.checked = 'checked';
    answers.forEach((el)=>{
        const currentButton = el.querySelector('input[type="radio"]');
        if (currentButton.checked){
            el.style.background = 'cadetblue';
        } else {
            el.style.background = 'white';
        }
    })
}

function renderPage(){
    let currentQuestion;
    if (sessionStorage.getItem("currentQuestion")){
        currentQuestion = sessionStorage.getItem("currentQuestion");
    } else {
        sessionStorage.setItem("currentQuestion", 0);
        currentQuestion = sessionStorage.getItem("currentQuestion");
    }
    if (questions[currentQuestion]){
        const question = questions[currentQuestion];
        question__counter.textContent = `${question.orderNumber}/${questions.length}`
        question__text.textContent = question.questionText;
        answerOption1.textContent = question["option1"];
        answerOption2.textContent = question["option2"];
        answerOption3.textContent = question["option3"];
        answerOption4.textContent = question["option4"];
        if (question.orderNumber == questions.length) {
            nextButton.textContent = 'Перейти к результатам'
            nextButton.addEventListener('click', getScore)
            nextButton.disabled  = 'disabled'
        }
    } else {
        nextButton.className = "quizBody__nextButton-disabled";
        const toHide = document.querySelectorAll('.quizBody>*')
        toHide.forEach((el)=>{
            el.style.display = 'none';
        })
    }
}

function nextQuestion(){
    const answers = document.querySelectorAll(".quizBody__answerOption");
    sessionStorage.setItem("currentQuestion", +sessionStorage.getItem("currentQuestion") + 1);
    nextButton.className = "quizBody__nextButton-disabled";
    answers.forEach((el)=>{
        const currentButton = el.querySelector('input[type="radio"]');
        if (currentButton.checked == true){
            const userAnswerText = document.querySelector(`.${el.classList[1]}>span`);
            questions[sessionStorage.getItem("currentQuestion") - 1].userAnswer = userAnswerText.textContent;
        }
        el.style.background = 'white';
        currentButton.checked = false;
    })
    renderPage();
}

function getScore(){
     let corretAnswersTotal = 0;
    questions.forEach((el)=>{
        if(el.userAnswer == el.correctAnswer){
            corretAnswersTotal += 1;
        }
    })
    const resultPage = document.createElement('div');
    resultPage.className = 'resultPage';
    
    const resultText = document.createElement('span');
    resultText.className = 'resultText'; 
    resultText.innerText = `Правильных ответов : 
    ${corretAnswersTotal} из ${questions.length}`;
    
    resultPage.appendChild(resultText);
    body.appendChild(resultPage);
}

renderPage();