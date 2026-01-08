# Contract Companion - Legal AI Assistant

A powerful Next.js application that uses AI to analyze legal contracts, identify risks, and answer questions about contract terms.

## Features

### 1. **Plain-English Contract Summary**
- Upload or paste any contract text
- Get a comprehensive summary of key terms in plain English
- Understand complex legal language quickly

### 2. **Risk & Concern Detection**
- Automatically identifies potential concerns and risky clauses
- Categorizes issues by severity (High, Medium, Low)
- Highlights one-sided terms, liability issues, and unfair clauses
- Examples:
  - One-sided indemnity clauses favoring vendors
  - Unusual liability caps or limitations
  - Problematic termination conditions
  - Missing important provisions

### 3. **Key Terms Explanation**
- Extracts and explains important legal terms
- Provides plain-English definitions
- Helps non-lawyers understand contract language

### 4. **Interactive Q&A with Citations**
- Ask specific questions about the contract
- Get answers with citations from relevant sections
- Maintains conversation context
- Example questions:
  - "What's the liability cap?"
  - "Who is responsible for indemnity?"
  - "What are the termination conditions?"
  - "Are there any automatic renewal clauses?"

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **AI Provider**: Gatewayz AI API (OpenAI GPT-4)
- **Icons**: Lucide React

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ or Bun runtime
- A Gatewayz API key (get one at https://api.gatewayz.ai)

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
GATEWAYZ_API_KEY=your_api_key_here
```

### 3. Installation
```bash
# Using npm
npm install

# Using bun
bun install
```

### 4. Run Development Server
```bash
# Using npm
npm run dev

# Using bun
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
# Using npm
npm run build
npm start

# Using bun
bun run build
bun start
```

## Usage Guide

### Analyzing a Contract

1. **Upload or Paste Contract**
   - Click "Choose File" to upload a .txt file
   - OR paste contract text directly into the text area

2. **Click "Analyze Contract"**
   - The AI will process the contract
   - Results appear in three tabs:
     - **Summary**: Overview of key terms
     - **Concerns**: Risk assessment with severity levels
     - **Key Terms**: Important legal terminology explained

3. **Ask Questions**
   - Type questions in the Q&A section at the bottom
   - Get detailed answers with contract citations
   - Build a conversation for deeper understanding

### Best Practices

- **Contract Format**: Plain text works best. For PDFs, extract text first.
- **Contract Length**: Works with contracts of various lengths. Longer contracts may take more time to analyze.
- **Specific Questions**: Ask focused questions for better answers (e.g., "What is the notice period for termination?" vs "Tell me about termination")
- **Follow-up Questions**: Use the chat history to ask related follow-up questions

## API Endpoints

### POST `/api/analyze`
Analyzes a contract and returns structured insights.

**Request Body:**
```json
{
  "contractText": "string"
}
```

**Response:**
```json
{
  "analysis": {
    "summary": "string",
    "concerns": [
      {
        "title": "string",
        "description": "string",
        "severity":"high" | "medium" | "low"
      }
    ],
    "keyTerms": [
      {
        "term": "string",
        "explanation": "string"
      }
    ]
  }
}
```

### POST `/api/question`
Answers questions about a specific contract.

**Request Body:**
```json
{
  "contractText": "string",
  "question": "string",
  "chatHistory": [
    {
      "role": "user" | "assistant",
      "content": "string"
    }
  ]
}
```

**Response:**
```json
{
  "answer": "string"
}
```

## Features Showcase

### Retrieval-Augmented Generation (RAG)
- The entire contract text is provided as context to the AI
- Questions are answered based on actual contract content
- Citations reference specific sections and clauses
- Maintains accuracy and trustworthiness

### Long Context Handling
- Supports contracts of various lengths
- Uses GPT-4 with extended context window
- Efficiently processes complex legal documents

### Legal Domain Expertise
- Specialized prompts for legal analysis
- Focuses on common contract issues:
  - Indemnification clauses
  - Liability limitations
  - Payment terms
  - Termination conditions
  - Intellectual property rights
  - Confidentiality provisions

## Use Cases

1. **Small Business Owners**: Review vendor contracts before signing
2. **Lawyers**: Quick initial analysis to identify areas needing deeper review
3. **Contract Managers**: Risk assessment and compliance checking
4. **Procurement Teams**: Vendor agreement evaluation
5. **Legal Education**: Teaching tool for understanding contract structure

## Limitations & Disclaimers

⚠️ **This tool is for informational purposes only and does not constitute legal advice.**

- AI analysis should not replace professional legal review
- Always consult with a qualified attorney for important contracts
- The AI may miss nuanced legal issues
- Results depend on contract clarity and formatting
- Accuracy varies based on contract complexity

## Future Enhancements

- [ ] PDF upload support with text extraction
- [ ] Contract comparison (side-by-side analysis)
- [ ] Export analysis reports to PDF
- [ ] Clause library and templates
- [ ] Multi-language support
- [ ] Integration with legal databases
- [ ] Contract version tracking
- [ ] Collaborative review features

## Gatewayz API Integration

This application uses the Gatewayz AI API, which provides:
- Access to multiple AI models through a single API
- OpenAI GPT-4 for high-quality legal analysis
- Reliable and fast inference
- Cost-effective pricing

API Documentation: https://api.gatewayz.ai

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts        # Contract analysis endpoint
│   │   │   └── question/
│   │   │       └── route.ts        # Q&A endpoint
│   │   ├── page.tsx                # Main UI component
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles
│   └── components/
│       └── ui/                     # UI component library
├── .env                            # Environment variables
└── package.json                    # Dependencies
```

## Support & Contribution

For issues, questions, or contributions, please refer to the main project repository.

## License

This project is part of a demo application showcasing AI-powered legal document analysis.

---

**Built with ❤️ using Next.js and Gatewayz AI**
