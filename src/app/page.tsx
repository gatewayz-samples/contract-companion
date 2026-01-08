'use client';

import { useState, useEffect } from 'react';
import { Upload, AlertTriangle, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnalysisResult {
  summary: string;
  concerns: Array<{ title: string; description: string; severity: 'high' | 'medium' | 'low' }>;
  keyTerms: Array<{ term: string; explanation: string }>;
}

interface Model {
  id: string;
  name: string;
  context_length?: number;
  pricing?: {
    prompt?: number;
    completion?: number;
  };
}

const CONTRACT_TEMPLATES = [
  { value: 'sample', label: 'Software License Agreement', file: '/sample-contract.txt' },
  { value: 'nda', label: 'Mutual Non-Disclosure Agreement', file: '/template-nda.txt' },
  { value: 'employment', label: 'Employment Agreement', file: '/template-employment.txt' },
];

export default function ContractCompanion() {
  const [contractText, setContractText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [questionLoading, setQuestionLoading]= useState(false);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o');
  const [models, setModels] = useState<Model[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'summary' | 'concerns' | 'terms'>('summary');

  useEffect(() => {
    if (modelDialogOpen && models.length === 0) {
      fetchModels();
    }
  }, [modelDialogOpen]);

  const fetchModels = async () => {
    setModelsLoading(true);
    try {
      const response = await fetch('/api/models?limit=100&gateway=all');
      const data = await response.json();

      if (Array.isArray(data)) {
        setModels(data);
      } else if (data.data && Array.isArray(data.data)) {
        setModels(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setModelsLoading(false);
    }
  };

  const loadTemplate = async (templateFile: string) => {
    try {
      const response = await fetch(templateFile);
      const text = await response.text();
      setContractText(text);
    } catch (error) {
      console.error('Failed to load template:', error);
      alert('Failed to load template contract');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      setContractText(text);
    }
  };

  const analyzeContract = async () => {
    if (!contractText.trim()) {
      alert('Please enter or upload a contract first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText, model: selectedModel }),
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim() || !contractText.trim()) {
      alert('Please enter both a contract and a question');
      return;
    }

    setQuestionLoading(true);
    const userMessage = { role: 'user' as const, content: question };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText, question, chatHistory, model: selectedModel }),
      });

      const data = await response.json();
      const assistantMessage = { role: 'assistant' as const, content: data.answer };
      setChatHistory((prev) => [...prev, assistantMessage]);
      setQuestion('');
    } catch (error) {
      console.error('Question error:', error);
      alert('Failed to get answer. Please try again.');
    } finally {
      setQuestionLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredModels = models.filter(model =>
    model.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-bborder-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Contract Companion</h1>
              <p className="text-sm text-gray-600 mt-1">AI-powered legal contract analysis</p>
            </div>

            <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-sm font-normal">
                  Model: {selectedModel.split('/')[1] || selectedModel}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Select Model</DialogTitle>
                </DialogHeader>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search models..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {modelsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="grid grid-cols-2 gap-3">
                      {filteredModels.map((model) => (
                        <button
                          key={model.id}
                          className={`text-left p-4 rounded-lg border transition-colors ${
                            selectedModel ===model.id
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                          onClick={() => {
                            setSelectedModel(model.id);
                            setModelDialogOpen(false);
                          }}
                        >
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {model.id}
                          </div>
                          {model.context_length && (
                            <div className="text-xs text-gray-500 mt-1">
                              {model.context_length.toLocaleString()} tokens
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {filteredModels.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No models found
                      </div>
                    )}
                  </ScrollArea>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Contract Input
              </label>

              <div className="space-y-3">
                <Select onValueChange={(value) => {
                  const template = CONTRACT_TEMPLATES.find(t => t.value === value);
                  if (template) loadTemplate(template.file);
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Load a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_TEMPLATES.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept=".txt,.doc,.docx,.pdf"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={() => setContractText('')}>
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>

                <Textarea
                  placeholder="Paste contract text here..."
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  className="min-h-[300px] font-mono text-xs resize-none"
                />

                <Button
                  onClick={analyzeContract}
                  disabled={loading || !contractText}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Contract'
                  )}
                </Button>
              </div>
            </div>

            {/* Inline Q&A */}
            {contractText && (
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ask a Question
                </label>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="What's the liability cap?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !questionLoading && askQuestion()}
                      disabled={!contractText}
                    />
                    <Button
                      onClick={askQuestion}
                      disabled={questionLoading || !question || !contractText}
                      variant="outline"
                    >
                      {questionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Ask'
                      )}
                    </Button>
                  </div>

                  {chatHistory.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4 space-y-3 max-h-[200px] overflow-y-auto">
                      {chatHistory.map((msg, idx) => (
                        <div key={idx} className="text-sm">
                          <div className={`font-medium mb-1 ${msg.role === 'user' ? 'text-gray-900' : 'text-indigo-600'}`}>
                            {msg.role === 'user' ? 'You' : 'AI'}
                          </div>
                          <div className="text-gray-700 leading-relaxed">{msg.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Analysis Results */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Analysis
</label>

            {!analysis && !loading && (
              <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
                <p className="text-sm text-gray-500">
                  Upload or paste a contract to see analysis
                </p>
              </div>
            )}

            {loading && (
              <div className="border border-gray-200 rounded-lg p-12 text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-gray-400" />
                <p className="text-sm text-gray-500">Analyzing contract...</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-4">
                {/* Tab Navigation */}
                <div className="flex gap-2 border-b border-gray-200">
                  <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'summary'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('summary')}
                  >
                    Summary
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'concerns'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('concerns')}
                  >
                    Concerns ({analysis.concerns.length})
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'terms'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('terms')}
                  >
                    Key Terms ({analysis.keyTerms.length})
                  </button>
                </div>

                {/* Tab Content */}
                <div className="border border-gray-200 rounded-lg">
                  <ScrollArea className="h-[600px] p-6">
                    {activeTab === 'summary' && (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-gray-700 leading-relaxed">{analysis.summary}</p>
                      </div>
                    )}

                    {activeTab === 'concerns' && (
                      <div className="space-y-4">
                        {analysis.concerns.map((concern, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <h4 className="font-medium text-sm text-gray-900">{concern.title}</h4>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getSeverityColor(concern.severity)}`}
                              >
                                {concern.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed pl-6">
                              {concern.description}
</p>
                          </div>
                        ))}
                        {analysis.concerns.length === 0 && (
                          <p className="text-center text-sm text-gray-500 py-8">
                            No major concerns identified
                          </p>
                        )}
                      </div>
                    )}

                    {activeTab === 'terms' && (
                      <div className="space-y-6">
                        {analysis.keyTerms.map((term, idx) => (
                          <div key={idx}>
                            <h4 className="font-medium text-sm text-gray-900 mb-1">{term.term}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{term.explanation}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
