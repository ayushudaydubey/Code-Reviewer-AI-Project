import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { autocompletion } from '@codemirror/autocomplete'; // For autocompletion
import ReactMarkdown from 'react-markdown'; // Already imported for review section

const Project = () => {
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [variables, setVariables] = useState([]);
  const [review, setReview] = useState('');

  // Map languages to their CodeMirror language extensions
  const languageExtensions = {
    javascript: [javascript({ jsx: true }), autocompletion()],
    html: [html(), autocompletion()],
    css: [css(), autocompletion()],
    python: [python(), autocompletion()],
    java: [java(), autocompletion()],
    cpp: [cpp(), autocompletion()], // Covers both C++ and C
    c: [cpp(), autocompletion()],
  };

  function handleUserMsg() {
    if (input.trim()) {
      setMessages((prev) => [...prev, input]);
      if (socket) {
        socket.emit("chat-message", input);
      }
      setInput("");
    }
  }

  // Extract variables from code
  useEffect(() => {
    if (language === 'javascript') {
      const varRegex = /(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*([^;]*);/g;
      const foundVariables = [];
      let match;

      while ((match = varRegex.exec(code)) !== null) {
        foundVariables.push({
          name: match[1],
          value: match[2].trim(),
        });
      }

      setVariables(foundVariables);
    }
  }, [code, language]);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000", {
      query: {
        project: params.id,
      },
    });

    socketInstance.emit("chat-history");

    socketInstance.on("chat-history", (history) => {
      setMessages(history.map((msg) => msg.text));
    });

    socketInstance.on("chat-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on("code-update", (codeData) => {
      setCode(codeData.code);
      setLanguage(codeData.language || 'javascript');
    });

    socketInstance.on("code-change", (code) => {
      setCode(code);
    });

    socketInstance.on("project-code", (code) => {
      setCode(code);
    });

    socketInstance.emit("get-project-code");

    setSocket(socketInstance);

    socketInstance.on("get-review", (reviewData) => {
      // console.log(reviewData);
      setReview(reviewData); // Store review data in state
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [params.id]);

  function handleGetReview() {
    if (socket) {
      socket.emit("get-review", code);
    }
  }

  const handleCodeChange = (value) => {
    setCode(value);
    if (socket) {
      socket.emit("code-change", value);
      socket.emit("code-update", { code: value, language });
    }
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    if (socket) {
      socket.emit("code-update", { code, language: newLanguage });
    }
  };

  // Function to convert non-string review data to Markdown
  const formatReviewAsMarkdown = (reviewData) => {
    if (typeof reviewData === 'string') {
      return reviewData; // If it's already a string, assume it's Markdown
    } else if (Array.isArray(reviewData)) {
      // Convert array to Markdown list
      return reviewData.map((item) => `- ${typeof item === 'string' ? item : JSON.stringify(item)}`).join('\n');
    } else if (typeof reviewData === 'object' && reviewData !== null) {
      // Convert object to Markdown
      return Object.entries(reviewData)
        .map(([key, value]) => `**${key}**: ${typeof value === 'string' ? value : JSON.stringify(value)}`)
        .join('\n\n');
    }
    return String(reviewData); // Fallback for other types
  };

  return (
    <main className="box-border">
      <section className="flex items-start justify-between gap-4 px-4 py-4">
        <div className="chat h-[95vh] w-full bg-teal-800 relative rounded-md overflow-hidden flex flex-col">
          <div className="messages-area flex-1 flex flex-col overflow-y-auto px-4 pt-4 pb-20 text-white font-semibold text-md space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className="message self-start inline-block px-4 py-2 bg-teal-950 rounded-xl">
                <span>{msg}</span>
              </div>
            ))}
          </div>
          <div className="input-area absolute left-0 right-0 bottom-0 p-4 bg-teal-950 flex items-center gap-4">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className="flex-grow px-4 py-2 rounded outline-none bg-white text-black placeholder-gray-500"
              type="text"
              placeholder="Type Message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUserMsg();
                }
              }}
            />
            <button onClick={handleUserMsg} className="text-white text-xl">
              <i className="ri-send-plane-2-line text-teal-950  font-bold bg-white p-3 rounded-full"></i>
            </button>
          </div>
        </div>

        <div className="code h-[95vh] w-full bg-zinc-800 rounded-md flex flex-col overflow-hidden">
          <div className="editor-header bg-zinc-900 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">Editor</span>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-zinc-700 text-white border-none rounded px-2 py-1 text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>
            </div>
          </div>

          <div className="editor-container flex-grow overflow-hidden">
            <CodeMirror
              value={code}
              height="100%" // Use full remaining height after the header
              theme={vscodeDark}
              extensions={languageExtensions[language] || []}
              onChange={handleCodeChange}
              className="h-full"
              basicSetup={{
                autocompletion: true, // Enable autocompletion
                bracketMatching: true,
                indentOnInput: true,
                syntaxHighlighting: true,
              }}
            />
          </div>
        </div>

        <div className="review h-[95vh] w-full bg-zinc-800 rounded-md flex flex-col px-4 py-2 relative">
          <button
            className="bg-zinc-950 absolute border-[1px] border-white rounded right-5 top-5 text-md font-medium rounded-xl text-white px-2 py-1 inline-block"
            onClick={handleGetReview}
          >
            Get review
          </button>

          {/* Display review content in Markdown */}
          <div className="mt-16 text-blue-50 text-md overflow-y-auto leading-normal flex-1">
            {review ? (
              <div className="bg-zinc-900 px-4 py-3 rounded-md">
                <ReactMarkdown>{formatReviewAsMarkdown(review)}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-300">Click "Get review" to see code review</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Project;