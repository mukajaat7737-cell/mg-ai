export default async function handler(req, res) {
  // केवल POST request स्वीकार करें
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "केवल POST request स्वीकार की जाती है।"
    });
  }

  try {
    const { message } = req.body || {};

    // खाली message check
    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "कृपया अपना सवाल लिखें।"
      });
    }

    // API key check
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY सेट नहीं है।"
      });
    }

    // OpenAI Responses API
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },

      body: JSON.stringify({
        model: "gpt-5",

        instructions:
          "तुम MG AI हो। उपयोगकर्ता से हमेशा हिंदी में बात करो। " +
          "सवाल का सीधा, सही और आसान जवाब दो। " +
          "जहाँ जरूरी हो वहाँ उदाहरण भी दो।",

        input: message.trim()
      })
    });

    const data = await response.json();

    // OpenAI API error
    if (!response.ok) {
      console.error("OpenAI Error:", data);

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "AI से जवाब प्राप्त नहीं हो सका।"
      });
    }

    // AI answer
    const answer =
      data?.output_text ||
      "मुझे अभी जवाब प्राप्त नहीं हुआ।";

    return res.status(200).json({
      answer
    });

  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      error: "सर्वर में समस्या हुई।"
    });
  }
}
