export default async function handler(req, res) {
  const { message } = req.body;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.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}`
    },
    body: JSON.stringify({
      model: "llama3-8b-8192", // You can use llama3-70b-8192 for higher quality
      messages: [
        { role: "system", content: "You are a Tamil-speaking assistant helping Indian farmers." },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices?.[0]?.message?.content || "பதில் வரவில்லை." });
}
