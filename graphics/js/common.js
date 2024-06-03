const infoBarTextBoxElement = document.getElementById("info-bar-text-box");
let presentationData = [];
let noticeData = [];

const generateNoticeLi = (numBuff) => {
    let num = numBuff;
    const li = document.createElement("li");
    while (1) {   // 特殊通知の場合はその通知を行う必要があるか、行う情報があるか比較し、必要ならその通知を、なければ次の通知の確認を行う。
        if (num >= noticeData.length) { // 通知が最後まで行われた場合、最初に戻る
            num = 0;
        }

        const notice = noticeData[num];

        if (notice.indexOf("$schedule") !== -1) {  // スケジュール通知。スケジュールIDを取得し、該当するスケジュールがあるか確認する。
            const scheduleID = Number(notice.split(" ")[1]);
            const scheduleNum = Number(presentationNum) + scheduleID;
            if (scheduleNum < presentationData.length) {  // スケジュールが存在する場合、そのスケジュールの情報を取得し、出力する。
                const scheduleData = presentationData[scheduleNum];
                li.innerText = "この後のプログラム ▶ " + scheduleData.time + " - 「" + scheduleData.title + "」";
                li.setAttribute("data-num", num);
                break;
            }
        }

        else {  // 通常通知。そのまま出力する。
            li.innerText = notice;
            li.setAttribute("data-num", num);
            break;
        }
        num++;
    }
    return li;
}

const loadData = () => {
    return new Promise((resolve, reject) => {
        fetch("./json/presentation.json")
        .then(response => response.json())
        .then(presentationDataBuff => {
            presentationData = presentationDataBuff;
            fetch("./json/notice.json")
                .then(response => response.json())
                .then(noticeDataBuff => {
                    noticeData = noticeDataBuff;
                    resolve();
                });
        });
    });
}

const nextNotice = () => {
    // すでにoutのものを消す
    const outScreenNoticeElementsList = Array.from(infoBarTextBoxElement.getElementsByClassName("out"));
    outScreenNoticeElementsList.forEach(element => {
        element.remove();
    });

    // 今の要素を外に追いやる
    const currentNoticeElement = infoBarTextBoxElement.firstElementChild;
    currentNoticeElement.classList.remove("in");
    currentNoticeElement.classList.add("out");

    // 次の要素を追加
    let nextNum = Number(currentNoticeElement.getAttribute("data-num")) + 1;
    if (nextNum >= noticeData.length) {
        nextNum = 0;
    }
    const nextNoticeElement = generateNoticeLi(nextNum);
    nextNoticeElement.classList.add("in");
    infoBarTextBoxElement.appendChild(nextNoticeElement);
}

setInterval(nextNotice, 10000);