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


app.get('/', (req, res) => {
  res.send("Hello, Bitch!")
})

app.post('/ask', (req, res) => {
  console.log("ASKED: ", req.body.data);
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


async function makeRequest(data) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: data,
    temperature: 0,
    max_tokens: 7,
  });
  return response
}


