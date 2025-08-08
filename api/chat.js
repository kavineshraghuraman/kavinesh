// File: pages/api/chat.js   OR   api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // You can use llama3-70b-8192 for better quality
        messages: [
          { role: "system", content: "You are a Tamil-speaking assistant helping Indian farmers." },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error: ${errText}`);
    }

    const data = await response.json();
    res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "பதில் வரவில்லை."
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ reply: "⚠️ பிழை ஏற்பட்டது: " + error.message });
  }
}
