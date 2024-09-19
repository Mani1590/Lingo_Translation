selectTag=document.querySelectorAll("select");
selectTag.forEach((tag,id)=>{
    for (const country_code in countries){
        let selected;
        if(id==0 && country_code=="en-GB"){
            selected="selected";
        }else if(id==1 && country_code=="hi-IN"){
            selected="selected";
        }
        let option=`<option value="${country_code}"${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend",option);
    }
});

const fromText=document.querySelector(".from-text");
const toText=document.querySelector(".to-text");
translateBtn=document.querySelector("button");
translateBtn.addEventListener("click",()=>{
    let text=fromText.value,
    translatrFrom=selectTag[0].value,
    translatrTo=selectTag[1].value;
    let apiUrl=`https://api.mymemory.translated.net/get?q=${text}&langpair=${translatrFrom}|${translatrTo}`;
    fetch(apiUrl)
    .then(res=> res.json())
    .then(data=>{
        toText.value=data.responseData.translatedText;
    });
});

exchangeIcon=document.querySelector(".exchange");
exchangeIcon.addEventListener("click",()=>{
    // for lang(select tag) exchange 
    let tempLang=selectTag[0].value;
    selectTag[0].value=selectTag[1].value;
    selectTag[1].value=tempLang;
    // for text exchange
    let tempText=fromText.value;
    fromText.value=toText.value;
    toText.value=tempText;
});

icons = document.querySelectorAll(".row i");
icons.forEach(icon => {
    icon.addEventListener("click", async ({ target }) => {
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                await navigator.clipboard.writeText(fromText.value);
            } else {
                await navigator.clipboard.writeText(toText.value);
            }
        }

        if (target.classList.contains("fa-volume-up")) {
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }

            if (utterance.text.trim() !== "") {
                window.speechSynthesis.speak(utterance);
            }
        }
    });
});

// Add voice detection (speech recognition) with animation
const micIcon = document.querySelector(".fa-microphone");

micIcon.addEventListener("click", () => {
    // Check if the browser supports the Web Speech API
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = selectTag[0].value; // Set the language for recognition
        recognition.continuous = false; // Stop recognition after one result
        recognition.interimResults = false;

        // Start recognition and add animation
        recognition.start();
        micIcon.classList.add("listening"); // Add the 'listening' animation class

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            fromText.value = speechResult; // Update the textarea with recognized speech
        };

        recognition.onend = () => {
            micIcon.classList.remove("listening"); // Remove animation when recognition ends
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            alert("Error recognizing speech. Please try again.");
            micIcon.classList.remove("listening"); // Remove animation in case of an error
        };
    } else {
        alert("Speech recognition is not supported in this browser.");
    }
});


// for clicked in css
document.querySelectorAll('i').forEach(element => {
    element.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 185); // Reverts back to the original color after 0.185ms
    });
});

