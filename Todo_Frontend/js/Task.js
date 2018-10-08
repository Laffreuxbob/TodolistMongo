class Task {
    constructor(name, date, description, priority, done) {
        
        this.name = (name || "default_name");
        this.date = (date || "11-09-2020");
        this.description = (description || "default_description");
        this.priority = (priority || 1);
        
        this.id = null;
        this.done = done || false;
    }
    
    test(){
        console.log("test")
    }
    
    setID(idMongo){
        this.id = idMongo;
    }
    
    delete(){
        //console.log("delete");
        let idToDelete = this.parentNode.id;
        Task.deleteBack(idToDelete)
        .then(Task.deleteFront(idToDelete))
        .catch(err => console.log("erreur : ", err)) // POPUP
    }
    
    static deleteBack(idToDelete){
        //console.log("deleteBack");
        return fetch('http://127.0.0.1:8080/delete/' + idToDelete, {
        method:'delete'})
        .catch(err => console.log("erreur : ", err)) // POPUP
    }
    
    static deleteFront(idToDelete){
        document.getElementById(idToDelete).remove();
    }
    
    create() {
        //console.log("create")
        this.createBack()
        .then(data => {
            if(data !== undefined){
                this.setID(data._id);
                this.done = data.done;
                this.createFront(data._id)
            }
        }).catch(err => console.log(err, "test"))
    }
    
    createBack() {
        //console.log("create back");
        return fetch('http://127.0.0.1:8080/todos/add', {
        method:'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({"name": this.name, "date": this.date, "description": this.description, "priority": this.priority, "done": false})})
        .then(response => {return (response.status === 200) ? response.json() : Promise.reject("Nom deja existant");})
        .catch(err => console.log("erreur : ", err)) // POPUP
    }

    createFront(idMongo){
        //console.log("create front");
        //console.log(idMongo)
        let taskFront = document.createElement('li');
        taskFront.className = "list-group-item";
        taskFront.innerHTML = this.name;
        //taskFront.innerHTML += " _ " + this.id;
        taskFront.id = idMongo;
        
        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = "delete";
        deleteButton.className = "btn btn-danger"
        deleteButton.addEventListener("click", this.delete)
        
        taskFront.appendChild(deleteButton);
        
        let doneButton = document.createElement('button');
        doneButton.innerHTML = "done";
        doneButton.className = "btn btn-success doneButton"
        doneButton.addEventListener("click", this.doneTask)
        
        taskFront.appendChild(doneButton);
        
        let infoButton = document.createElement('button');
        infoButton.innerHTML = "info";
        infoButton.className = "btn btn-primary"
        infoButton.addEventListener("click", this.getInfoDisplay)
        
        taskFront.appendChild(infoButton)
        
        
        let parent = (this.done) ? document.getElementById("todoDisplayDonelist") : document.getElementById("todoDisplayList");
        //let parent = document.getElementById("todoDisplayList");
        parent.prepend(taskFront);
    }
    
    doneTask(){
        let idTaskToDone = this.parentNode.id;
        Task.doneTaskBack(idTaskToDone)
        .then(
            Task.doneTaskFront(idTaskToDone)
            )
            .catch(err => console.log("erreur", err))
    }
        
    static doneTaskBack(idTaskToDone){
        return fetch('http://127.0.0.1:8080/todos/' + idTaskToDone, {
        method:'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({"done": true})})
    }
    
    static doneTaskFront(idTaskToDone){
        
        document.getElementById(idTaskToDone)
        
        fetch('http://127.0.0.1:8080/todos/' + idTaskToDone)
        .then(response => response.json())
        .then(data => {
            let doneTask = new Task(data.name,data.date, data.description, data.priority, data.done);
            doneTask.setID(idTaskToDone);
            doneTask.createFront(idTaskToDone);
        })
        .catch(err => console.log("rr", err)) 
    }
    
    getInfoDisplay(){
        let infos = document.getElementById("infos")
        
        fetch('http://127.0.0.1:8080/todos/' + this.id)
        .then(response => response.json())
        .then(data => {
            infos.innerHTML = JSON.stringify(data)
        })
        .catch(err => console.log("rr", err))
    }
}
