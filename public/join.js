// clear localstorage before storing new items
localStorage.clear()


// get form and inputs from document
let form = document.getElementById("joinForm")
let gamecode = document.getElementById("gamecode")
let nickname = document.getElementById("nickname")


// on submit, store the gamecode and nickname in localstorage and continue on normally
form.addEventListener("submit", function(){
    localStorage.setItem("gamecode", gamecode.value)
    localStorage.setItem("nickname", nickname.value)
    return true
})
