import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return Response.json({ error: "Missing prompt" }, { status: 400 });

    const messages = [{ role: "user", content: prompt }];
    const tools = [{ type: "web_search_20250305", name: "web_search" }];
    let finalText = "";

    for (let i = 0; i < 8; i++) {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        tools,
        messages,
      });

      if (response.stop_reason === "end_turn") {
        finalText = response.content
          .filter((b) => b.type === "text")
          .map((b) => b.text)
          .join("\n");
        break;
      }

      if (response.stop_reason === "tool_use") {
        messages.push({ role: "assistant", content: response.content });
        const toolResults = response.content
          .filter((b) => b.type === "tool_use")
          .map((b) => ({ type: "tool_result", tool_use_id: b.id, content: "搜尋完成" }));
        messages.push({ role: "user", content: toolResults });
      } else {
        finalText = response.content
          .filter((b) => b.type === "text")
          .map((b) => b.text)
          .join("\n");
        break;
      }
    }

    return Response.json({ text: finalText });
  } catch (e) {
    return Response.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
