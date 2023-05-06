# Oxigraph RDF Store as a serverless SPARQL endpoint for Deno Deploy

This simple Deno Deploy application serves a serverless in-memory Oxigraph RDF store, allowing users to execute SPARQL `SELECT` queries against a specified Turtle file.

## Features

- Fetches and loads a Turtle file into an in-memory Oxigraph store
- Allows executing SPARQL `SELECT` queries against the store via a GET request.

## Requirements

- Deno 1.x
- [Deno Deploy](https://deno.com/deploy) (for deployment)

## Installation

1. Ensure you have Deno installed on your machine. Visit [deno.land](https://deno.land/) for installation instructions.
2. Clone the repository or download the source code to your local machine.

## Configuration

You can customize the Turtle file URL and base URI by setting the following environment variables:

- `TURTLE_FILE_URL`: The URL of the Turtle file to load into the Oxigraph store.
- `BASE_URI`: The base URI for the RDF data in the Turtle file.

You can set these variables in a `.env` file or directly in the environment before running the application.


## Usage

1. Run the application locally using the following command:

```bash
deno run --allow-net --allow-env index.js
```

2. Access the API by sending a GET request to `http://localhost:8000?query={your_query}` with your desired SPARQL `SELECT` query.

## Deployment

Deploy the application using [Deno Deploy](https://deno.com/deploy):

1. Create a new project on Deno Deploy and link it to your repository.
2. Set the deployment settings to use `index.js` as the entry point.
3. Deploy the application.

## Usage Reference

### Execute a SPARQL SELECT query

Send a GET request with the `query` parameter containing the SPARQL `SELECT` query.

```
GET /?query={query}
```

#### Parameters

- `query` (required) - The SPARQL `SELECT` query to execute against the in-memory Oxigraph store.

#### Response

Returns a JSON object containing the query results and any errors during the query execution.

```json
{
  "query": "string",
  "results": [
    {
      "key": "value"
    }
  ],
  "error": "string (optional)",
  "stack": "string (optional, only in development environment)"
}
```

## Demo

A demo deployment of this application is available at the following URL:

[https://serverless-sparql.deno.dev/](https://serverless-sparql.deno.dev/)

This demo deployment loads a simple RDF dataset from the example Turtle file available at [https://www.yamaml.org/examples/tbbt_v02.ttl](https://www.yamaml.org/examples/tbbt_v02.ttl).

### Example Query

To execute a SPARQL SELECT query against the demo deployment, simply append your desired query as a URL-encoded parameter to the base URL. For example, the following query retrieves all distinct subject, predicate, and object triples from the RDF store:

```sparql
SELECT DISTINCT ?s ?p ?o WHERE { ?s ?p ?o }
```

Access the query results by sending a GET request to the demo deployment URL with the `query` parameter:

[https://serverless-sparql.deno.dev/?query=SELECT%20DISTINCT%20?s%20?p%20?o%20WHERE%20%7B%20?s%20?p%20?o%20%7D](https://serverless-sparql.deno.dev/?query=SELECT%20DISTINCT%20?s%20?p%20?o%20WHERE%20%7B%20?s%20?p%20?o%20%7D)

Alternatively, you can use a tool like `curl` to send a GET request to the demo deployment:


```bash
curl "https://serverless-sparql.deno.dev/" \
  --get \
  --data-urlencode "query=SELECT DISTINCT ?s ?p ?o WHERE { ?s ?p ?o }"
```

## License

This project is licensed under the MIT License.
