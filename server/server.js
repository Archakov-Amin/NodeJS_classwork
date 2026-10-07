const http = require("http")

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.end("Hello World")
}).listen(3000, () => {
    console.log("Сервер успешно запущен! Порт: 3000");
})