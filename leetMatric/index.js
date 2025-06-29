document.addEventListener("DOMContentLoaded", function () {
    let searchButton = document.getElementById("search-btn");
    let userInput = this.getElementById("search");
    let statsCont = document.querySelector(".stats-container");
    let easyProgress = document.querySelector(".easy-progress");
    let mediumProgress = document.querySelector(".medium-progress");
    let hardProgress = document.querySelector(".hard-progress");
    let easyLabel = document.getElementById("easy-label");
    let mediumLabel = document.getElementById("medium-label");
    let hardLabel = document.getElementById("hard-label");
    let statsCards = document.querySelector(".stats-cards");




    function validateUserName(username) {

        if (username.trim() === "") {
            alert("please enter a username");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,15}$/; //regular inspection to validate username by chatgpt
        let isValid = regex.test(username);
        if (!isValid) {
            alert("invalid username");
        }
        return isValid;
    }




    async function fetchUserData(username) {
        try {
            searchButton.textContent = "loading...";
            searchButton.disabled = true;


            //post request to leetcode graphql api to get user data
            let proxyUrl ='https://cors-anywhere.herokuapp.com/';
            let targetUrl = `https://leetcode.com/graphql/`;
            let myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            let graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            let requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            //api fetch request
            let response = await fetch(proxyUrl+targetUrl, requestOptions);
            if (!response.ok) {
                throw new Error("unable to fetch user data");
            }

            let parsedData = await response.json();
            console.log("logging data", parsedData);

            displayUserData(parsedData);

        }

        catch (error) {
            statsCont.innerHTML = `<p id="error-mesg"> no data found for this user</p> `;
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
        function updateProgress(total, solved , label , circle){
         let progressDegree =(solved/total)*100;
         circle.style.setProperty("--progress-degree", `${progressDegree}%`);
         label.textContent =`${solved}/${total}`;

        }

        function displayUserData(parsedData){
             let totalQues=parsedData.data.allQuestionsCount[0].count;
             let totalEasyQues=parsedData.data.allQuestionsCount[1].count;
             let totalMediumQues=parsedData.data.allQuestionsCount[2].count;
             let totalHardQues=parsedData.data.allQuestionsCount[3].count;

             let solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
             let solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
             let solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
             let solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

             updateProgress(totalEasyQues, solvedTotalEasyQues, easyLabel , easyProgress);
             updateProgress(totalMediumQues, solvedTotalMediumQues, mediumLabel , mediumProgress);
             updateProgress(totalHardQues, solvedTotalHardQues , hardLabel , hardProgress);

             //cards are inserted dynamically

            let cardsDetails =[
                {label: "total submission", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
                {label: "total easy submission", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
                {label: "total medium submission", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
                {label: "total hard submission", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions}
            ]
            console.log("logging card details", cardsDetails);
             

            statsCards.innerHTML= cardsDetails.map(
                data =>`
                <div id = "card">
                <h2>${data.label}</h2>
                <p>${data.value}</p>
                </div>`
            ).join("");             

        }
    }
    searchButton.addEventListener('click', function () {
        let username = userInput.value.trim();
        console.log("logggin username: ", username);
        if (validateUserName(username)) {
            fetchUserData(username);
        }
    })
});