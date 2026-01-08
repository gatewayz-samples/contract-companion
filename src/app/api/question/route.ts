import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { contractText, question, chatHistory, model } = await req.json();

    if (!contractText || !question) {
      return NextResponse.json(
        { error: 'Contract text and question are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GATEWAYZ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Use the provided model or default to gpt-4o
    const selectedModel = model || 'openai/gpt-4o';

    // Build messages array with context
    const messages = [
      {
        role: 'system',
        content: `You are a legal AI assistant specialized in contract analysis. Answer questions about the contract provided below with precision and cite specific sections when relevant.

Contract:
${contractText}

Guidelines:
- Provide clear, direct answers
- Cite specific sections or clauses from the contract
- Use plain English explanations
- Point out any ambiguities or concerns
- If information is not in the contract, clearly state that`,
      },
      // Add previous chat history for context
      ...(chatHistory || []).map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content: question,
      },
    ];

    // Call Gatewayz Chat Completions API
    const response = await fetch('https://api.gatewayz.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        max_tokens: 2000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gatewayz API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get answer' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Question error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
