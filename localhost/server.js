const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer();

server.on("request", (req, res) => {
  const parsedUrl = new URL(req.url, "http://127.0.0.1");
  let pathName = parsedUrl.pathname;
  let ext = path.extname(pathName);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Max-Age", 2592000);

  if (pathName !== "/" && pathName[pathName.length - 1] === "/") {
    res.writeHead(302, { Location: pathName.slice(0, -1) });
    res.end();
    return;
  }

  if (pathName === "/") {
    ext = ".json";
    pathName = "/data.json";
  } else if (!ext) {
    ext = ".json";
    pathName += ext;
  }

  const filePath = path.join(process.cwd(), "/public", pathName);
  fs.exists(filePath, function (exist, err) {
    if (!exist || !mimeTypes[ext]) {
      console.log("Файл не найден:" + pathName);
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write("404 Not Found");
      res.end();
      return;
    }
    res.writeHead(200, { "Content-Type": mimeTypes[ext] });
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

server.listen(5000);
console.log("Server listening on " + 5000);
