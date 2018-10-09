function getTodos(){
  fetch('http://127.0.0.1:8080/todos/', {method:'get'})
  .then(response =>  response.json())
  .then(data => {displayTasks(data);})
  .then(data => data)
  .catch(err => {
    console.log('Error occured with fetching ressources : ' + err)
  });
}

getTodos();

function getVersion(){
  fetch('http://127.0.0.1:8080/version/', {method:'get'})
  .then(response =>  response.json())
  .then(data => {alert("Version : " + data);})
  .then(data => data)
  .catch(err => {
    console.log('Error occured with fetching ressources : ' + err)
  });
  
}

function displayTasks(obj){
  //console.log("DISPLAYYYYYYYYYYY")
  console.dir(JSON.parse(JSON.stringify(obj)));
  
  //const underscore = require("underscore");
  //underscore.sortBy(obj, 'priority')
  
  
  for(key in obj){
    let task = new Task(obj[key].name,obj[key].date, obj[key].description,  obj[key].priority, obj[key].done);
    task.createFront(obj[key]._id);      
  }
}

function add(){
  let newName = document.getElementById("addName");
  let newDate = document.getElementById("addDate");
  let newDescription = document.getElementById("addDescription");
  let newPriority = document.getElementById("addPriority");
  
  let task = new Task(newName.value, newDate.value, newDescription.value, newPriority.value);
  //console.log(task)
  task.create();
  newName.value = "";
  newDate.value = "";
  newDescription.value = "";
  newPriority.value = "";
}
function cancelAdd(){
  document.getElementById("addName").value = "";
  document.getElementById("addDate").value = "";
  document.getElementById("addDescription").value = "";
  document.getElementById("addPriority").value = "";
  
}

function test(){
  console.log("test")
}

window.onload=function(){
  let inputSearch = document.getElementById("inputSearchTask")
  inputSearch.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      console.log(inputSearch.value)
      searchTask(inputSearch.value)
      inputSearch.value = "";
    }
  });
  
  let addButton = document.getElementById("addButton");
  addButton.addEventListener("click", add)
  
  let cancelAddButton = document.getElementById("cancelAddButton");
  cancelAddButton.addEventListener("click", cancelAdd)
}