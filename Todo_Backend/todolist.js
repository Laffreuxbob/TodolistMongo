'use strict'

const express = require('express'); // Framework gestion serveur nodeJS
const pkg = require('./package.json'); // Pour pouvoir lire les data Json
const conf = require('./config.js'); // IP et port de notre serveur
const moment = require('moment'); // Librairie gestion de dates

const mongo = require('./lib/mongo') // BDD mongo

const bodyPost = require('body-parser'); // Necessaire a la lecture des data dans le body de la requete (post)

const server = express(); // Framework gestion serveur nodeJS

server.use(bodyPost.json()); // support json encoded bodies
server.use(bodyPost.urlencoded({ extended: false })); // support encoded bodies

server.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
})

// Facon presque propre d'eviter le probleme de header CORS
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
server.use(allowCrossDomain);

// Methode GET pour recuperer la version du projet
// curl http://127.0.0.1:8080/version
server.get('/version', (req, res) => {
    if (!pkg || !pkg.version) {
        console.log('Error: No package.json');
        res.status(404);
        return res.send();
    }
    res.status(200);
    console.log('Version: ' + pkg.version);
    console.log('Version type : ' ,typeof pkg.version)
    res.send(JSON.stringify(pkg.version));  
})

// Methode GET pour recuperer la totalite de la liste de taches
// curl http://127.0.0.1:8080/todos
server.get('/todos', (req, res) => {
    mongo.db.collection('todos').find({}).toArray()
    .then(todos => {
        if (!todos) {
            res.status(200)
            return res.send([]) // return empty array
        }
        res.status(200)
        console.log(todos)
        res.send(todos || [])
    })
    .catch(err => console.log('An error occured getting mongo todo list', err))
})


// Methode GET pour recuperer un element par recherche d'id
// curl http://127.0.0.1:8080/todos/1
server.get('/todos/:id', (req, res) => {
    const ID_todoToSearch = req.params.id; /* on recupere l'id' de recherche*/ 
    mongo.db.collection('todos').find({}).toArray()
    .then(todos => {
        let todoToDisplay_ById = todos.find(element => {
            return((element._id).equals(mongo.ObjectID(ID_todoToSearch)));
        });
        res.status(200);
        console.log('Resultat de la cherche avec l\'id : ' + ID_todoToSearch)
        console.log(todoToDisplay_ById || 'Aucun resultat pour cette recherche');
        console.log('------------------------')
        res.send(todoToDisplay_ById); // pas besoin de end() avec send() et stringify transforme ton json en string
    })    
    .catch(err => console.log('An error occured searching todo with id', err));
});

// Methode GET pour recuperer un element par recherche de mot cle
// curl http://127.0.0.1:8080/todosSearch/Linux
server.get('/todosSearch/:name', (req, res) => {
    const NAME_todoToSearch = req.params.name; /* on recupere l'id' de recherche*/ 
    mongo.db.collection('todos').find({}).toArray()
    .then(todos => {
        let todoToDisplay_ByName = todos.find(element => {
            return(element.name === NAME_todoToSearch);
        });
        res.status(200);
        console.log('Resultat de la cherche avec le mot : ' + NAME_todoToSearch)
        console.log(todoToDisplay_ByName || 'Aucun resultat pour cette recherche');
        console.log('------------------------')
        res.send(todoToDisplay_ByName); // pas besoin de end() avec send()
    })    
    .catch(err => console.log('An error occured searching todo with name', err));
});

// Methode qui renvoie des informations temporelles liees a la tache (delais etc...) avec l'id
// curl http://127.0.0.1:8080/todosInfos/1
server.get('/todosInfos/:id', (req, res) => {
    const ID_todoToSearch = req.params.id; // on recupere les mot cle de recherche
    mongo.db.collection('todos').find({}).toArray()
    .then(todos => {
        let todoGetInfos = todos.find(element => {
            return((element._id).equals(mongo.ObjectID(ID_todoToSearch)));
        });
        return todoGetInfos;
        res.status(200);
    })   
    .then(item => {
        let dateEnd = moment(item.date,"DD-MM-YYYY" )
        let dateStart = moment(item.ajout,"DD-MM-YYYY" )
        
        let timeAll = dateEnd.diff(dateStart) / (1000 * 60 * 60 * 24);
        let timeLeft = Math.trunc(dateEnd.diff(moment()) / (1000 * 60 * 60 * 24));
        
        console.log('Delai total pour la tache ' + item.name + " : " + timeAll + "jour(s)")
        console.log('Delai restant pour la tache ' + item.name + " : " + timeLeft + "jour(s)")
        console.log('------------------------' + '\n')
        res.send( {"total":timeAll, "restant":timeLeft})
    }) 
    .catch(err => console.log('An error occured searching todo with id', err));
});

