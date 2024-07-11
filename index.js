const fs=require('fs');
const http=require('http');
const { json } = require('stream/consumers');
const url=require('url');

//FILE
/*const text=fs.readFileSync('./1-node-farm/txt/input.txt','utf-8');
console.log(text)
const textout=`This is avacado :${text}.\nTime on ${Date.now()}`; 
fs.writeFileSync('./1-node-farm/txt/ouput.txt',textout);
console.log("ok");
//const h="hello world"
//console.log(h)*/

//asynchronous code: for non blocking code

/*fs.readFile('./1-node-farm/txt/start.txt','utf-8',(err,data)=>{
    console.log(data);
})

fs.readFile('./1-node-farm/txt/start.txt','utf-8',(err,data1)=>{
    fs.readFile(`./1-node-farm/txt/${data1}.txt`,'utf-8',(err,data2)=>{
        console.log(data2);
        fs.readFile('./1-node-farm/txt/append.txt','utf-8',(err,data3)=>{
            console.log(data3);
            fs.writeFile(`./1-node-farm/txt/final.txt`,`${data2}\n${data3}`,'utf-8',err=>{
                console.log("written okk");
            })
        })
    })
})
console.log("reading file asynchronously ..");*/


//SERVER
/*const server=http.createServer((req,res)=>{
    console.log(req);
    res.end("hello from server!!");
})
server.listen(8000,'127.0.0.1',()=>{
    console.log("listening!!!")
});

to run this on a browser paste: 127.0.0.1:8000

*/

/*const text=fs.readFileSync('./1-node-farm/dev-data/data.json','utf-8');
const parsed_data=JSON.parse(text);*/

//node farm project starts
/*
1.data.json file:- main data asto je product pahije tyancha json format mdhe.
                   key value form madhe.
                   array of objects.
2.overview:- ithun figures cha code copy kela ani ek navin file banavli template card chi.
             hyachyt main page ch html css ahe 
             main body madhe phkt ek variable dyaych {%productcards%}
3.template_product:- ek normal file hoti specific content sathi
                     but tyat direct naav change karun variables takle {%xyz%} format madhe
4.template card file:- figures cut karun ithe paste kele ani same variables edit kele ithapn
5.index.js :- starting lach saglya files read karun ghaychya mahnje jari parat request ali tari parat    read          karaychi garaj nahi
              3 html files ani ek json file (*synchronously read kelya tari chalatat)
              json file la javascript object madhe convert karnyasathi JSON.parse vaparly
              ek replace function banvla actual data variable replace karayla

              ata server create kela
              vegla vegla url routing sathi if else cases kele

              1.overview: map function vaparla template card la replace karayla ani te cards madhe store kele
                          mg output la replace karaycy /{%PRODUCTCARDS%}/ =>cards
              2.product: parsed data chya array madheun prouct shodhla id ne 
                         mg template product la pass kela


run: node index.js
exit: ctrl C


*/

const replace_Template=(temp,product) => {
    let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output=output.replace(/{%ID%}/g,product.id);
    output=output.replace(/{%IMAGE%}/g,product.image);
    output=output.replace(/{%FROM%}/g,product.from);
    output=output.replace(/{%NUTRIENT%}/g,product.nutrients);
    output=output.replace(/{%QUANTITY%}/g,product.quantity);
    output=output.replace(/{%PRICE%}/g,product.price);
    output=output.replace(/{%DES%}/g,product.description);

    if(!product.organic)
    {
        output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    }

    return output;
}
const temp_overview=fs.readFileSync('./1-node-farm/templates/overview.html','utf-8');
const temp_product=fs.readFileSync('./1-node-farm/templates/template_product.html','utf-8');
const temp_card=fs.readFileSync('./1-node-farm/templates/template-card.html','utf-8');
const text=fs.readFileSync('./1-node-farm/dev-data/data.json','utf-8');
const parsed_data=JSON.parse(text);

const server=http.createServer((req,res)=>{
    const {query,pathname}=url.parse(req.url,true);

    //overview
    if(pathname==='/' || pathname==='/overview')
    {
        res.writeHead(200,{'Content-type':'text/html'});
        const cardsHtml=parsed_data.map(element=>replace_Template(temp_card,element)).join(' ');
        const output=temp_overview.replace(/{%PRODUCTCARDS%}/g,cardsHtml);
        res.end(output);
    }

    //product
    else if(pathname==='/product')
    {
        res.writeHead(200,{'Content-type':'text/html'});
        const product=parsed_data[query.id];
        const output=replace_Template(temp_product,product);
        res.end(output);
        
    }

    //api
    else if(pathname==='/api')
    {
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(text);
        
    }

    //not found
    else
    {
        res.end("hello from server!!");
    }
    
})
server.listen(8000,'127.0.0.1',()=>{
    console.log("listening!!!")
});


