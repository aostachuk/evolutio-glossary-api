// api/glossary.js
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

exports.handler = async function (event, context) {
  // SECURITY: Optional - check for a secret key if you want to lock down access
  // if (event.headers['x-custom-header'] !== 'YourSecretValue') {
  //   return { statusCode: 401, body: 'Unauthorized' };
  // }

  try {
    const response = await notion.databases.query({
      database_id: process.env.DATABASE_ID, // We'll set this as an environment variable too
      filter: {
        property: "Status",
        select: {
          equals: "Finalized",
        },
      },
      sorts: [
        {
          property: "Term",
          direction: "ascending",
        },
      ],
    });

    const glossaryTerms = response.results.map((page) => {
      const termProperty = page.properties["Term"];
      const definitionProperty = page.properties["Definition"];
      const wikidataProperty = page.properties["Wikidata QID"];

      return {
        id: page.id,
        term: termProperty?.title[0]?.plain_text || "Term not available",
        definition: definitionProperty?.rich_text[0]?.plain_text || "Definition not available",
        wikidata: wikidataProperty?.url || null,
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allows your WordPress site to access this API
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ terms: glossaryTerms }),
    };
  } catch (error) {
    console.error("Error fetching glossary:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch glossary data" }),
    };
  }
};