// Methode POST pour ajouter un nouvel element a la liste en cours
// curl -X POST -H "Content-Type: application/json" -d '{"name":"NouveauProjet", "date":"25-09-2019", "description":"Projet test delai"}' http://localhost:8080/todos/add
server.post('/todos/add',  (req, res) => {
    const data = req.body    // recuperation des donnees dans le body de la requete
    // attribution des nouvelles key_value  
    let newName = data.name || "default_name"; 
    let newDate = data.date || "11-09-2020";
    let newDescription = data.description || "default_description";
    let newPriority = data.priority || "default_priority";
    
    // creation du nouvel objet tache 
    let newItem = {
        "name":newName,
        "date":newDate,
        "ajout": moment().format('DD-MM-YYYY'),
        "description":newDescription,
        "priority": newPriority,
        "done": false
    };
    mongo.db.collection('todos').findOne({name: newItem.name})
    .then(result => {
        if (result) {
            console.log("Warning,", newItem.name, " already exists!");
            res.status(403).end();
            return result;
        }
        mongo.db.collection('todos').insertOne(newItem);
        console.log('Todo successfully added to mongo database.');
        res.status(200);
        return res.send(JSON.stringify(newItem));
    })
    .catch(err => {
        console.log('An error occured inserting todo in mongo.', err)
    })
});


// Methode DELETE pour supprimer un element de la liste avec une id
// curl -X DELETE  http://127.0.0.1:8080/delete/2
server.delete('/delete/:todoToDelete', (req, res) => {
    const ID_todoToDelete = mongo.ObjectID(req.params.todoToDelete);
    mongo.db.collection('todos').findOne({_id: ID_todoToDelete})
    .then(result => {
        console.log(result);
        if (!result) {
            console.log("Warning, nothing to delete!");
            res.status(403).end();
            return result;
        }
        let itemToDelete = result;
        mongo.db.collection('todos').deleteOne(itemToDelete);
        console.log('Todo successfully deleted from mongo database.');
        res.status(200);
        return res.end();
    })
    
});

// Methode d'edition et de mise a jour d'une tache (on utilise le // pour garder la valeur actuelle)
// curl -X PUT -H "Content-Type: application/json" -d '{"name":"editedName","date":"editedDate"}' "http://localhost:8080/todos/2"
// curl -X PUT -H "Content-Type: application/json" -d '{"done":"true"}' "http://localhost:8080/todos/1"

server.put('/todos/:id', (req, res) => {
    let idTodoToEdit = mongo.ObjectID(req.params.id);
    return mongo.db.collection('todos').findOne({_id: idTodoToEdit})  
    .then(result => {
        if (!result) {
            console.log("Warning, task to edit not found !");
            res.status(403).end();
            return result;
        }
        let datas = req.body;
        /* attribution des nouvelles key_value editees */ 
        let editedName = datas.name || result.name;
        let editedDate = datas.date || result.date;
        let editedDescription = datas.description || result.description;
        let editedDone = (datas.done || datas.done === false) ? datas.done : result.done;
        
        console.log(editedName, editedDone)
        
        return mongo.db.collection('todos').updateOne(
            
            {_id: idTodoToEdit},
            {
                $set: {"name": editedName, "date": editedDate, "description": editedDescription, "done": editedDone}
            }
            )
        })
        .then(() => { return  mongo.db.collection('todos').findOne({_id: idTodoToEdit} ) })
        .then( updated => { console.log(" UP :", updated) ; res.send(updated)})
        
        .catch(err => {
            console.log('An error occured editing todo in mongo.', err)
        })      
    });
    
    
    // Le serveur tourne suivant la configuration definie dans config.js
    
    mongo.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to mongodb, we can now use mongo.db object.')
        server.listen(conf.port, conf.hostname, (err) => {
            if(err){
                return console.log("Error:", err)
            }
            console.log('Server running at http://' + conf.hostname + ':' + conf.port + '/'); 
            console.log('today : ' + moment().format('DD-MM-YYYY hh:mm')) 
        })
        
    })
    
    
    