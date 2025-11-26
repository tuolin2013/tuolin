// api/gemini-proxy.js

// 确保使用 require 语法
const { GoogleGenAI } = require("@google/genai");
// 在这个最终版本中，我们不再需要 GoogleAuth，所以可以移除它的引用
// const { GoogleAuth } = require('google-auth-library'); 

// 1. 从环境变量中获取JSON密钥内容
const SERVICE_ACCOUNT_JSON_CONTENT = process.env.SERVICE_ACCOUNT_JSON;

let ai; // 声明客户端变量

try {
    // 直接将 JSON 内容作为 credentials 参数传入
    // 强制 SDK 使用这个凭证，绕过环境认证查找
    ai = new GoogleGenAI({
        credentials: JSON.parse(SERVICE_ACCOUNT_JSON_CONTENT),
        // 虽然我们直接传入了credentials，但scopes也一并提供
        scopes: ['https://www.googleapis.com/auth/genai'] 
    });

} catch (e) {
    // 如果解析或认证失败，记录错误并设置客户端为 null
    console.error("Authentication Setup Error:", e.message);
    ai = null; 
}

// Vercel Serverless Function 入口
module.exports = async (req, res) => {
    // 设置 CORS 头部
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理 OPTIONS 请求（CORS预检）
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 检查请求方法
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // 检查认证客户端是否成功创建
    if (!ai) {
        // 如果这里返回错误，说明 SERVICE_ACCOUNT_JSON 格式仍然有问题
        return res.status(500).json({
            status: 'error',
            message: 'Gemini Client Initialization Failed. Check Vercel logs for JSON parsing errors.'
        });
    }

    try {
        // 2. 从手机请求中解析出 Prompt JSON
        const requestBody = req.body;
        const promptContents = requestBody.contents;

        // 3. 调用 Gemini API
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // 默认使用快速模型
            contents: promptContents,
        });

        // 4. 将 AI 结果返回给手机
        res.status(200).json({
            status: 'success',
            script: response.text
        });

    } catch (error) {
        // 5. 处理错误并返回失败信息
        // 这里的错误通常是 API 调用失败（如权限、模型错误等）
        console.error('Gemini API Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to generate content: ' + error.message,
            content: error.message
        });
    }
};
