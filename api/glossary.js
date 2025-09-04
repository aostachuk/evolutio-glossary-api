// api/glossary.js - DIAGNOSTIC VERSION
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  // A simple response that doesn't depend on Notion or environment variables
  res.status(200).json({ message: "Hello World. The API is working." });
};
