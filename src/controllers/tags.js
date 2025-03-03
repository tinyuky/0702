const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTags = async (req, res) => {
  try {
    const popularTags = await prisma.article.groupBy({
      by: ["tagList"], 
      _count: { tagList: true }, 
      orderBy: { _count: { tagList: "desc" } }, 
      take: 10, 
    });

    const tags = popularTags.map((tag) => tag.tagList);

    res.json({ tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ errors: { body: ["Could not fetch tags"] } });
  }
};

module.exports = { getTags };
