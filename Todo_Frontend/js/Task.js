class Task {
    constructor(name, date, description, priority) {
        
        this.name = (name || "default_name");
        this.date = (date || "11-09-2020");
        this.description = (description || "default_description");
        this.priority = (priority || 1);
        
        this.id = null;
        this.done = false;
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
                this.done = data.done
                this.createFront(data._id)
            }
        }).catch(err => console.log(err, "test"))
    }
    
    createFront(idMongo){
        console.log(this)
        //console.log("create front");
        //console.log(idMongo)
        let taskFront = document.createElement('li');
        taskFront.className = "list-group-item";
        taskFront.innerHTML = this.name;
        taskFront.innerHTML += this.done;
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
        //console.log("THIS   : ",this)
       
        console.log("done : ", this.done)
        let parent = (this.done) ? document.getElementById("todoDisplayDonelist") : document.getElementById("todoDisplayList");
        //let parent = document.getElementById("todoDisplayList");
        console.log("PARENT : ",parent)
        parent.prepend(taskFront);
    }

    doneTask(){
        let idTaskToDone = this.parentNode.id;
        this.done = true;
        Task.doneTaskBack(idTaskToDone)
        .then(
            Task.doneTaskFront(idTaskToDone)
        )
        .catch(err => console.log("erreur", err))
    }
    
    static doneTaskBack(idTaskToDone){
        this.done = true;
        return fetch('http://127.0.0.1:8080/todos/' + idTaskToDone, {
        method:'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({"done": true})})
    }
    
    static doneTaskFront(idTaskToDone){

        document.getElementById(idTaskToDone).remove();
        //console.log("doneTaskFront : ", this)

        fetch('http://127.0.0.1:8080/todos/' + idTaskToDone)
        .then(response => response.json())
        .then(data => {console.log("DATAAAAAAAA : ", data); return data})
        .then(data => {
            let doneTask = new Task(data.name,data.date, data.description, data.priority);
            doneTask.setID(idTaskToDone);
            doneTask.done = data.done;
            console.log("doneTASKKKKKKKK : ", doneTask)
            doneTask.createFront(idTaskToDone)
        })
        .catch(err => console.log("rr", err))
        
    }
    
    createBack() {
        //console.log("create back");
        return fetch('http://127.0.0.1:8080/todos/add', {
        method:'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({"name": this.name, "date": this.date, "description": this.description, "priority": this.priority})})
        .then(response => {return (response.status === 200) ? response.json() : Promise.reject("Nom deja existant");})
        .catch(err => console.log("erreur : ", err)) // POPUP
    }
}
