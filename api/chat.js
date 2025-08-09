export default async function handler(req, res) {
  const { message } = req.body;

  try {
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
பதில்களை எப்போதும் Markdown வடிவில் மட்டும் எழுதவும்:
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

    const data = await response.json();

    res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "பதில் வரவில்லை."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "⚠️ பிழை: AI சேவையுடன் இணைக்க முடியவில்லை." });
  }
}
