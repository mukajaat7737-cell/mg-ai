const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: userMessage
  })
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || "AI से जवाब नहीं मिला");
}

console.log(data.answer);
