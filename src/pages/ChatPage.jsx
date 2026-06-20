import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useParams } from 'react-router-dom';

export const ChatPage = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const sendMessage = () => {
    if (!text) return;

    setMessages([
      ...messages,
      {
        sender: 'me',
        text,
      },
    ]);

    setText('');
  };

    return (
    <div className="min-h-screen bg-[#f6f7fb] flex flex-col">
        <Navbar />

        {/* Container */}
        <div className="flex-1 max-w-3xl w-full mx-auto flex flex-col p-4">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {id?.slice(0, 2).toUpperCase()}
            </div>

            <div>
                <h1 className="font-bold text-slate-800 text-lg">
                Chat
                </h1>
                <p className="text-xs text-slate-500">
                User ID: {id}
                </p>
            </div>
            </div>

            <div className="text-xs text-slate-400">
            Online
            </div>
        </div>

        {/* Messages Box */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 overflow-y-auto space-y-3">

            {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Start your conversation 👋
            </div>
            )}

            {messages.map((msg, i) => {
            const isMe = msg.sender === 'me';

            return (
                <div
                key={i}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                <div
                    className={`
                    max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                    shadow-sm
                    ${isMe
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-800 rounded-bl-md'
                    }
                    `}
                >
                    {msg.text}
                </div>
                </div>
            );
            })}
        </div>

        {/* Input Section (Fixed Feel) */}
        <div className="mt-4 bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center gap-2">

            <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 text-sm outline-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-primary/30"
            />

            <button
            onClick={sendMessage}
            className="bg-primary hover:bg-secondary transition text-white px-5 py-3 rounded-xl font-semibold"
            >
            Send
            </button>
        </div>
        </div>
    </div>
    );
};