import fetch from "node-fetch";

// netlify/functions/generate.js
// netlify/functions/generate.js
export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Allow": "POST" },
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." })
    };
  }

  try {
    const { prompt, image } = JSON.parse(event.body || "{}");

    if (!prompt || !image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt or image" })
      };
    }

    // Pollinations expects image URL, not base64
    const apiURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?model=kontext&image=${encodeURIComponent(image)}`;

    const response = await fetch(apiURL, {
      headers: {
        Authorization: "Bearer 7UThCeHBgj1gpv_V"
      }
    });

    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*"
      },
      body: Buffer.from(arrayBuffer).toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}





