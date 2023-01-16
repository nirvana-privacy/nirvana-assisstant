const express = require('express')
const app = express()
const port = process.env.PORT || 3000
var bodyParser = require('body-parser');

app.use(bodyParser.json());

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

app.get('/', (req, res) => {
  console.log(req.body.data)
  // if(!req.body.data) {
  //   req.body.data = "How does it work?";
  // }
  makeRequest(req.body.data).then((data) => {
    console.log(data.data.choices[0].text)
    res.send(data.data.choices[0].text)
});
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))





async function makeRequest(data) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: data,
        temperature: 0,
        max_tokens: 7,
    });
    return response
}


