# Node.js course by GO.IT

https://expressjs.com/

npm init  //буде створений package.json з залежностями
або  
npm init -- yes 

npm i express

npm i nodemon -D

npm init @eslint/config@latest

$ npm install express --save

  "type":"module",
    "dev": "nodemoon index.js",
    "start": "node index.js"
  ctrl + c //reset terminal
  
  % налаштування https://www.edu.goit.global/uk/learn/24589586/25871577/26491422/training?blockId=26491535

$ npm install cors

npm i pino-http --save

npm i dotenv 
import dotenv from "dotenv";

npm install mongoose

npm i http-errors
----------------------------
constants - константі значення нашого застосунку
controllers - контролери
db - усе, що повʼязане із базою
middlewares - кастомні мідлвари
routers - express-роутери, які будуть використані в застосунку
services - основне місце, де ми будемо прописувати логіку
templates - шаблони для email
utils - різні функції, які допомагатимуть нам робити певні перетворення чи маніпуляції
validation - валідаційні схеми
index.js - файл, з якого буде починатися виконання нашої програми
server.js - файл, де ми опишемо наш express-сервер
