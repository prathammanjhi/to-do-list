import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"
import { getDatabase,
        ref,
        push,
        onValue,
        get,
        remove
 } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
const firebaseConfig = {
    databaseURL: "https://to-do-list-54e28-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const dbRef = ref(database, "taskItem")


const inputText = document.getElementById("input-text")
const addButton = document.getElementById("add-task")

// getting the data array from database - Elements
onValue(dbRef, (snapshot) => {
    const data = snapshot.val() || {}; // Fallback to an empty object
    const dataArray = Object.values(data);
    console.log("Real-time Array:", dataArray);
    render(dataArray)
  });


// Updating the ul in index.html
let UlEl = document.getElementById("ul-el")
function render(tasks){
    let listItems = ""
    for(let i=0;i<tasks.length;i++){
        listItems += `
                        <li id="item" >
                        <p>${tasks[i]}</p>
                        <div class="functions">
                            <input type="checkbox" id="checkbox">
                        <button id="delete"><i class="fas fa-trash"></i></button>
                        </div>
                        </li>
        `
    }
    UlEl.innerHTML = listItems
}


// pushing data to database on click of add button
addButton.addEventListener("click", () => {   
    push(dbRef, inputText.value)
    inputText.value = ""
})

// fetching id's from db
onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    const taskIDs = Object.keys(data); // Get all keys (IDs) from the data
    console.log("Task IDs:", taskIDs);
})

const deleteButton = document.getElementById("delete")
onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    const taskIDs = Object.keys(data); // Get all keys (IDs) from the data
    console.log("Task IDs:", taskIDs);
    const taskRef = ref(database, `${taskIDs}`)
    deleteButton.addEventListener("click",()=>{
        delete(taskRef)
    })
})

// Deleting data from db when clicked on delete button
// const deleteButton = document.getElementById("delete")
// deleteButton.addEventListener("click", () => {

// })


// I don't know why this event is not working 
// Here I was trying to get the button clicked when enter key is pressed
// inputText.addEventListener('keyup', function(buttonClick){
    
//     if(buttonClick.key === 'Enter'){
//         buttonEvent();
//     }

// })