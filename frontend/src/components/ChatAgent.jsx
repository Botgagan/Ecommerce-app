import { useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { FiMessageSquare, FiSend } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';
import ReactMarkdown from 'react-markdown';

export default function ChatAgent() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token, backendUrl } = useContext(ShopContext);

  const initialMessage = {
    role: 'assistant',
    content: '👋 Hey! I’m 🤖 izzi, your personal ecommerce chatbot. How can I help you today?'
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post(backendUrl + '/api/chat', { message: input }, {
        headers: { token }
      });

      const reply = res.data?.reply || '🤖 Assistant could not respond.';
      const aiMessage = { role: 'assistant', content: reply };
      setMessages((prev) => [...prev, aiMessage]);
      setInput('');
    } catch (err) {
      console.error('Chat error:', err.message);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: '🚧 Chat assistant is currently unavailable.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 📌 Floating Button */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          onClick={() => {
            setMessages([initialMessage]); // 👋 izzi greeting
            setOpen(true);
          }}
        >
          <FiMessageSquare size={24} />
        </button>
      )}

      {/* 💬 Chat Popup */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 max-w-full bg-white shadow-xl rounded-lg border flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <span>Chat Assistant</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Chat Feed */}
          <div className="p-3 space-y-2 overflow-y-auto h-72 border-b bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md whitespace-pre-wrap text-sm ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
                  }`}
              >
                <ReactMarkdown >{msg.content}</ReactMarkdown>
              </div>
            ))}
            {loading && (
              <div className="text-center py-2 text-blue-500">
                <ImSpinner2 className="animate-spin inline mr-2" />
                Thinking...
              </div>
            )}
          </div>


          {/* Input */}
          <div className="flex p-2 gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded p-2 text-sm"
              placeholder="Ask me anything..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? <ImSpinner2 className="animate-spin" /> : <FiSend />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}