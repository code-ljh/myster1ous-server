import express from 'express';
import * as libTemplate from '#library/template.js';

export const app = express();

app.get('/', (req, res) => {
    return res.status(200).send(libTemplate.get('home'));
});

// 确保有默认导出，供 Vercel 使用
export default app;