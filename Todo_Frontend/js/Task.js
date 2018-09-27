console.log("taskclass");

class Task {
    constructor(name, date, description, priority) {
        
        this.name = (name || "default_name");
        this.date = (date || "11-09-2020");
        this.description = (description || "default_description");
        this.priority = (priority || "P1");

        
    }
    
    create() {
        this.createBack()
        .then(data => this.createFront(data))
    }
    
    createFront(){
        console.log("create front");
        let taskFront = document.createElement('li');
        taskFront.className = "list-group-item";
        taskFront.innerHTML = this.name;

        //test if(this.done) : parent
        let parent = document.getElementById("todoDisplayList");
        parent.prepend(taskFront);
    }
    
    createBack() {
        console.log("create back");
        return fetch('http://127.0.0.1:8080/todos/add', {
        method:'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({"name": this.name, "date": this.date, "description": this.description, "priority": this.priority})
    })
    //.then(response => { return response.json()})
    .then(data => { return data})
    .catch("erreur")
}




}
