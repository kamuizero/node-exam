const url = require('url');
const fs = require('fs');
const mathJS = require('mathjs'); //To import MathJS 'npm install mathjs --save'
const Stocker = require('./stocker');

const renderHTML = (path, response) => {
        fs.readFile(path, null,
                (error, data) => {
                        if (error) {
                                response.writeHead(404);
                                response.write('File not found');
                        } else {
                                response.write(data);
                        }
                        response.end();
                        });
}

module.exports = {

        handleRequest: (request, response) => {
                response.writeHead(200,{'Content-Type':'text/html'});
                let path = url.parse(request.url).pathname;

                switch (path) {
                        case '/' :
                                response.write('WORKS');
                                response.end();
                                break;
                        case '/secret/' :
                                console.log('Request to access SECRET');
                                let auth = request.headers['authorization'];
                                if (!auth) {
                                        response.writeHead(401);
                                        response.end();

                                        //renderHTML('./authrequired.html', response);

                                } else if (auth) {
                                        let cad = auth.split(' ');
                                        let buff = new Buffer(cad[1], 'base64');
                                        let cad_auth = buff.toString();

                                        let usrData = cad_auth.split(':');
                                        let user = usrData[0];
                                        let pass = usrData[1];

                                        if ((user === 'user') && (pass ==='pass')) {
                                                response.write('SUCCESS');
                                                response.end();
                                        } else {
                                                response.writeHead(403);
                                                response.write('Invalid username and password');
                                                response.end();
                                        }
                                }
                                break;
                        case '/calc' :
                                let search = url.parse(request.url,true).search;
                                let val = search.split('?');
                                val = val[1];

                                try {
                                        response.write(mathJS.eval(val).toString());

                                } catch (err) {
                                        console.error(err);
                                        response.write('ERROR');
                                        }

                                response.end();
                                break;
                        case '/stocker' :
                                let query = url.parse(request.url,true).query;
                                console.log(query.function);


                                switch (query.function) {
                                        case 'addstock' :
                                                if (!query.name) {
                                                        console.log('No name');
                                                        response.writeHead(404);
                                                        response.write('Please specify name');
                                                        response.end();
                                                        break;
                                                }

                                                if (query.amount === undefined) {
                                                        Stocker.addStock(query.name,1);
                                                } else if (!isNaN(parseInt(query.amount)) && (parseInt(query.amount) > 0) && (Number.isInteger(Number(query.amount))) ) {
                                                        Stocker.addStock(query.name,parseInt(query.amount));
                                                } else {
                                                        console.error('Sell - Amount invalid');
                                                        //response.writeHead(404);
                                                        response.write('ERROR');
                                                        response.end();
                                                        break;
                                                }

                                                response.end();
                                                break;

                                        case 'checkstock' :
                                                response.write(Stocker.checkStock(query.name));
                                                response.end();
                                                break;

                                        case 'sell' :
                                                if (!query.name) {
                                                        console.error('No name');
                                                        //response.writeHead(404);
                                                        response.write('ERROR');
                                                        response.end();
                                                        break;
                                                }

                                                let am;
                                                let pri;

                                                if (query.amount === undefined) {
                                                        am = 1;
                                                } else if (!isNaN(parseInt(query.amount)) && (Number.isInteger(Number(query.amount))) && (parseInt(query.amount)>0) ){
                                                        am = parseInt(query.amount);
                                                } else {
                                                        console.error('Sell - Amount invalid');
                                                        //response.writeHead(404);
                                                        response.write('ERROR');
                                                        response.end();
                                                        break;
                                                }

                                                if (query.price === undefined) {
                                                        pri = 0;
                                                } else if ( (!isNaN(parseInt(query.price))) && (Number.isInteger(Number(query.price))) && (parseInt(query.price)>0) ){
                                                        pri = parseInt(query.price);
                                                } else {
                                                        console.log(query.price);
                                                        console.error('Sell - Invalid price');
                                                        //response.writeHead(404);
                                                        response.write('ERROR');
                                                        response.end();
                                                        break;
                                                }

                                                Stocker.sell(query.name,am,pri);

                                                response.end();
                                                break;

                                        case 'checksales' :
                                                console.log('Function checksales');
                                                response.write(Stocker.checkSales());
                                                response.end();
                                                break;

                                        case 'deleteall' :
                                                console.log('Function deleteall');
                                                Stocker.deleteAll();
                                                response.end();
                                                break;

                                        default :
                                                response.writeHead(404);
                                                response.write('Function name is invalid');
                                                response.end();
                                                break;
                                }

                                break;
                        default:
                                response.writeHead(404);
                                response.end();
                                break;
                }
        }
};
