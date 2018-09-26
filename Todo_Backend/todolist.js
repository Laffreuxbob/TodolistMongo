'use strict'

const express = require('express'); // Framework gestion serveur nodeJS
const pkg = require('./package.json'); // Pour pouvoir lire les data Json
const conf = require('./config.js'); // IP et port de notre serveur
const moment = require('moment'); // Librairie gestion de dates

const bodyPost = require('body-parser'); // Necessaire a la lecture des data dans le body de la requete (post)

const server = express();

server.use(bodyPost.json()); // support json encoded bodies
server.use(bodyPost.urlencoded({ extended: false })); // support encoded bodies

server.use((req, res, next) => {
    res.header('Content-Type', 'application/json')
    next()
})

// Facon presque propre d'eviter le probleme de header CORS
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
server.use(allowCrossDomain);

// Compteur qui simule les id des tasks
let idTask = 5;

// Liste fictive de tasks : bdd mongo pour plus tard
let todos = [
    {
        id: 1,
        name: "Linux",
        date: "18-09-2018",
        ajout: "12-09-2018",
        description: "Installer Linux",
        done: false
    },
    {
        id: 2,
        name: "Test",
        date: "18-09-2018",
        ajout: "13-09-2018", // pas de franglais ! add ou creation
        description: "Realiser les tests de qualif",
        done: false
    },
    {
        id: 3,
        name: "Todolist",
        date: "18-09-2018",
        ajout: "16-09-2018",
        description: "Implementer une todolist en nodeJS",
        done: false
    },
    {
        id: 4,
        name: "Alternance",
        date: "11-09-2020",
        ajout: "12-09-2018",
        description: "Apprendre plein de trucs trop bien",
        done: false
    }
]


// Methode GET pour recuperer la version du projet
// curl http://127.0.0.1:8080/version
server.get('/version', (req, res) => {
    if (!pkg || !pkg.version) {
        console.log('Error: No package.json');
        res.status(404);
        return res.send();
    }
    res.status(200);
    console.log('version: ' + pkg.version);
    res.send(JSON.stringify(pkg.version) )
    
})

// Methode GET pour recuperer la totalite de la liste de taches
// curl http://127.0.0.1:8080/todos
server.get('/todos', (req, res) => {
    if (!todos) {
        res.status(200);
        console.log("Liste inexstante");
        return res.send({} + '\n'); // res.send([]) surtout pas de + '\n'
    }
    res.status(200)
    console.log('Liste de taches :')
    console.log(todos || "Liste de taches vide");
    console.log('------------------------')
    res.send(todos)
});

// Methode GET pour recuperer un element par recherche d'id
// curl http://127.0.0.1:8080/todos/1
server.get('/todos/:id', (req, res) => {
    const todoToSearch = req.params.id; /* on recupere l'id' de recherche*/ 
    let todoToDisplay = null; /* on prepare un objet vide pour recuperer une tache si elle existe */
    
    let todoToDisplayFind = todos.find(element => {
        return(parseInt(element.id) === todoToSearch);
    });
   
    res.status(200);
    console.log('Resultat de la cherche avec l\'id : ' + todoToSearch)
    console.log(todoToDisplayFind || 'Aucun resultat pour cette recherche');
    console.log('------------------------')
    res.send(todoToDisplayFind); // pas besoin de end() avec send() et stringify transforme ton json en string
})

// Methode GET pour recuperer un element par recherche de mot cle
// curl http://127.0.0.1:8080/todosSearch/Linux
server.get('/todosSearch/:name', (req, res) => {
    const todoToSearch = req.params.name; /* on recupere les mot cle de recherche*/ 
    let todoToDisplay = null; /* on prepare un objet vide pour recuperer une tache si elle existe */
    todos.forEach( item => {
        if(item.name.toLowerCase() === todoToSearch.toLowerCase()){
            todoToDisplay = item;
        }
    }) // utiliser find()
    res.status(200);
    console.log('Resultat de la cherche avec le mot : ' + todoToSearch)
    console.log(todoToDisplay || 'Aucun resultat pour cette recherche');
    console.log('------------------------')
    res.send(JSON.stringify(todoToDisplay)); // pas besoin de end() avec send()
})

// Methode POST pour ajouter un nouvel element a la liste en cours
// curl -X POST -H "Content-Type: application/json" -d '{"name":"NouveauProjet", "date":"25-09-2019", "description":"Projet test delai"}' http://localhost:8080/todos/add
server.post('/todos/add', (req, res) => {
    
    const data = req.body; // recuperation des donnees dans le body de la requete
    
    // attribution des nouvelles key_value  
    let newName = data.name || "default_name"; 
    let newDate = data.date || "11-09-2020";
    let newDescription = data.description || "default_description";
    
    // creation du nouvel objet tache 
    let newItem = {
        "id": idTask,
        "name":newName,
        "date":newDate,
        "ajout": moment().format('DD-MM-YYYY'),
        "description":newDescription,
        "done": false
    }
    idTask++;
    
    // ajout a la liste 
    todos.push(newItem);
    
    res.status(200);
    
    //res.write("Nouvelle entree enregistree : \n")
    //res.write(JSON.stringify(newItem) + '\n')
    console.log(newItem)
    res.send(JSON.stringify(newItem))
    res.end();
})

// Methode DELETE pour supprimer un element de la liste avec une id
// curl -X DELETE  http://127.0.0.1:8080/delete/2
server.delete('/delete/:todoToDelete', (req, res) => {
    const todoToDelete = req.params.todoToDelete
    todos.forEach( item => {
        if(parseInt(item.id) === parseInt(todoToDelete)){
            console.log("Suppresion du projet :" + item.id);
            let index = todos.indexOf(item);
            todos.splice(index,1);
        }
    }) // utiliser .find()
    res.status(410); //status de suppression de data du serveur
    res.end();
})

