// api/glossary.js
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

module.exports = async (req, res) => {
  // Set CORS headers to allow your WordPress site to access this API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    const response = await notion.databases.query({
      database_id: process.env.DATABASE_ID,
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

    res.status(200).json({ terms: glossaryTerms });
    
  } catch (error) {
    console.error("Error fetching glossary:", error);
    res.status(500).json({ error: "Failed to fetch glossary data" });
  }
};
