const http = require("http")

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.end(`Group: 3P2. Student: Archakov Amin`)
}).listen(5000, () => {
    console.log("Сервер успешно запущен! Порт: 5000");
})