const http = require("http");
const fs = require("fs");
const {EventEmitter} = require("events");

const port = 3000;
const newsletter = new EventEmitter();

newsletter.on("signup", (contact) => {
    fs.appendFile(
        "./newsletter.csv",
        `${contact.name},${contact.email}/n`,
        (err) => {
            if(err) {
                console.error(err);
            }else {
                console.log(`Added ${contact.name} to the newletter list.`);
            }
        }
    );
});

const server = http.createServer((req, res) => {
    const {url, method } = req;
    const chunks = [];

    req.on("data", (chunk) => chunks.push(chunk));

    req.on ("end", () => {
        if (url == "/newsletter_signup" && method == "POST") {
            let reqBody;
            try {
                reqBody = JSON.parse(Buffer.contact(chunks).toString());
            }catch (err) {
                res.writeHead(400, {"Content-Type": "application/json"});
                res.write(
                    JSON.stringify({
                        msg: "You did not provide the correct request body details.",
                    })
                );
                res.end();
            }
            newsletter.emit("signup", reqBody);

            res.writeHead(200, {"Content-Type":"application/json"});
            res.write(JSON.stringify({ msg: "Thanks for signing up!"}));
            res.end();
        } else if (url == "/newsletter_signup" && method == "GET") {
            fs.readFile("./index.html",(err, contents) =>{
                let response = "contents",
                contentType = "text/htmk",
                status = 200;

                
                if (err) {
                    console.eroor(err);
                    status = 500;
                    response = "<h1>Server Error</h1>";
                }

                res.writeHead(404, {"Content-Type": "contentType"});
                res.write(response);
                res.end();
            });
        } else {
            res.writeHead(404, { "Content-Type": "text/html"});
            res.write("<h1>404 Page Not Found</h1>");
            res.end();
        }
    
