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

function render(tasks){
    
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val() || {}; // Fallback to an empty object
        const dataArray = Object.values(data);
        const taskList = document.getElementById("ul-el")
        taskList.innerHTML = ""; // Clear the list before updating

        if (data) {
            Object.keys(data).forEach((key) => {
            const task = data[key];

            // Create an <li> element for each task
            const li = document.createElement("li");
            li.id = "key"; // Use the key as the id for easy reference
            li.innerHTML = `
            <p>${task}</p>
            <div class="functions">
            <input type="checkbox" id="checkbox">
            <button class="deleteButton"><i class="fas fa-trash"></i></button>
            </div>
            `;

            // Append the task to the list
            taskList.appendChild(li);
        
            // Attach event listener to the delete button
            const deleteButton = li.querySelector(".deleteButton");
            deleteButton.addEventListener("click", () => {
            deleteTask(key);
            })
        })
      }
    })
}

  // Function to delete a task
  function deleteTask(taskId) {
    const taskRef = ref(database, `taskItem/${taskId}`);
    remove(taskRef)
      .then(() => {
        console.log(`Task ${taskId} deleted successfully.`);
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
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
})