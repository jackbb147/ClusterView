//DEPENDENCIES: helper.js

print("hello!")

async function connectToAPI(){
    // fetch('http://localhost:1700/api/clustersentence/46908')
    //     .then(response => response.json())
    //     .then(IDs => {
    //         print(IDs)
    //         for(var i = 0; i < IDs.length; i++){
    //             let id = IDs[i];
    //             print(id);
    //             fetch(`http://localhost:1700/api/sentencetofeedback/${id}`)
    //                 .then(response => response.text().then(text => print(text)));
    //         }
    //     });

    // fetch(`http://localhost:1700/api/sentencetofeedback/1022952`,
    //     {
    //         headers : {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json'
    //         }
    //     })
    //     .then(res => {
    //         res.text().then(text => print(text));
    //     });
}

connectToAPI();