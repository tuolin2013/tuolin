// api/gemini-proxy.js

// 强制 Vercel 部署到北美区域，避免可能的网络问题
export const config = {
  runtime: 'nodejs',
  regions: ['pdx1', 'sfo1'] // 俄勒冈或旧金山，最稳定的区域
};

// 确保使用 require 语法
const { GoogleGenAI } = require("@google/genai");
// 移除对 'google-auth-library' 的依赖，使用最底层的credentials初始化

// 1. 从环境变量中获取JSON密钥内容
const SERVICE_ACCOUNT_JSON_CONTENT = process.env.SERVICE_ACCOUNT_JSON;

let ai; // 声明客户端变量

try {
    const credentials = JSON.parse(SERVICE_ACCOUNT_JSON_CONTENT);

    // 强制使用提供的凭证来初始化客户端 (最底层的、最鲁棒的方法)
    ai = new GoogleGenAI({ 
        credentials,
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
        return res.status(500).json({
            status: 'error',
            message: 'Gemini Client Initialization Failed. Check Vercel logs for JSON parsing errors.'
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
        console.error('Gemini API Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to generate content: ' + error.message,
            content: error.message
        });
    }
};
