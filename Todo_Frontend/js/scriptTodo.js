function getTodos(){
    fetch('http://127.0.0.1:8080/todos/', {method:'get'})
    .then(response =>  response.json())
    .then(data => {console.log(data);})
    .then(data => data)
    .catch(err => {
      console.log('Error occured with fetching ressources : ' + err)
    });
  }

  getTodos();

  function getVersion(){
    fetch('http://127.0.0.1:8080/version/', {method:'get'})
    .then(response =>  response.json())
    .then(data => {alert("Version : " + data);})
    .then(data => data)
    .catch(err => {
      console.log('Error occured with fetching ressources : ' + err)
    });
    
  }