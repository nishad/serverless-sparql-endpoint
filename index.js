import init, * as oxigraph from "https://esm.sh/oxigraph@0.3.16/web.js";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

await init();

const {
  TURTLE_FILE_URL = "https://www.yamaml.org/examples/tbbt_v02.ttl",
  BASE_URI = "http://purl.org/yama/examples/2022/tbbt/0.2/",
} = Deno.env.toObject();

async function fetchTurtleFile() {
  const response = await fetch(TURTLE_FILE_URL);
  return await response.text();
}

async function createStore() {
  const turtleContent = await fetchTurtleFile();
  const store = new oxigraph.Store();
  store.load(turtleContent, "text/turtle", BASE_URI);
  return store;
}

const store = await createStore();

async function executeQuery({ store, query }) {
  const response = {
    query,
    results: [],
  };

  if (!query) {
    response.error = "Empty or missing query parameter";
    return response;
  }

  if (!query.trimStart().toUpperCase().startsWith("SELECT ")) {
    response.error = "Only SELECT queries are supported";
    return response;
  }

  try {
    for (const binding of store.query(query)) {
      const result = {};
      binding.forEach((value, key) => {
        result[key] = value ? value.value : null;
      });
      response.results.push(result);
    }
  } catch (error) {
    response.error = error.message;
    if (Deno.env.get("ENV") === "development") {
      response.stack = error.stack;
    }
  }

  return response;
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const query = params.get("query");

  if (request.method === "GET") {
    const response = await executeQuery({ store, query });
    return new Response(JSON.stringify(response, null, 2));
  }

  return new Response("Unsupported request method", { status: 405 });
}

serve(handleRequest);
