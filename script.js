const question__counter = document.querySelector(".question__counter");
const question__text = document.querySelector(".question__text");
const answerOption1 = document.querySelector(".answerOption1");
const answerOption2 = document.querySelector(".answerOption2");
const answerOption3 = document.querySelector(".answerOption3");
const answerOption4 = document.querySelector(".answerOption4");

const radioButtons = document.querySelectorAll(".quizBody__answerOption-selector")

function answerOnClick(option){
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