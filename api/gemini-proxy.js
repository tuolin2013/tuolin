// api/gemini-proxy.js

// 确保使用 require 语法
const { GoogleGenAI } = require("@google/genai");

// 从环境变量中获取 API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let ai; // 声明客户端变量

try {
    // 使用 API Key 初始化客户端 (最简单可靠的方式)
    ai = new GoogleGenAI({ 
        apiKey: GEMINI_API_KEY
    });
} catch (e) {
    // 如果初始化失败，设置客户端为 null
    console.error("Client Initialization Error:", e.message);
    ai = null; 
}

// Vercel Serverless Function 入口
module.exports = async (req, res) => {
    // 设置 CORS 头部
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // 检查 API Key 是否加载成功
    if (!ai || !GEMINI_API_KEY) {
        return res.status(500).json({
            status: 'error',
            message: 'Gemini Client Initialization Failed. API Key missing or client error.'
        });
    }

    try {
        const requestBody = req.body;
        const promptContents = requestBody.contents;

        // 3. 调用 Gemini API
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: promptContents,
        });

        // 4. 将 AI 结果返回给手机
        res.status(200).json({
            status: 'success',
            script: response.text
        });

    } catch (error) {
        // 5. 处理错误并返回失败信息
        console.error('Gemini API Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to generate content: ' + error.message,
            content: error.message
        });
    }
};
