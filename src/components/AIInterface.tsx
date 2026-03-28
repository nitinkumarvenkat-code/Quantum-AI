import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  Zap, 
  Languages, 
  FileText, 
  Code, 
  Palette, 
  Brain,
  Loader2,
  User,
  Bot,
  Trash2,
  Image as ImageIcon,
  RefreshCcw
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from '@google/genai';
import { cn } from '@/src/lib/utils';

import { Logo, LogoText, VoiceRecognition } from './Logo';

type Mode = 'chat' | 'flash' | 'translator' | 'document' | 'code' | 'creative' | 'knowledge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image';
  imageData?: string;
}

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const AIInterface = ({ mode, initialInput = "" }: { mode: Mode, initialInput?: string }) => {
  const [input, setInput] = useState(initialInput);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialInput) {
      handleSend(initialInput);
    }
  }, [initialInput]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getSystemInstruction = (currentMode: Mode, currentInput: string) => {
    let baseInstruction = "You are Quantum AI, a premium futuristic AI system owned by Nitin. Maintain a high-tech, intelligent, and helpful persona. Use technical terminology where appropriate but remain accessible.";
    
    switch (currentMode) {
      case 'flash':
        baseInstruction += " You are currently in FLASH MODE. Your primary directive is speed. Provide ultra-concise, one-line responses. No conversational filler. Just the direct answer.";
        break;
      case 'translator':
        baseInstruction += " You are currently in TRANSLATOR MODE. Your primary directive is linguistic accuracy. Detect the input language and translate it to the target language requested. If no target is specified, assume English. Provide the translation and, if helpful, a brief pronunciation guide.";
        break;
      case 'document':
        baseInstruction += " You are currently in DOCUMENT ASSISTANT MODE. Your primary directive is text optimization. Help the user summarize, rewrite, expand, or analyze documents. Use structured formatting (bullet points, bold text) to make information scannable.";
        break;
      case 'code':
        baseInstruction += " You are currently in CODE ASSISTANT MODE. Your primary directive is technical precision. Generate, debug, and explain code with absolute accuracy. Always use markdown code blocks with the correct language identifier. Provide brief explanations for complex logic.";
        break;
      case 'creative':
        baseInstruction += " You are currently in CREATIVE GENERATOR MODE. Your primary directive is visual and conceptual inspiration. Help with logos, branding, and creative content. If asked to 'generate' or 'draw', describe the visual output vividly. You have access to a neural image generator.";
        if (currentInput.toLowerCase().includes('logo') || currentInput.toLowerCase().includes('branding')) {
          baseInstruction += " Since this is a branding request, suggest specific color hex codes and font styles that match the user's vision.";
        }
        break;
      case 'knowledge':
        baseInstruction += " You are currently in KNOWLEDGE ENGINE MODE. Your primary directive is educational depth. Explain complex scientific, historical, or technical topics with clarity. Use analogies to simplify difficult concepts and provide a 'Deep Dive' section for further learning.";
        break;
      case 'chat':
        baseInstruction += " You are currently in REAL-TIME CHAT MODE. Your primary directive is versatile conversation. Be a deep-thinking companion, capable of discussing any topic with nuance and foresight.";
        break;
    }
    return baseInstruction;
  };

  const handleCreateVariations = async (base64Image: string) => {
    if (isLoading) return;
    
    setMessages(prev => [...prev, { role: 'user', content: "Create variations of this image." }]);
    setIsLoading(true);

    try {
      // Strip prefix if present
      const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
      
      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/png"
              }
            },
            { text: "Create a variation of this image while keeping the core concept and style." }
          ]
        },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          setMessages(prev => [...prev, { role: 'assistant', content: 'Here is a variation based on your image:', type: 'image', imageData: imageUrl }]);
          foundImage = true;
          break;
        }
      }
      if (!foundImage) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I couldn't generate a variation, but I can try again if you'd like!" }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error generating variations. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const currentInput = overrideInput || input;
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: currentInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput(''); // Always clear input after sending
    setIsLoading(true);

    try {
      if (mode === 'creative' && (currentInput.toLowerCase().includes('generate') || currentInput.toLowerCase().includes('image') || currentInput.toLowerCase().includes('draw'))) {
        // Image generation logic
        const response = await genAI.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: currentInput }] },
          config: { imageConfig: { aspectRatio: "1:1" } }
        });

        let foundImage = false;
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            setMessages(prev => [...prev, { role: 'assistant', content: 'Here is your generated image:', type: 'image', imageData: imageUrl }]);
            foundImage = true;
            break;
          }
        }
        if (!foundImage) {
          setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I couldn't generate the image, but I can help with ideas!" }]);
        }
      } else {
        // Standard text generation with history
        const chat = genAI.chats.create({
          model: mode === 'flash' ? 'gemini-3-flash-preview' : 'gemini-3.1-pro-preview',
          config: {
            systemInstruction: getSystemInstruction(mode, currentInput),
          },
          history: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          }))
        });

        const response = await chat.sendMessage({ message: currentInput });
        setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I'm sorry, I couldn't process that." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to Quantum Neural Network. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto glass-card overflow-hidden border-white/5">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-quantum-purple/20">
            {mode === 'chat' && <Sparkles size={20} className="text-quantum-purple" />}
            {mode === 'flash' && <Zap size={20} className="text-yellow-400" />}
            {mode === 'translator' && <Languages size={20} className="text-blue-400" />}
            {mode === 'document' && <FileText size={20} className="text-emerald-400" />}
            {mode === 'code' && <Code size={20} className="text-orange-400" />}
            {mode === 'creative' && <Palette size={20} className="text-pink-400" />}
            {mode === 'knowledge' && <Brain size={20} className="text-cyan-400" />}
          </div>
          <div>
            <h2 className="font-display font-bold text-lg capitalize">{mode} Mode</h2>
            <p className="text-xs text-white/40">Quantum Neural Link Active</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-red-400"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative"
      >
        {/* Neural Stream Background Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
          <motion.div 
            animate={{ y: ["0%", "-100%"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-full h-[200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"
          />
        </div>

        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 relative z-10">
            <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center relative">
              <Bot size={32} />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border-t border-quantum-purple/40 rounded-full"
              />
            </div>
            <div>
              <p className="font-display text-xl tracking-tight">Initialize Neural Stream</p>
              <p className="text-xs font-mono text-white/40">Awaiting user input for {mode} processing...</p>
            </div>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-4 relative z-10",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10",
                msg.role === 'user' ? "bg-quantum-blue/20 text-quantum-blue" : "bg-quantum-purple/20 text-quantum-purple"
              )}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed relative overflow-hidden",
                msg.role === 'user' 
                  ? "bg-quantum-blue/10 border border-quantum-blue/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                  : "bg-white/5 border border-white/10 text-white/90 shadow-[0_0_15px_rgba(168,85,247,0.05)]"
              )}>
                {/* Data Packet Corner Details */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />

                {msg.type === 'image' ? (
                  <div className="space-y-3">
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Visual Data Packet Received</p>
                    <div className="relative group/img">
                      <img src={msg.imageData} alt="Generated" className="rounded-lg w-full max-w-sm border border-white/10" referrerPolicy="no-referrer" />
                      {mode === 'creative' && msg.role === 'assistant' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg">
                          <button
                            onClick={() => handleCreateVariations(msg.imageData!)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-quantum-purple text-white rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed font-display font-bold text-xs uppercase tracking-wider"
                          >
                            <RefreshCcw size={14} className={cn(isLoading && "animate-spin")} />
                            Create Variations
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="markdown-body prose prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-quantum-purple/20 text-quantum-purple flex items-center justify-center">
              <Loader2 size={18} className="animate-spin" />
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="flex gap-1">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-quantum-purple rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-quantum-purple rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-quantum-purple rounded-full" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white/5 border-t border-white/10">
        <div className="flex items-end gap-4">
          <div className="flex-1 relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                mode === 'creative' ? "Describe an image to generate or ask for ideas..." :
                mode === 'translator' ? "Enter text to translate..." :
                mode === 'code' ? "Describe code to generate or paste to debug..." :
                "Type your message..."
              }
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pr-14 text-sm focus:outline-none focus:border-quantum-purple/50 transition-all resize-none min-h-[60px] max-h-[200px]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-3 bottom-3 p-2 rounded-xl transition-all",
                input.trim() && !isLoading 
                  ? "bg-quantum-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:scale-110" 
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              )}
            >
              <Send size={18} />
            </button>
          </div>
          <div className="mb-1">
            <VoiceRecognition onResult={(text) => handleSend(text)} />
          </div>
        </div>
        <p className="text-[10px] text-center mt-3 text-white/20 uppercase tracking-widest">
          Quantum Processing Unit v2.5 • Encrypted Stream
        </p>
      </div>
    </div>
  );
};