// Methode qui renvoie des informations temporelles liees a la tache (delais etc...) avec l'id
// curl http://127.0.0.1:8080/todosInfos/1
server.get('/todosInfos/:id', (req, res) => {
    
    const todoToSearch = String(req.params.id); // on recupere les mot cle de recherche
    let todoToGet; // on prepare un objet vide pour recuperer une tache si elle existe 
    
    todos.forEach( item => {
        if(String(item.id) === todoToSearch){
            todoToGet = item;
        }
    })
    
    console.log(todoToGet)
    res.status(200);
    
    let dateEnd = moment(todoToGet.date,"DD-MM-YYYY" )
    let dateStart = moment(todoToGet.ajout,"DD-MM-YYYY" )
    
    let timeAll = dateEnd.diff(dateStart) / (1000 * 60 * 60 * 24);
    let timeLeft = Math.trunc(dateEnd.diff(moment()) / (1000 * 60 * 60 * 24));
    
    console.log('Delai total pour la tache ' + todoToSearch + " : " + timeAll + "jour(s)")
    console.log('Delai restant pour la tache ' + todoToSearch + " : " + timeLeft + "jour(s)")
    console.log('------------------------' + '\n')
    
    res.send( {"total":timeAll, "restant":timeLeft})
    res.end();
})


// Methode d'edition et de mise a jour d'une tache (on utilise le // pour garder la valeur actuelle)
// curl -X PUT -H "Content-Type: application/json" -d '{"name":"editedName","date":"editedDate"}' "http://localhost:8080/todos/2"
// curl -X PUT -H "Content-Type: application/json" -d '{"done":"true"}' "http://localhost:8080/todos/1"

server.put('/todos/:id', (req, res) => {
    let idTodoToEdit = parseInt(req.params.id);
    let index = null;
    
    let todoToEdit = todos.find(element => {
        return element.id === idTodoToEdit;
    });
    
    //Avec un map :
    let datas = req.body;
    
    /* attribution des nouvelles key_value editees */ 
    let editedName = datas.name || todoToEdit.name;
    let editedDate = datas.date || todoToEdit.date;
    let editedDescription = datas.description || todoToEdit.description;
    let editedDone = (datas.done || datas.done === false) ? datas.done : todoToEdit.done;
    
    /* creation du nouvel objet tache */
    let editedItem = {
        "id": todoToEdit.id,
        "name":editedName,
        "date":editedDate,
        "ajout": todoToEdit.ajout,
        "description":editedDescription,
        "done": editedDone
    }
    
    // Edition de la nouvelle tache

    todos = todos.map(item => {
        return (item.id === idTodoToEdit) ? editedItem : item;
    });
    
    // res.write(JSON.stringify("to edit : " + JSON.stringify(todoToEdit)) + '\n');
    // res.write(JSON.stringify(" edited : " + JSON.stringify(editedItem)) + '\n');
    
    res.status(200);
    res.end();
})


// server.put('/todos/edit/:id', (req, res) => {
    
//     let nameToEdit = parseInt(req.params.id);
//     let todoToEdit = null;
//     let index = null;
    
//     todos.forEach( item => {
//         if(item.id === nameToEdit){
//             todoToEdit = item;
//             index = todos.indexOf(item);
//         } 
//     })
    
//     let datas = req.body;
    
//     /* attribution des nouvelles key_value editees */ 
//     let editedName = (datas.name === "//" || "" ?  todoToEdit.name : datas.name);
//     let editedDate = (datas.date === "//" || "" ?  todoToEdit.date : datas.date);
//     let editedDescription = (datas.description === "//" || "" || !datas.description ? todoToEdit.description : datas.description);
    
//     /* creation du nouvel objet tache */
//     let editedItem = {
//         "id": todoToEdit.id,
//         "name":editedName,
//         "date":editedDate,
//         "ajout": todoToEdit.ajout,
//         "description":editedDescription,
//         "done": todoToEdit.done
//     }
    
//     // Edition de la nouvelle tache
//     todos[index] = editedItem;
    
//     // res.write(JSON.stringify("to edit : " + JSON.stringify(todoToEdit)) + '\n');
//     // res.write(JSON.stringify(" edited : " + JSON.stringify(editedItem)) + '\n');
    
//     res.status(200);
//     res.end();
// })

// server.put('/todos/editDone/:id', (req, res) => {
    
//     console.log("done")
//     let idToEdit = parseInt(req.params.id);
//     let todoToEdit = null;
//     let index = null;
    
//     todos.forEach( item => {
//         if(item.id === idToEdit){
//             todoToEdit = item;
//             index = todos.indexOf(item);
//         } 
//     })
    
//     let datas = req.body;
    
//     /* creation du nouvel objet tache */
//     let editedItem = {
//         "id": todoToEdit.id,
//         "name":todoToEdit.name,
//         "date":todoToEdit.date,
//         "ajout": todoToEdit.ajout,
//         "description":todoToEdit.description,
//         "done": !todoToEdit.done
//     }
    
//     // Edition de la nouvelle tache
//     todos[index] = editedItem;
    
//     // res.write(JSON.stringify("to edit : " + JSON.stringify(todoToEdit)) + '\n');
//     // res.write(JSON.stringify(" edited : " + JSON.stringify(editedItem)) + '\n');
    
//     res.status(200);
//     res.end();
// })

// Le serveur tourne suivant la configuration definie dans config.js
server.listen(conf.port, conf.hostname, (err) => {
    if(err){
        return console.log("Error:", err)
    }
    console.log('Server running at http://' + conf.hostname + ':' + conf.port + '/'); 
    console.log('today : ' + moment().format('DD-MM-YYYY hh:mm')) 
})