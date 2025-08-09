export default async function handler(req, res) {
  // 1. Get message from frontend
  const { message } = req.body;

  // 2. Ensure API key exists
  if (!process.env.DEEPSEEK_API_KEY) {
    return res.status(500).json({ reply: "⚠️ பிழை: DEEPSEEK_API_KEY அமைக்கப்படவில்லை." });
  }

  try {
    // 3. Call DeepSeek API
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `
நீங்கள் ஒரு தமிழ் விவசாய உதவியாளர்.
பதில்களை எப்போதும் **Markdown** வடிவில் எழுதவும்:
- முக்கிய புள்ளிகளை bullet points ஆக எழுதவும்
- பட்டியலுக்கு '-' பயன்படுத்தவும்
- முக்கிய வார்த்தைகளை **போல்ட்** ஆக்கவும்
- தேவைப்பட்டால் Markdown அட்டவணைகளை பயன்படுத்தவும்
- ஒருபோதும் plain text மட்டும் தர வேண்டாம்
            `
          },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    // 4. Parse API response
    const data = await response.json();

    if (!response.ok) {
      console.error("DeepSeek API Error:", data);
      return res.status(response.status).json({ reply: "⚠️ பிழை: AI சேவையுடன் இணைக்க முடியவில்லை." });
    }

    // 5. Send the reply back to frontend
    res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "பதில் வரவில்லை."
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ reply: "⚠️ பிழை: சர்வரில் ஒரு சிக்கல் ஏற்பட்டது." });
  }
}
