# Contract Companion - Quick Start Guide

## 🚀 Getting Started in 3 Minutes

### Step 1: Configure API Key
1. Open the `.env` file in the root directory
2. Replace `your_api_key_here` with your actual Gatewayz API key:
   ```
   GATEWAYZ_API_KEY=gw_your_actual_api_key
   ```
3. If you don't have an API key, get one at: https://api.gatewayz.ai

### Step 2: Install Dependencies
```bash
# Using npm
npm install

# Using bun (faster)
bun install
```

### Step 3: Run the Application
```bash
# Development mode
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Test the Application

### Option 1: Use the Sample Contract
1. Open `public/sample-contract.txt`
2. Copy the entire content
3. Paste it into the Contract Input text area
4. Click "Analyze Contract"

### Option 2: Test with Your Own Contract
1. Click "Choose File" and upload a .txt file
   - OR paste your contract text directly
2. Click "Analyze Contract"
3. Wait for the AI analysis to complete
4. Explore the three tabs:
   - **Summary**: Plain-English overview
   - **Concerns**: Risk assessment
   - **Key Terms**: Legal terminology explained

### Option 3: Ask Questions
1. After analyzing a contract, scroll to the Q&A section
2. Try these example questions:
   - "What is the liability cap?"
   - "Who can terminate this agreement?"
   - "What are the payment terms?"
   - "Are there any automatic renewal clauses?"
   - "What happens if payment is late?"

## 📋 Expected Results

### Summary Output
You should see a 2-3 paragraph summary explaining:
- The type of agreement
- Key parties involved
- Main obligations and terms
- Duration and renewal conditions

### Concerns Output
Cards displaying potential risks such as:
- **High Severity**: One-sided indemnification favoring vendor
- **High Severity**: Broad limitation of liability
- **Medium Severity**: Automatic renewal with long notice period
- **Low Severity**: Limited support commitments

### Key Terms Output
Explanations of legal terms like:
- **Indemnification**: Who pays for legal claims
- **Force Majeure**: Exceptions for uncontrollable events
- **Governing Law**: Which state's laws apply

## 🔧 Troubleshooting

### "API key not configured" Error
- Check that `.env` file exists in root directory
- Verify `GATEWAYZ_API_KEY` is set correctly
- Restart the development server after changing `.env`

### "Failed to analyze contract" Error
- Verify your Gatewayz API key is valid
- Check your internet connection
- Try with a shorter contract (< 10,000 characters)
- Check browser console for detailed error messages

### UI Components Not Displaying Correctly
- Clear your browser cache
- Run `npm install` or `bun install` again
- Check that all dependencies installed successfully

### File Upload Not Working
- Only .txt files work directly
- For PDF files, copy/paste the text manually
- Ensure file size is reasonable (< 1MB)

## 📊 Performance Tips

1. **Faster Analysis**: Use shorter contracts for quicker results
2. **Better Results**: Provide well-formatted, clean text
3. **Specific Questions**: Ask focused questions for accurate answers
4. **Context Retention**: Use follow-up questions in the same session

## 🎯 What to Look For

### In the Summary
- ✅ Clear explanation of agreement type
- ✅ Identification of key parties
- ✅ Outline of main terms and conditions
- ✅ Highlighting of important deadlines or dates

### In the Concerns
- ✅ Severity ratings (high/medium/low)
- ✅ Specific clause references
- ✅ Explanation of why it's concerning
- ✅ Impact assessment

### In Q&A
- ✅ Direct answers to your questions
- ✅ Citations from the contract
- ✅ Plain-English explanations
- ✅ Identification of ambiguities

## 🏗️ Project Structure Overview

```
contract-companion/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts    # Analysis endpoint
│   │   │   └── question/route.ts   # Q&A endpoint
│   │   └── page.tsx                # Main UI
│   ├── components/ui/              # UI component library
│   └── lib/
│       └── types.ts                # TypeScript definitions
├── public/
│   └── sample-contract.txt         # Test contract
├── .env                            # API configuration
└── package.json                    # Dependencies
```

## 📚 Next Steps

After testing the application:

1. **Read the Full Documentation**: Check `CONTRACT_COMPANION_README.md`
2. **Explore the Code**:
   - `src/app/page.tsx` - Main UI component
   - `src/app/api/analyze/route.ts` - Analysis logic
   - `src/app/api/question/route.ts` - Q&A logic
3. **Customize**:
   - Modify prompts in API routes
   - Adjust UI styling in `page.tsx`
   - Add new features or analysis types
4. **Deploy**: Build for production with `npm run build`

## 🆘 Need Help?

- Check the full README: `CONTRACT_COMPANION_README.md`
- Review the API documentation: https://api.gatewayz.ai
- Inspect browser console for errors
- Check server logs in terminal

## ✅ Success Checklist

- [ ] `.env` file configured with valid API key
- [ ] Dependencies installed successfully
- [ ] Development server running on http://localhost:3000
- [ ] Sample contract analyzed successfully
- [ ] All three tabs showing results (Summary, Concerns, Terms)
- [ ] Q&A section responding to questions
- [ ] No errors in browser console or terminal

---

**You're ready to analyze contracts with AI! 🎉**
