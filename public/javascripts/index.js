// Page elements:
var questionViewWrap = document.getElementById('questionViewWrap'),
    userInfo = document.getElementById('userInfo'),
    questionNumber = document.getElementById('questionNumber'),
    questionContent = document.getElementById('questionContent'),

    greetBox = document.getElementById('greetBox');
    answer1 = document.getElementById('answer1'),
    answer2 = document.getElementById('answer2'),
    answer3 = document.getElementById('answer3'),
    answer4 = document.getElementById('answer4'),
    user_name = document.getElementById('greetBoxUsernameInput'),

    popupWrap = document.getElementById('popupWrap'),
    popupMessageUsername = document.getElementById('popupMessageUsername'),
    popupMessageScore = document.getElementById('popupMessageScore'),
    popupMessageStreak = document.getElementById('popupMessageStreak'),

    notification = document.getElementById('notify'),
    notify_title = document.getElementById('notify_title'),
    notify_wrap = document.getElementById('wrap');

var currentQuestion = 0,
    currentUser = {
    "username": '',
    "userScore": 0,
    "currentStreak": 0,
    "highestStreak": 0
};

// Server requests and display:

var assessQuestionResult = (chosenAnswer) => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST","/validateanswer", true);
    xmlhttp.setRequestHeader('Content-type',"application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = () =>{
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            xmlhttpResult = JSON.parse(xmlhttp.responseText)
            currentUser = xmlhttpResult.currentUser
            if (xmlhttpResult.result == true) {
                displayNotification('right');
            }
            else {
                displayNotification('wrong');
            }
            populatePopupResult();
        }
    };
    xmlhttp.send(`questionNumber=${currentQuestion}&chosenAnswer=${chosenAnswer}`);

    // if (option === questionList[currentQuestion].answers) {
    //     displayNotification('right');
    //     userScore += pointPerQuestion + streakBonus*currentStreak;
    //     currentStreak++;
    //     if (currentStreak > highestStreak) {
    //         highestStreak = currentStreak;
    //     }
    // }
    // else {
    //     displayNotification('wrong');
    //     currentStreak = 0;
    // }
};

var storeQuizResult = () => {
    questionViewWrap.style.top = '-100vh';

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST","/storeuser", true);
    xmlhttp.setRequestHeader('Content-type',"application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = () =>{
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
            currentUser = {
                "username": '',
                "userScore": 0,
                "currentStreak": 0,
                "highestStreak": 0
            };
        }
    };
    xmlhttp.send();
    notify_wrap.style.display = 'block';
    notification.style.right = '0';
    setTimeout(() => {
        notification.style.right = '-100%';
        popupWrap.style.top = '50vh';
        setTimeout(() => {
            notify_wrap.style.display = 'none';
        }, 300)
    }, 1200);
};

var login = (event = 1) => {
    if (event == 1 || event.keyCode == '13') {
        if (user_name.value != '') {
            currentUser.username = user_name.value
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST","/login", true);
            xmlhttp.setRequestHeader('Content-type',"application/x-www-form-urlencoded");
            xmlhttp.onreadystatechange = () =>{
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    notify_title.innerHTML = `Welcome ${currentUser.username}`;
                    document.getElementById('tooltip').style.backgroundImage = 'url(/assets/images/icons/puzzle.svg)';
                    fetchQuestions();
                    console.log(xmlhttp.responseText);
                }
            };
            xmlhttp.send(`username=${currentUser.username}`);
        }
        else {
            alert('Username can not be left empty!');
        }
    }
    
} 

var populatePopupResult = () => {
    popupMessageUsername.innerHTML = currentUser.username;
    popupMessageScore.innerHTML = `SCORE: ${currentUser.userScore}`;
    popupMessageStreak.innerHTML = `HIGHEST STREAK: ${currentUser.highestStreak}`;
}

var nextQuestion = () => {
    if (currentQuestion < 9) {
        currentQuestion++;
        displayQuestion();
    }
    else {
        storeQuizResult();
    }
    
};

var fetchQuestions = () => {
    // console.log(document.styleSheets);
    username = user_name.value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST","/getquestions", true);
    xmlhttp.onreadystatechange = () =>{
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // document.getElementById('questionNumber').innerHTML = 'QUESTION ' + currentQuestion.toString();
            questionList = JSON.parse(xmlhttp.responseText);
            // console.log(questionList);
            displayQuestion();
            greetBox.style.opacity = '0';
            setTimeout(() => {
                greetBox.style.display = 'none';
            }, 300);
        }
    };
    xmlhttp.send();
};

var displayQuestion = () => {
    notify_wrap.style.display = 'block';
    questionViewWrap.style.top = '-100vh';
    setTimeout(() => {
        notification.style.right = '0';
    }, 1);
    setTimeout(() => {
        userInfo.innerHTML = `${currentUser.username} - ${currentUser.userScore}`;
        questionNumber.innerHTML = 'QUESTION ' + (currentQuestion + 1);
        questionContent.innerHTML = questionList[currentQuestion].question;
        answer1.innerHTML = questionList[currentQuestion].option1;
        answer2.innerHTML = questionList[currentQuestion].option2;
        answer3.innerHTML = questionList[currentQuestion].option3;
        answer4.innerHTML = questionList[currentQuestion].option4;
        questionViewWrap.style.top = "50vh"
        notification.style.right = '-100%';
        setTimeout(() => {
            notify_wrap.style.display = 'none';
        }, 300);
    }, 1200);
};

let displayNotification = (mode) => {
    let thumbUp = 'url(/assets/images/icons/thumb-up.svg)';
    let thumbDown = 'url(/assets/images/icons/dislike.svg)';

    if (mode === 'wrong') {
        notify_title.innerHTML = "Wrong! :(";
        document.getElementById('tooltip').style.backgroundImage = thumbDown;
    } else if ( mode === 'right') {
        notify_title.innerHTML = "Good Job! :)";
        document.getElementById('tooltip').style.backgroundImage = thumbUp;
    }
};

