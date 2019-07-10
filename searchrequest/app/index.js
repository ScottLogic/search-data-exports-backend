const express = require(`express`);
const app = express();
const ESSearch = require(`./search.js`);
let server = require('http').Server(app);

let search = new ESSearch();
const port = 3000;

// Because the input can come from a few places, (url params, body content etc) we use ES6 notation to combine them all up. 
const combineRequest = (request) => {
    return {...request.params ,...request.query, ...request.body}
}

app.use(express.json());

app.all(`/search/`, (req,res) => {        
    search.search(combineRequest(req)).then( (result) => {  // Throw to the runner, and await response       
        res.status(200).send(result.body); // shoot back result
    }).catch( (err) => {        
        res.status(500).send(`Error with search ${err}`); // Return an error. 
    });   
});

app.all(`/search/post/`, (req,res) => {  
    search.searchPosts(combineRequest(req)).then( (result) => {  // Throw to the runner, and await response       
        res.status(200).send(result.body); // shoot back result
    }).catch( (err) => {        
        res.status(500).send(`Error with search ${err}`); // Return an error. 
    });    
});

app.all(`/search/user/`, (req,res) => {
    search.searchUsers(combineRequest(req)).then( (result) => {  // Throw to the runner, and await response       
        res.status(200).send(result.body); // shoot back result
    }).catch( (err) => {        
        res.status(500).send(`Error with search ${err}`); // Return an error. 
    }); 
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));