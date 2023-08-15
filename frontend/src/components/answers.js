'use strict';

import {UrlManager} from "./utils/url-manager.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";


export class Answers {

    constructor() {
        this.quiz = null;
        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    async init() {

        const userInfo = Auth.getUserInfo();

        if (this.routeParams.id) {
            try {

                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId + '?userEmail=' + userInfo.userEmail);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error)
                    }
                    this.quiz = result;

                    document.getElementById('pre-title').innerHTML = result.test.name;
                    document.getElementById('user-data').innerHTML = userInfo.fullName + ', ' + userInfo.userEmail;

                    this.showQuestions();
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    showQuestions() {

        const allQuestions = document.getElementById('all-questions');
        let questionsArr = this.quiz.test.questions;

        questionsArr.forEach((item, index) => {

            const titleElement = document.createElement('div');
            titleElement.className = 'question-title';
            titleElement.innerHTML = '<span>Вопрос ' + [index + 1] + ':</span> ' + item.question;

            let optionsAnswers = item.answers;

            const optionsGroup = document.createElement('div');
            optionsGroup.className = 'answer-options'
            optionsGroup.appendChild(titleElement);

            for (let r = 0; r < optionsAnswers.length; r++) {

                let opt = optionsAnswers[r];
                const answerElement = document.createElement('div');
                answerElement.className = 'answer-option';

                const inputId = 'answer-' + opt.id;

                const inputElement = document.createElement('input');

                inputElement.setAttribute('id', inputId);
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('name', 'answer');
                inputElement.setAttribute('value', opt.id);

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = opt.answer;

                let correct = opt.correct;

                if (correct === true) {
                    labelElement.style.color = '#5FDC33';
                    inputElement.style.borderColor = '#5FDC33';
                    inputElement.style.borderWidth = '6px';
                } else if (correct === false) {
                    labelElement.style.color = '#DC3333';
                    inputElement.style.borderColor = '#DC3333';
                    inputElement.style.borderWidth = '6px';
                }

                answerElement.appendChild(inputElement);
                answerElement.appendChild(labelElement);
                optionsGroup.appendChild(answerElement);
            }
            allQuestions.appendChild(optionsGroup);
        })

        const backToResults = document.getElementById('back');
        backToResults.addEventListener('click', () => {
            location.href = '#/result?id=' + this.routeParams.id;
        })
    }
}
