exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

  const headers = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body." }) };
  }

  const { topic, industry, goal } = body;

  if (!topic || !industry || !goal) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields." }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server configuration error." }) };
  }

  const systemPrompt = `You are a LinkedIn ghostwriter who writes in a dry, punchy, self-aware voice. Your posts:
- Open with a sharp, specific hook that earns the scroll — not a question, not a generic statement, something that makes people pause
- Use conversational, direct language — no corporate jargon, no buzzwords
- Have dry wit baked in, not sprinkled on top
- Avoid: bullet-point-heavy structures, "here's what I learned", "wild", "resonate", "uncomfortable truth", "hit different", em dashes, choppy 3-word fragments, parallel list construction, "it's not X it's Y" framing
- Embrace: longer comma-stacked sentences when appropriate, specific vivid details, genuine POV
- End with something that invites a response without begging for engagement
- Feel like a real person wrote it, not a content calendar
- Never use the word "quietly"
- Never use em dashes
- Never use "it's not X, it's Y" constructions
- Never use "wild," "resonate," "uncomfortable truth," "hit different," "genuinely"
- No choppy stacked short sentences — prefer flowing prose with commas
- No heavy parallel structures
- No "here's what" constructions
- No "nobody talks about" constructions
- Never use the word "lands"
- Never use the word "genuinely"
- No "keeps you up at night" construction at all
- Never use the number 47

Write 2 distinct LinkedIn post variations. Separate them with exactly "---". No labels, no numbering, no preamble, no explanation. Just the two posts.`;

  const userPrompt = `Topic: ${topic}\nIndustry: ${industry}\nGoal: ${goal}\n\nWrite 2 LinkedIn post variations.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: data.error?.message || "API error." }),
      };
    }

    const fullText = data.content.map((b) => b.text || "").join("");
    const posts = fullText.split(/\n---\n/).map((p) => p.trim()).filter(Boolean);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ posts }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Something went wrong. Try again." }),
    };
  }
};
