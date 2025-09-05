import fetch from "node-fetch";

export async function handler() {
  try {
    const response = await fetch("https://image.pollinations.ai/feed", {
      headers: { "Authorization": `Bearer ${process.env.POLLINATIONS_TOKEN}` }
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let urls = [];

    while (urls.length < 12) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
      for (let line of lines) {
        if (line.startsWith("data:")) {
          try {
            const data = JSON.parse(line.replace("data: ", ""));
            if (data.imageURL) urls.push(data.imageURL);
            if (urls.length >= 12) break;
          } catch {}
        }
      }
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(urls)
    };
  } catch (e) {
    return { statusCode: 500, body: "Feed error: " + e.message };
  }
}
