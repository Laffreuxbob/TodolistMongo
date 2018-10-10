class Popup{
    constructor(type, task){
        this.type = type;
        this.task = task;
        this.out;
    }
    
    create(){
        let bigDiv = document.createElement("div");
        bigDiv.id = "popupDiv"
        bigDiv.style = "position: fixed; width: 100%;height: 100%;left: 0;top: 0;background: rgba(51,51,51,0.4);z-index: 10;";
        
        let littleDiv = document.createElement("div");
        littleDiv.style = "position: fixed; left: 50%; top: 50%;transform: translate(-50%, -50%); background-color: lightgray;";
        
        let buttonSucces =  document.createElement("button");
        buttonSucces.innerHTML = "Fermer";
        buttonSucces.addEventListener("click", this.success);
        
        littleDiv.appendChild( this.speak());
        
        let buttonField = document.createElement('div');
        buttonField.style = "display: flex; justify-content: center"
        
        buttonField.appendChild(buttonSucces)
        if(this.type == "delete"){
            let buttonFail =  document.createElement("button");
            buttonFail.innerHTML = "cancel";
            buttonFail.addEventListener("click", () => {
                document.getElementById("popupDiv").remove();
                console.log('test')
            });
            buttonField.appendChild(buttonFail)
        }
        if(this.type == "search"){
            let buttonInfos =  document.createElement("button");
            buttonInfos.innerHTML = "infos";
            buttonInfos.addEventListener("click", () => {
                document.getElementById("popupDiv").remove();
                let infos = document.getElementById("infos")
                infos.innerHTML = ""
                let dataMap = {};
                let urls = ['http://127.0.0.1:8080/todos/'+ this.task._id, 'http://127.0.0.1:8080/todosInfos/'+ this.task._id];
                console.log(urls)
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
            });
            buttonField.appendChild(buttonInfos)
        }
        
        littleDiv.appendChild(buttonField);
        bigDiv.appendChild(littleDiv);
        
        document.getElementById("allContent").appendChild(bigDiv);
    }
    
    speak(){
        switch (this.type){
            case "delete":
            return this.infosDelete();
            case "search":
            return this.infosSearch();
            case "errorSearch":
            return this.infosErrorSearch();
            default:
            return "non tant pis..."
        }      
    }
    
    infosSearch(){
        let taskToDisplay = this.task;
        let contentInfos = document.createElement('div');
        Object.keys(taskToDisplay).map(function(objectKey, index) {
            if(objectKey != "_id"){
                let liInfos = document.createElement('li');
                liInfos.innerHTML = objectKey + " : " + taskToDisplay[objectKey];
                liInfos.className = "list-group-item list-group-item-action";
                contentInfos.appendChild(liInfos);
            }
        })
        return contentInfos;
    }
    
    infosDelete(){
        let deletePopup = document.createElement('span');
        deletePopup.innerHTML = "Etes vous sur ?"
        return deletePopup;
    }
    
    infosErrorSearch(){
        let errorSearchPopup = document.createElement('span');
        errorSearchPopup.innerHTML = "Pas de resultat"
        return errorSearchPopup;
    }
    
    success(){
        document.getElementById("popupDiv").remove();
        return this.out = true;
    }
    
    fail(){
        document.getElementById("popupDiv").remove();
        return this.out = false;
    }
    
    getOut(){
        return this.out;
    }
    
    // wait(){
    //     function setup(){
    //         createCanvas(200,200,WEBGL)
    //     }
    //     function draw(){
    //         background(250);
    //         translate(-240, -100, 0);
    //         push();
    //         rotateZ(frameCount * 0.01);
    //         rotateX(frameCount * 0.01);
    //         rotateY(frameCount * 0.01);
    //         box(70, 70, 70);
    //         pop();
    //     }
    
    // }
}