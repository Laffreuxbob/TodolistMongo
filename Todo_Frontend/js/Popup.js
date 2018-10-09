class Popup{
    constructor(type){
        this.type = type
    }

    create(){
        let bigDiv = document.createElement("div");
        bigDiv.style = "position: fixed; width: 100%;height: 100%;left: 0;top: 0;background: rgba(51,51,51,0.4);z-index: 10;";

        let littleDiv = document.createElement("div");

        document.getElementById("allContent").appendChild(bigDiv)
    }
}