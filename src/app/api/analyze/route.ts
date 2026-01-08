import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { contractText, model } = await req.json();

    if (!contractText) {
      return NextResponse.json(
        { error: 'Contract text is required' },
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

    // Create a comprehensive prompt for contract analysis
    const analysisPrompt = `You are a legal AI assistant specialized in contract analysis. Analyze the following contract and provide:

1. A plain-English summary of the key terms (2-3 paragraphs)
2. A list of potential concerns or risky clauses with severity levels
3. Key legal terms and their explanations

Contract:
${contractText}

Please respond in the following JSON format:
{
  "summary": "Plain English summary here...",
  "concerns": [
    {
      "title": "Concern title",
      "description": "Detailed explanation of the concern",
      "severity": "high" | "medium" | "low"
    }
  ],
  "keyTerms": [
    {
      "term": "Term name",
      "explanation": "Plain English explanation"
    }
  ]
}

Focus on identifying:
- One-sided or unfair clauses
- Liability and indemnification terms
- Payment and termination conditions
- Unusual or concerning language
- Missing important provisions`;

    // Call Gatewayz Chat Completions API
const response = await fetch('https://api.gatewayz.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: 'user',
            content: analysisPrompt,
          },
        ],
        max_tokens: 4000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gatewayz API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to analyze contract' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON from the response
    let analysis;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      analysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', content);
      // Fallback: create a basic structure
      analysis = {
        summary: content,
        concerns: [],
        keyTerms: [],
      };
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
