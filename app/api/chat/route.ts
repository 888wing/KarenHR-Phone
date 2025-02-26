import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 添加詳細的錯誤檢查
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    if (!completion.choices[0].message) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json(completion.choices[0].message);
    
  } catch (error: any) {
    console.error('Error details:', error);
    
    // 返回更具體的錯誤信息
    return NextResponse.json(
      { 
        error: "Error processing your request",
        details: error.message 
      }, 
      { status: 500 }
    );
  }
} 