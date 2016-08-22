// jshint esversion:6
const http = require("http");
const fs = require("fs");
const index = fs.readFileSync("./index.html");

class Server {

    constructor () {
        var self = this;
        this.server = http.createServer(function (req, res) {
            var url = req.url, status = 200, content;

            if (url === "/") {
                url = "/index.html";
            }

            try {
                content = fs.readFileSync("." + url);
            } catch (e) {
                status = 404;
            }

            res.writeHead(status, {
                "Content-Type": self.getContentTypeByFileName(url)
            });

            res.end(content);
        }).listen(8080);
    }

    getContentTypeByFileName (name) {
        var ext = name.match(/\.([\w]+)$/);

        if (ext) {
            ext = ext[1];
        }

        switch (ext) {
            case "html": return "text/html";
            case "js": return "text/javascript";
            case "css": return "text/css";
            default: return "text/plain";
        }
    }


}

new Server();