import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import path from 'path';
import { fileURLToPath } from 'url';
import { client } from './app.service.mjs'
import fs from 'fs/promises'
const inputFilePath = './data/posts_with_embedding.json'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = await fs.readFile(inputFilePath, 'utf8');
const posts = JSON.parse(data);

const app = new Koa();
const router = new Router();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser());
app.use(serve(path.join(__dirname, 'public')));

// Error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      status: ctx.status,
      message: err.message || 'Internal Server Error'
    };
    console.error('Server Error:', err);
  }
});

function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
      throw new Error('向量长度不匹配');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

router.post('/api/search', async (ctx) => {
  const { keyword } = ctx.request.body;
  console.log('Search query:', keyword);
  
  if (!keyword || typeof keyword !== 'string') {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      message: '关键词不能为空'
    };
    return;
  }

  try {
    const response = await client.embeddings.create({
      model: 'text-embedding-ada-002',
      input: keyword,
    })
    
    const { embedding } = response.data[0];
    const results = posts.map(item => ({
      ...item,
      similarity: cosineSimilarity(embedding, item.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
    .map((item, index) => ({
      id: index + 1,
      title: item.title,
      category: item.category,
      similarity: Math.round(item.similarity * 100) / 100
    }));

    ctx.body = {
      status: 200,
      data: results
    }
  } catch (error) {
    console.error('Search error:', error);
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '搜索出错，请稍后再试'
    };
  }
})

// API endpoint to get categories for filtering
router.get('/api/categories', async (ctx) => {
  try {
    const categories = [...new Set(posts.map(post => post.category))];
    ctx.body = {
      status: 200,
      data: categories
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '获取分类失败'
    };
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);  
})

