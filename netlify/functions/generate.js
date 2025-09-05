import fetch from "node-fetch";

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const formData = await (await import("form-data")).default;
  const multiparty = await import("multiparty");

  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    form.parse(event, async (err, fields, files) => {
      if (err) return resolve({ statusCode: 400, body: "Invalid form data" });

      const prompt = fields.prompt[0];
      const imageFile = files.image[0];

      const apiURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=kontext`;

      try {
        const fs = await import("fs");
        const fileStream = fs.createReadStream(imageFile.path);

        const formData = new (await import("form-data")).default();
        formData.append("image", fileStream);

        const response = await fetch(apiURL, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${process.env.POLLINATIONS_TOKEN}`
          },
          body: formData
        });

        const arrayBuffer = await response.arrayBuffer();
        resolve({
          statusCode: 200,
          headers: {
            "Content-Type": "image/png",
            "Access-Control-Allow-Origin": "*"
          },
          body: Buffer.from(arrayBuffer).toString("base64"),
          isBase64Encoded: true
        });
      } catch (e) {
        resolve({ statusCode: 500, body: "Server error: " + e.message });
      }
    });
  });
}

