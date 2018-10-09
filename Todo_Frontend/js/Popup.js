class Popup{
    constructor(type){
        this.type = type;
        this.out;
    }

    create(){
        let bigDiv = document.createElement("div");
        bigDiv.id = "popupDiv"
        bigDiv.style = "position: fixed; width: 100%;height: 100%;left: 0;top: 0;background: rgba(51,51,51,0.4);z-index: 10;";

        let littleDiv = document.createElement("div");
        littleDiv.style = "position: fixed; left: 50%; top: 50%;transform: translate(-50%, -50%); background-color: lightgray;"

        let buttonSucces =  document.createElement("button");
        buttonSucces.innerHTML = "ok"
        buttonSucces.addEventListener("click", this.success)

        let buttonFail =  document.createElement("button");
        buttonFail.innerHTML = "cancel"
        buttonFail.addEventListener("click", this.fail)

        littleDiv.innerHTML = this.speak();

        littleDiv.appendChild(buttonSucces)
        littleDiv.appendChild(buttonFail)

        bigDiv.appendChild(littleDiv)

        document.getElementById("allContent").appendChild(bigDiv)
    }

    speak(){
        switch (this.type){
            case "delete":
                return "Etes vous sur de vouloir supprimer ?"
            default:
                return "non tant pis..."
        }      
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