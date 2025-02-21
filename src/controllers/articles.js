const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createArticle = async (req, res) => {
    const { title, content } = req.body.article;
    const authorId = req.user.userId;

    const article = await prisma.article.create({
        data: { title, content, authorId }
    });

    res.json(article);
}


const getArticles = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const articles = await prisma.article.findMany({
        where: {
            authorId: req.user.userId
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
            id: 'desc'
        }
    });
    res.json(articles);
}

module.exports = {
  createArticle,
  getArticles
}