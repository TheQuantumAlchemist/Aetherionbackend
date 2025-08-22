import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if(!userMessage) return res.json({ reply: "No message received." });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AETHERION_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: "You are Aetherion, a helpful AI assistant." },
          { role: "user", content: userMessage }
        ],
        max_tokens: 25000
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Something went wrong on the backend." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Aetherion Backend running on port ${port}`));
