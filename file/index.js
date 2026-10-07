// Создание файла

const fs = require('fs')

// fs.writeFileSync("test.txt", "hello maga")
// fs.writeFileSync("test.docx", "hello maga")

// fs.writeFile("test2.txt", "hello", (err)=>{
//     if(err) throw err;
//     console.log("Файл создан!");
// })

files_names = ["test1", "test2", "test3", "test4", "test5"]

for (const name of files_names) {
    fs.writeFile(`${name}.txt`, "hello", (err)=>{
        if(err) throw err;
        console.log("Файл создан!");
    })
}

// Чтение файлов