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
        let infos = document.getElementById("infos");
        infos.innerHTML = "";
        fetch('http://127.0.0.1:8080/todos/' + this.parentNode.id)
        .then(response => response.json())
        .then( data => { 
            //console.log(data); 
            return data})
        .then(data => {
            let verif = new Popup("delete", data);
            verif.create();
        })
        .catch(err => console.log("erreur : ", err))
        
    }
    
    static deleteBack(idToDelete){
        console.log("deleteBack : ", idToDelete);
        return fetch('http://127.0.0.1:8080/delete/' + idToDelete, {
        method:'delete'})
        .catch(err => console.log("erreur : ", err)) // POPUP
    }
    
    static deleteFront(idToDelete){
        //console.log("deleteFront : ", idToDelete);
        
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
        taskFront.getAttributeNode("class").value += " priority"+this.priority;
        
        let nameTaskFront = document.createElement('span')
        nameTaskFront.innerHTML = this.name;
        taskFront.appendChild(nameTaskFront);
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
        
        let editButton = document.createElement('button');
        editButton.innerHTML = "edit";
        editButton.className = "btn btn-warning"
        editButton.addEventListener("click", this.editName)
        
        taskFront.appendChild(editButton)
        
        
        let parent = (this.done) ? document.getElementById("todoDisplayDonelist") : document.getElementById("todoDisplayList");
        //let parent = document.getElementById("todoDisplayList");
        parent.prepend(taskFront);
    }
    
    doneTask(){
        let infos = document.getElementById("infos");
        infos.innerHTML = "";
        fetch('http://127.0.0.1:8080/todos/' + this.parentNode.id)
        .then(response => response.json())
        .then( data => {return data})
        .then(data => {
            let verif = new Popup("done", data);
            verif.create();
        })
        .catch(err => console.log("erreur : ", err))
        


        // Task.doneTaskBack(idTaskToDone)
        // .then(() => {document.getElementById(idTaskToDone).remove()})
        // .then(() => {Task.doneTaskFront(idTaskToDone)} )
        // .catch(err => console.log("erreur", err))
    }
    
    // static doneTaskBack(idTaskToDone){
    //     return fetch('http://127.0.0.1:8080/todos/' + idTaskToDone, {
    //     method:'put',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body:JSON.stringify({"done": true})})
    //     .catch( err => {console.log("err : ", err)})
    // }
    
    // static doneTaskFront(idTaskToDone){
    //     return fetch('http://127.0.0.1:8080/todos/' + idTaskToDone)
    //     .then(response => {  return response.json()})
    //     .then(data => {
    //         let doneTask = new Task(data.name,data.date, data.description, data.priority, data.done);
    //         doneTask.setID(idTaskToDone);
    //         doneTask.createFront(idTaskToDone);
    //     })
    //     .catch(err => console.log("rr", err)) 
    // }
    
    getInfoDisplay(){
        let infos = document.getElementById("infos")
        infos.innerHTML = ""
        
        let dataMap = {};
        let urls = ['http://127.0.0.1:8080/todos/'+ this.parentNode.id, 'http://127.0.0.1:8080/todosInfos/'+ this.parentNode.id];
        
        var promises = urls.map(url => fetch(url)
        .then(data => data.json())
        .catch(err => {
            console.log('Error occured with fetching ressources : ' + err)
        }));
        
        Promise.all(promises)
        .then(results => {
            Object.keys(results).map(function(objectKey, index) {
                var value = results[objectKey];   
                Object.keys(value).map(function(key, item) {
                    let val = value[key];
                    dataMap[key] = val;
                    //console.log(val);
                })
            })
            return dataMap; 
        })
        .then( dataMap => {
            Object.keys(dataMap).map(function(objectKey, index) {
                if(objectKey !== "_id"){
                    let liInfo = document.createElement('li');
                    liInfo.className = "list-group-item list-group-item-action";
                    liInfo.textContent = objectKey + " : " + dataMap[objectKey];
                    if(objectKey === "total" || objectKey === "restant"){
                        liInfo.textContent += " jours"
                        if(parseInt(dataMap[index]) < 0){
                            liInfo.style.backgroundColor = '#ff9999'
                        }
                    }
                    infos.appendChild(liInfo)
                }
            });
        }); 
    }
    
    
    editName(){
        let infos = document.getElementById("infos");
        infos.innerHTML = "";
        
        let buttonsTodisabled = this.parentNode.querySelectorAll("button");
        for (let i = 0; i < buttonsTodisabled.length; i++){
            buttonsTodisabled[i].disabled = true;
        }
                
        let oldName = this.parentNode.firstChild.innerHTML;
        let idTaskToEdit = this.parentNode.id;
        
        //var divs = document.querySelectorAll("li:not(#"+this.parentNode.id+")");
        var lis = document.querySelectorAll("li");
        var lisNotToEdit = []
        
        for(let li in lis){
            if(typeof lis[li] === "object" && lis[li].id != this.parentNode.id){
                lisNotToEdit.push(lis[li])
            }
        }
        for(let i = 0; i < lisNotToEdit.length; i++){
            let input = lisNotToEdit[i].firstChild.firstChild;
            if(input && input.id == "newName"){
                //console.log(input);
                input.remove();
            }
        }
        let taskToEdit = document.getElementById(this.parentNode.id)
        taskToEdit.firstChild.innerHTML = '<div id="newName"> \
        <input type="text" class="form-control" id = "inputEditedName" require> \
        <button id="editNameForm" class="btn btn-dark">&#8634;</button>\ </div>'
        
        // let divEditName = document.createElement('div');
        // divEditName.id = "newName";
        
        // let inputEditName = document.createElement('input');
        // inputEditName.type = "text";
        // inputEditName.className = "form-control";
        
        // let buttonEditName = document.createElement('button');
        // buttonEditName.id = "editNameForm";
        // buttonEditName.className = "btn btn-dark";
        // buttonEditName.innerHTML = "&#8634;";
        // buttonEditName.addEventListener("click", this.changeName)
        
        // divEditName.appendChild(inputEditName);
        // divEditName.appendChild(buttonEditName);
        
        // taskToEdit.firstChild.appendChild(divEditName);
        
        let buttonSubmitEditedName = document.getElementById("editNameForm")
        buttonSubmitEditedName.addEventListener("click", () => {
            let editedName = document.getElementById("inputEditedName").value || oldName;
            if( editedName.toLowerCase() == oldName.toLowerCase() || this.editedName == ""){
                console.log("Le nom n'a pas été changé") //POPUP
            }
            fetch('http://127.0.0.1:8080/todos/' + idTaskToEdit, {
            method:'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({"name": editedName})})
            //.then(response => {console.log(response); return response})
            .then(document.getElementById("newName").remove(), document.getElementById(idTaskToEdit).firstChild.innerHTML = editedName)
            .then( () => {
                for (let i = 0; i < buttonsTodisabled.length; i++){
                    buttonsTodisabled[i].disabled = false;
                }
            })
            .catch(err => console.log("erreur : ", err)) // POPUP           
        })
        
        
        
    }  
}




