export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST method required" });
  }

  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "सवाल लिखिए।" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5",
        instructions:
          "तुम MG AI हो। उपयोगकर्ता से हिंदी में सरल, दोस्ताना और उपयोगी तरीके से जवाब दो।",
        input: message.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "AI से जवाब नहीं मिला।"
      });
    }

    return res.status(200).json({
      answer: data.output_text || "मुझे कोई जवाब नहीं मिला।"
    });

  } catch (error) {
    return res.status(500).json({
      error: "सर्वर में समस्या हुई।"
    });
  }
}
