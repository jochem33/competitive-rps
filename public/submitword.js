const wordInputs = document.getElementsByClassName("wordsBox")

// when enter is pressed on an input, sent the word to the server
wordInputs.forEach(el => el.addEventListener('keyup', event => {
    if (event.key === "Enter") {
        if(gamestate == "WAIT"){
            const wordvalue = event.target.value
            const wordType = event.target.id
            console.log("enter pressed", wordvalue, wordvalue.length, event.target.id)
            if(wordvalue.length > 2) {
                event.target.disabled = true
                console.log("submit". wordvalue)
                socket.emit("wordSubmission", [wordType, wordvalue.toLowerCase()])
            }
        } else if(gamestate == "DRAW") {
            if(words[event.target.id].toLowerCase() == event.target.value.toLowerCase()){
                event.target.disabled = true
                socket.emit("wordGuessed", [nickname])
            } else {
                event.target.value = ""
            }
        }
    }
}))
