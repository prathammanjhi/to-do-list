import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"
import { getDatabase,
        ref,
        push,
        onValue,
        get,
        remove,
        set,
        off
        
 } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
const firebaseConfig = {
    databaseURL: "https://to-do-list-54e28-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const dbRef = ref(database, "taskItem")
const completedData = ref(database,"taskItem/completedTasks")
// const childRef = ref(db, "tasks/task1")

// Pushing data to database on click of add button or when Enter is pressed
const inputText = document.getElementById("input-text");
const addButton = document.getElementById("add-task");

// Add event listener for 'click' on the add button
addButton.addEventListener("click", addTask);

// Add event listener for 'keydown' event to check if Enter key is pressed
inputText.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Function to add task
function addTask() {
  // Check if inputText.value is not empty or only whitespace
  if (inputText.value.trim() !== "") {
    const newTask = {
      text: inputText.value, // Task description
      completed: false,
      disabledBox: false, // Default completed status
    };
    push(dbRef, newTask); // Push data to Firebase
    inputText.value = ""; // Clear the input field
  } else {
    alert("Please enter a value before adding."); // Optional feedback
  }
}


// getting the data array from database - Elements
onValue(dbRef, (snapshot) => {
    const data = snapshot.val() || {}; // Fallback to an empty object
    const dataArray = Object.values(data);
    console.log("Real-time Array:", dataArray);
    render(dataArray)
  });


// updating checkbox data
  function updateTaskStatus(taskId, isCompleted) {
    const taskRef = ref(database, `taskItem/${taskId}`);
    
    // Temporarily remove the listener to avoid infinite loop
    off(taskRef);  // Temporarily stop listening for changes

    // Fetch the task data from Firebase (since you need both text and completed status)
    // Here we are also setting the value true or false of is complete in db
    onValue(taskRef, (snapshot) => {
        const task = snapshot.val();  // Retrieve task data from Firebase

        // if(taskRef/completed === true){
        //   console.log("task is completed")
        // }
        
        if (task && task.completed !== isCompleted) { // Only update if the status has changed
            // Update task in Firebase with the new 'completed' status
            set(taskRef, {
                text: task.text, // Retain the current text
                completed: isCompleted,
                disabledBox: isCompleted, // Update the 'completed' status
            })
            .then(() => {
                console.log(`Task ${taskId} updated to completed: ${isCompleted}`);
            })
            .catch((error) => {
                console.error("Error updating task status:", error);
            });
        }
    });
}

// overLine if checkbox is checked
function overLine() {
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val() || {}; // Fallback to an empty object
    const dataKey = Object.keys(data);
    console.log("datakey"+dataKey)
    const taskList = document.getElementById("ul-el");

    dataKey.forEach((key) => {
      const task = data[key];  // Access the value corresponding to the key
      
      const complie = task.completed
      
      const taskElement = document.getElementById(`checkbox-${key}`);
      const grandParent = taskElement.parentNode.parentNode;
      console.log(grandParent)
      const checkedElement = taskElement.checked
      console.log(checkedElement)
      // console.log(taskElement)
      if(complie === true ){
        // grandParent.style.cssText = "text-decoration-line: line-through; text-decoration-color: grey; color grey; border: 2px solid grey; border-radius: 1em; padding: 0 1em;"
        grandParent.classList.add("checkedLine")
        taskElement.disabled = true
        
      }
      
    });
  });
}


  
  // Rendering tasks in the DOM
  function render(tasks) {
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val() || {}; // Fallback to an empty object
      const dataKey = Object.keys(data);
      console.log("datakey : "+dataKey)
      const keyValue = dataKey.text
      console.log("keyvalue :: "+keyValue)
      const taskList = document.getElementById("ul-el");
      taskList.innerHTML = ""; // Clear the list before updating
      

      // dataKey.forEach((key) => {
      //   const task = data[key];  // Access the value corresponding to the key
      //   console.log(`Task: ${key}, Description: ${task.text}, Completed: ${task.completed}`);
      // });


      dataKey.forEach((key) => {
        const task = data[key];
        // console.log("lund"+task)
        
        // Create an <li> element for each task
        const li = document.createElement("li");
        li.id = "key"; // Use the key as the id for easy reference
        li.innerHTML = `
          <div id="elements" class="functions">
            <input type="checkbox" class="checkbox" id="checkbox-${key}" ${task.completed ? 'checked' : ''}>
            <p id="task-line-${key}">${task.text}</p>
          </div>
          <div class="modifications">
            <button class="deleteButton"><i class="fas fa-trash"></i></button>
            <button class="editButton"><i class="fas fa-edit"></i></button>
          </div>
        `;
  
        // Append the task to the list
        taskList.appendChild(li);
  
        // Attach event listener to the delete button
        const deleteButton = li.querySelector(".deleteButton");
        deleteButton.addEventListener("click", () => {
          deleteTask(key); // Delete task from Firebase
        });
  
        // Attach event listener to the checkbox
       
        const checkbox = li.querySelector(".checkbox");
        checkbox.addEventListener("change", (e) => {
          if (checkbox.checked) {  // Prevent triggering if we are already updating the checkbox
            
            updateTaskStatus(key, e.target.checked = true); // Update task completion status only if changed
            // checker.classList.add("completed")
            overLine()
            
          }else{
            updateTaskStatus(key, e.target.checked = false); // Update task completion status only if changed
          }
        });
      });
    });
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


