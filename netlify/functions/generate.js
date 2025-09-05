import fetch from "node-fetch";

// netlify/functions/generate.js
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { prompt, image } = JSON.parse(event.body);

    // Pollinations Kontext endpoint (expects image URL, not base64)
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



