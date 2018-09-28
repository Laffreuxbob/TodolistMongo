class Task {
    constructor(name, date, description, priority) {
        
        this.name = (name || "default_name");
        this.date = (date || "11-09-2020");
        this.description = (description || "default_description");
        this.priority = (priority || "P1");
        this.id = null;
    }
    
    test(){
        console.log("test")
    }
    
    setID(idMongo){
        this.id = idMongo;
    }
    
    delete(){
        console.log("delete");
        this.deleteFront();
    }
    
    deleteBack(){
        console.log("deleteBack")
    }
    
    deleteFront(){
        console.log("deleteFront")
    }
    
    create() {
        //console.log("create")
        this.createBack()
        .then(data => {
            if(data !== undefined){
                this.setID(data._id);
                this.createFront(data._id)
            }
        }).catch(err => console.log(err, "test"))
    }
    
    createFront(idMongo){
        //console.log("create front");
        console.log(idMongo)
        let taskFront = document.createElement('li');
        taskFront.className = "list-group-item";
        taskFront.innerHTML = this.name;
        taskFront.id = idMongo;
        
        
        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = "delete";
        deleteButton.addEventListener("click", this.delete)
        
        taskFront.appendChild(deleteButton);
        
        //let parent = (this.done) ? document.getElementById("todoDisplayListDone") : document.getElementById("todoDisplayList");
        let parent = document.getElementById("todoDisplayList");
        parent.prepend(taskFront);
    }
    
    createBack() {
        //console.log("create back");
        return fetch('http://127.0.0.1:8080/todos/add', {
        method:'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({"name": this.name, "date": this.date, "description": this.description, "priority": this.priority})
    })
    .then(response => {return (response.status === 200) ? response.json() : Promise.reject("Nom deja existant");})
    .catch(err => console.log("erreur : ", err)) // POPUP
}


}
