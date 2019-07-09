/*
This code is responsible to making ES queries from the JSON inputted, as we want to hide some of the nitty gritty from the users. 
*/

class QuerryGenerator {

    constructor() {
    
    }

    buildQueryJson( rawRequest = {} ) {

        return {            
            "size" : 10,
            "from" : 0
        };
    }

}

module.exports = QuerryGenerator;