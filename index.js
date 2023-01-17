const express = require('express')
const app = express()
const port = process.env.PORT || 3000
var bodyParser = require('body-parser');

app.use(bodyParser.json());

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN,
});
const openai = new OpenAIApi(configuration);

const maxContextTurns = 20;
let context = {
  conversation: [
  ]
};


app.get('/', (req, res) => {
  res.send("Hello, Bitch!")
})

app.post('/ask', (req, res) => {
  console.log("ASKED: ", req.body);
  makeRequest(req.body.data).then((data) => {
    console.log('REPLY: ', data.data.choices[0].text)
    res.send(data.data.choices[0].text)
  }).catch((error)=>{
    console.error(error)
    res.send(error.message)
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
  console.log(process.env.NODE_ENV)
})


async function makeRequest(userMessage) {
  if (context.conversation.length > maxContextTurns) {
    context.conversation = context.conversation.slice(-maxContextTurns);
  }
  console.log("CONTEXT", context.conversation)
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${context.conversation.join('\n')}\n${userMessage}\n`,
    temperature: 0.5,
    max_tokens: 100,
    // stop: '\n',
    stream: false
  });
  return response
}
