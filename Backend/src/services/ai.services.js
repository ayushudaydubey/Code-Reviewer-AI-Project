import { GoogleGenAI } from "@google/genai"
import config from "../config/config.js";

const ai = new GoogleGenAI({ apiKey: config.GOOGLE_API_KEY });


async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "how to make coding easy",
    config:{
      systemInstruction:"You have good knowledage of Mern stack "
    }
  });
  console.log(response.text);
}

await main();