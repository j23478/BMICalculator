
window.onload=function(){
   displayLocalStorage();
};

let deleteBtn;
let selectAllBtn;
let stat = document.querySelector("div[class='status']")
let icon = document.querySelector(".statusIcon")
let word = document.querySelector(".statusWord")
let heightField = document.getElementById("height")
let weightField = document.getElementById("weight")
let btn = document.querySelector(".btn")
let table = document.querySelector(".record")


//檢查輸入的值是合法
parseStringtoNum = function(el){
    //是否為空字串
    if (el.value == ""){
        el.classList.add("emptyValue")
        return false;
    }else{
        //檢查是否可轉成數字(Number)和是否大於0
        let val = parseInt(el.value);
        if (!isNaN(val) && val > 0){
            el.classList.remove("emptyValue")    
            return val;
        }else{
            el.classList.add("emptyValue")
            return false;
        };
    };
};

//改變樣式
changeStyle = function(statClass, iconClass, wordClass, result, wordText, record){
    stat.children[0].textContent = result.toFixed(2);
    stat.setAttribute("class", "status " + statClass);
    icon.setAttribute("class", "statusIcon " + iconClass);
    word.setAttribute("class", "statusWord " + wordClass);
    word.textContent = wordText;
    return [record, wordText]
};

//get localStorage
getLocalStorage = function(){
    let currentRecord = localStorage.getItem("bmiRecord");
    if (currentRecord  == null){
        return [];
    }else{
        return JSON.parse(currentRecord);
    };
};


//save localstorage
saveLocalStorage = function(record, wordText, bmiResult, height , weight ,recordDate){
    //會拿到陣列
    let currentRecord = getLocalStorage(); 

    let bmiRecord = {
        "record":record,
        "wordText":wordText, 
        "bmiResult":bmiResult, 
        "height":height, 
        "weight":weight ,
        "recordDate":recordDate
    };
    currentRecord.push(bmiRecord);
    localStorage.setItem("bmiRecord", JSON.stringify(currentRecord)); 
};

//update table from localstorage

displayLocalStorage = function(){
    let currentRecord = getLocalStorage();
    if (currentRecord.length == 0){
        table.innerHTML = "<h2>目前沒有任何紀錄喔!~~~</h2>";
    }else{
        let recordStr = ""; 
        for(i=currentRecord.length-1;i>=0;i--){
            recordStr = `${recordStr}<tr>\
                <td><input type="checkbox" value="${i}"></td>\
                <td class="${currentRecord[i].record}">${currentRecord[i].wordText}</td> \
                <td><span>BMI</span> ${currentRecord[i].bmiResult.toFixed(2)}</td> \
                <td><span>weight</span> ${currentRecord[i].weight}kg</td> \
                <td><span>height</span> ${currentRecord[i].height}cm</td> \
                <td class="date">${currentRecord[i].recordDate}</td> \
            </tr>`
        };
        table.innerHTML = "<th><button class='delete'>刪除選擇的紀錄</button></th><th><button class='selectAll'>全選</button></th>"+ recordStr;
        // 確定渲染後再綁上
        deleteBtn = document.querySelector(".delete")
        deleteBtn.addEventListener("click", removeCheckedItem, false)
        selectAllBtn = document.querySelector(".selectAll")
        selectAllBtn.addEventListener("click", selectAll, false)
    };
};


//依據算出來的BMI判斷執行哪個style
decideStyle = function(result){
    let record = [];
    switch (true){
        case (result < 18.5):
            record = changeStyle("thinStatus", "thinIcon", "thinStatusWord", result, "過輕", "thinRecord");
            break;

        case (result < 25):
            record = changeStyle("goodStatus", "goodIcon", "goodStatusWord", result, "理想", "goodRecord");
            break;

        case (result < 30):
            record = changeStyle("overStatus", "overIcon", "overStatusWord", result, "過重", "overRecord");
            break;

        case (result < 35):
            record = changeStyle("littleStatus", "littleIcon", "littleStatusWord", result, "輕度肥胖", "littleRecord");
            break;

        case (result < 40):
            record = changeStyle("mediumStatus", "mediumIcon", "mediumStatusWord", result, "中度肥胖", "mediumRecord");
            break;

        default:
            record = changeStyle("overFatStatus", "overFatIcon", "overFatStatusWord", result, "重度肥胖", "overFatRecord");
            break;

        
    };
    return record;
};


//calculate
caculateBMI = function(e){
    let heightValue = parseStringtoNum(heightField)
    let weightValue = parseStringtoNum(weightField)
    // 只要parse不成數值或數值小於0 都會回傳false
    if (heightValue && weightValue){  
        let result = weightValue/ (heightValue/100) ** 2;
        //display 再算一次的按鍵
        btn.setAttribute("style", "display:block")
        let record = decideStyle(result);
        //store result into localStorage
        //function(wordText, bmiResult, height , weight ,recordDate)
        let today = new Date()
        todayFormat = today.toLocaleString("en-GB",{year: "numeric", month: "2-digit", day: "2-digit"}).replaceAll("/", "-");
        saveLocalStorage(record[0], record[1], result, heightValue, weightValue, todayFormat);
        displayLocalStorage();
    }else{
        alert("請檢查紅色框框中是否有輸入錯誤!!")
    };
};



//remove select checked item
removeCheckedItem = function(){
    let checkedItem = document.querySelectorAll("input[type='checkbox']:checked")
    let localStorageList = getLocalStorage()
    console.log(checkedItem);
    if (checkedItem.length == 0){
        alert("請選擇要刪除的紀錄");
    }else{
        let c = 0
        // 利用有排序的特性可以直接loop
        for(i=checkedItem.length-1;i>=0;i--){
            let itemIndex = checkedItem[i].value - c
            localStorageList.splice(itemIndex, 1)
            c = c + 1;
        };
        localStorage.setItem("bmiRecord", JSON.stringify(localStorageList));
        displayLocalStorage();
    };
};

//select all
selectAll = function(){
    let selectAllItem = document.querySelectorAll("input[type='checkbox']")
    for (i=0;i<selectAllItem.length;i++){
        selectAllItem[i].checked= true;
    };
};



//caculate
stat.addEventListener("click", caculateBMI, false)

//再算一次button
btn.addEventListener("click", function(e){
    stat.setAttribute("class", "status");
    icon.setAttribute("class", "statusIcon");
    word.setAttribute("class", "statusWord");
    stat.children[0].textContent = "看結果";
    btn.setAttribute("style", "display:none");
    heightField.value = "";
    weightField.value = "";
}, 
false);
