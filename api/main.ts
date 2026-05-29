import { shortenUrl, getUrl } from "./database.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (url.pathname === "/api/shorten" && req.method === "POST") {
    try {
      const body = await req.json();

      if (!body?.url) {
        return Response.json(
          { error: "No URL provided" },
          { status: 400, headers: corsHeaders }
        );
      }

      const hash = await shortenUrl(body.url);

      return Response.json({ hash }, { headers: corsHeaders });
    } catch {
      return Response.json(
        { error: "Internal Server Error" },
        { status: 500, headers: corsHeaders }
      );
    }
  }

  const path = url.pathname.slice(1);

  if (path && !path.startsWith("api")) {
    const target = await getUrl(path);

    if (target) {
      return Response.redirect(target, 302);
    }

    return new Response("Not Found", { status: 404 });
  }

  return new Response("Not Found", { status: 404 });
});
