const express = require(`express`);
const app = express();
const QueryGenerator = require(`./querry.js`);
const ESSearch = require(`./search.js`);

let server = require('http').Server(app);
let queryGen = new QueryGenerator();
let search = new ESSearch();
const port = 3000;

app.use(express.json());

app.all(`/search/`, (req,res) => {        
    const rstring = { ...req.params ,...req.query, ...req.body }
    res.status(200).send(rstring);
});

app.all(`/search/post/`, (req,res) => {
    const rstring = { ...req.params ,...req.query, ...req.body }
    // throw this into another class, that will deal with making it be "correct" in terms of a ES request.
    // throw the result of that into the thing that actually DOES the search. 
    // and that is the result that gets kicked back.
    const searchJson =  queryGen.buildQueryJson(rstring,"all");
    //let returnJSON = search.performESSearch(searchJson);
    let returnJSON;
    //let returnJSON =  search.performESSearch(searchJson);
    const requestJSON = async() => {
        console.log(`THIS`);
        returnJSON = await search.performESSearch(searchJson);
        res.status(200).send(returnJSON);
    };
    requestJSON();

    //console.log(`api return`,returnJSON);
    
    
    // returnJSON.then( () => {
    //     console.log(`Finished`);
    //     console.log(returnJSON);
    //     res.status(200).send(returnJSON.body)
    // },() => {
    //     console.log(`Errored`);
    //     res.status(200).send("THIS IS AN ERROR");
    // })
    
});

app.all(`/search/user/`, (req,res) => {
    const rstring = { ...req.params ,...req.query, ...req.body }
    res.status(200).send(rstring);
});

// app.use(express.static(`public`));

server.listen(port, () => console.log(`Example app listening on port ${port}!`));