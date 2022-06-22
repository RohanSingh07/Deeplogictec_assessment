const http = require("http");
const https = require("https");


const port = process.env.port || 5000 ;


// Server
const server = http.createServer((req,res)=>{
    
    if(req.url==="/"){
        res.writeHead(200,{"content-type":"text/html"})
        res.end("<h2>Hello World</h2>  <h2>Click <a href='http://localhost:5000/getTimeStories'>http://localhost:5000/getTimeStories</a> to use the API or directly type the url </h2>")
    }

    else if(req.url === "/getTimeStories"){
        var final_results = []
        https.get("https://time.com/",function(response){
            var data = ""
            response.on("data",function(chunk){
                data += chunk
            })
            response.on("end",function(){
                
                var position = data.search("latest-stories__heading")
                data = data.substring(position,)    // slice() is replaced with subtring()
                var position_last = data.search("</ul>")
                data = data.substring(0,position_last)
                position = data.search('<li class="latest-stories__item">')
                data = data.substring(position,)
                var href = data.split("href")
                var headlines = data.split("latest-stories__item-headline")
                
                for(var i=1;i<7;i++){
                    final_results.push({"title":headlines[i].substring(2,headlines[i].search("</")),"link":'https://time.com'+href[i].substring(2,href[i].search(">")-1)})

                }
            console.log(final_results)
            res.writeHead(200,{"content-type":"application/json"})
            res.end(JSON.stringify(final_results))    
            })

            response.on("error",function(err){
                console.log(err)
            })
        })        
        
    }
    else{
        res.writeHead(404,{"content-type":"text/html"})
        res.write("<h1>Page Not Found</h1>")
        res.end()
    }
})


// Listener

server.listen(port,()=>{
    console.log(`Connection established at port number ${port}`)
})

