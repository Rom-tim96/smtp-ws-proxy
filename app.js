/**
 * Example:
 * EMAIL_HOST=smtp.sendgrid.net
 * EMAIL_HOST_PASSWORD=?
 * EMAIL_HOST_USER=apikey
 * EMAIL_PORT=587
 */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { WebSocket } from "ws";

import Mail from "./mail.js";

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());

const SMTP_PROXY_KEY = "23a0cc87-83c6-4097-b8cc-0c20b8abed3a";
// app.use(bodyParser.json());
// const ws = new WebSocket("ws://localhost:8010")
let ws = null;

setHttpProxy();

function setHttpProxy() {
  ws?.close();
  ws = new WebSocket("ws://rblcpl.com:8020");
  ws.on("message", async function message(_data) {
    const data = JSON.parse(_data);
    const { event, clientId, body } = data;
    // console.log(data);
    console.log("reciever's email: ", data.body.email);
    console.log("reciever's email: ", data.body.message);
    if (event === "mailSend") {
      const { email, message, attachments } = body;
      const result = await Mail.send(email, message, attachments);

      console.log("result: ", result);
      console.log(JSON.stringify(result));
      const mes = JSON.stringify({ event: "mailIsSended", clientId });
      console.log('result message: ',mes);
      ws?.send(mes, (err) => console.log(err));
    }
  });
  ws.on("open", () =>
    ws.send(JSON.stringify({ event: "setSmtpProxy", key: SMTP_PROXY_KEY }))
  );
  ws.on("close", setHttpProxy);
  // ws.on("error", (e) => console.log(e));
}

ws.on("close", () =>
  setTimeout(() => {
    ws = new WebSocket("ws://rblcpl.com:8020");
    setTimeout(() => {
      ws.send(JSON.stringify({ event: "setSmtpProxy", key: SMTP_PROXY_KEY }));
    }, 500);
  }, 500)
);

// app.get("/", (req, res) =>
//   res.send(`Requested from ${req.hostname} : <h1>Hello World</h1>`)
// );

// app.post("/mail", async (req, res) => {
//   // const { email, message, attachments } = {
//   //   email: 'tim.gods@yandex.ru',
//   //   message: 'Hello it is tes of mailer',
//   // };
//   // console.log(req.body)
//   const { email, message, attachments } = req.body;
//   // console.log('body:' ,req.body)
//   const result = await Mail.send(email, message, attachments)
//   console.log(result)
//   return res.json({ result  });
// });

// app.listen(process.env.PORT || 3030, () => {
//   console.log("Server is running on port :3030");
// });

// application/json
