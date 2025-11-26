import { GoogleGenAI } from "@google/genai";
import { GoogleAuth } from 'google-auth-library'; // <--- 新增导入

// 1. 从环境变量中获取JSON密钥内容
const SERVICE_ACCOUNT_JSON_CONTENT = process.env.SERVICE_ACCOUNT_JSON;

// 解析JSON内容以创建凭证
let client;

try {
    const credentials = JSON.parse(SERVICE_ACCOUNT_JSON_CONTENT);
    
    // 使用服务账号凭证进行认证
    const auth = new GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    // 创建一个已认证的客户端
    client = new GoogleGenAI({ 
        auth, 
        // 这里的apiKey是可选的，但设置auth是必须的
    });

} catch (e) {
    console.error("Authentication Setup Error: Could not parse SERVICE_ACCOUNT_JSON_CONTENT");
    // 如果认证失败，强制退出或提供错误信息
    client = null;
}

// ... 剩下的代码 (export default async function handler(req, res)) ...
