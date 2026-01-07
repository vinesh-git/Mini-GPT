import { GoogleGenAI } from "@google/genai"
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const ai = new GoogleGenAI({
    apiKey : process.env.GEMINI_API_KEY
});
// const r1 = readline.createInterface({ input,output });
// async function main() {
//     const userpromt = await new Promise<string>((resolve) => {
//         r1.question("Enter your promt: ", (answer) => resolve(answer));
//     });
//     r1.close();
//     const stream = await ai.models.generateContentStream({
//     model: "models/gemini-2.5-flash",
//     contents: userpromt
//   });

//   for await (const chunk of stream) {
//   if (chunk.text) {
//     for (const char of chunk.text) {
//       process.stdout.write(char);
//       await new Promise(r => setTimeout(r, 10));
//     }
//   }
// }


//   console.log("\n\n--- done ---");
// }

// main();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    const { prompt } = req.body;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    try {
        const stream = await ai.models.generateContentStream({
            model: "models/gemini-2.5-flash",
            contents : prompt
        })

        for await (const chunk of stream) {
            res.write(`data: ${chunk.text}\n\n`);
        }
        res.write(`data: [DONE]\n\n`);
        res.end();
    } catch (error) {
        res.write(`event: error\ndata: ${error}\n\n`);
        res.end();
    }
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
})