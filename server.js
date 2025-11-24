import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required." });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: userMessage }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({ error: "Server error." });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
