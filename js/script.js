//DEPENDENCIES: helper.js

print("hello!")

async function connectToAPI(){
    fetch('http://localhost:1700/api/clustersentence/46908')
        .then(response => response.json())
        .then(data => console.log(data));
}

connectToAPI();