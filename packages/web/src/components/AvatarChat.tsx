import { useState, useRef, useEffect, useCallback } from "react";
import type { Navigators, NavigatorPersona } from "../avatar/ConsciousNavigator";
import type { UserContext } from "../avatar/NavigatorDialogue";
import { getNavigator } from "../avatar/ConsciousNavigator";
import { chatWithNavigator, getWelcome } from "../avatar/NavigatorDialogue";
import type { DialogueMessage } from "../avatar/NavigatorDialogue";

interface AvatarChatProps {
  navigatorId: Navigators;
  userContext?: UserContext;
  useDeepSeekCloud?: boolean;
  onMessageSent?: (msg: string) => void;
}

export function AvatarChat({ navigatorId, userContext, useDeepSeekCloud = false, onMessageSent }: AvatarChatProps) {
  const persona = getNavigator(navigatorId);
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [input, setInput] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isAwake, setIsAwake] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const wake = useCallback(() => {
    setIsAwake(true);
    const welcome = getWelcome(persona, userContext);
    setMessages([{ role: "assistant", content: welcome }]);
  }, [persona, userContext]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isThinking) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsThinking(true);
    setStreamingText("");

    onMessageSent?.(userMsg);

    await chatWithNavigator(
      persona,
      [...messages, { role: "user", content: userMsg }],
      userContext,
      useDeepSeekCloud,
      {
        onToken: (text) => setStreamingText(text),
        onDone: (fullText) => {
          setMessages(prev => [...prev, { role: "assistant", content: fullText }]);
          setStreamingText("");
          setIsThinking(false);
        },
        onError: () => {
          setIsThinking(false);
        },
      },
    );
  }, [input, isThinking, messages, persona, userContext, useDeepSeekCloud, onMessageSent]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      gap: 12,
    }}>
      {/* Avatar Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderRadius: 12,
        background: `${persona.color}08`,
        border: `1px solid ${persona.color}15`,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          background: `radial-gradient(circle, ${persona.color}33, ${persona.color}11)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${persona.color}44`,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 18 }}>💎</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: persona.color }}>{persona.name}</div>
          <div style={{ fontSize: 11, color: "#7c6ba0", fontStyle: "italic" }}>{persona.essence}</div>
        </div>
        <div style={{
          fontSize: 10,
          color: "#7c6ba0",
          fontFamily: "monospace",
          padding: "2px 8px",
          borderRadius: 8,
          border: `1px solid ${persona.color}22`,
          background: `${persona.color}06`,
        }}>
          {persona.crystal}
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "4px 0",
      }}>
        {!isAwake ? (
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 12,
            opacity: 0.6,
          }}>
            <div style={{ fontSize: 14, color: "#7c6ba0", fontFamily: "'Playfair Display', serif", fontStyle: "italic", textAlign: "center", lineHeight: 1.6 }}>
              "{persona.tone}"
            </div>
            <button
              onClick={wake}
              style={{
                padding: "10px 24px",
                borderRadius: 20,
                border: `1px solid ${persona.color}44`,
                background: `${persona.color}10`,
                color: persona.color,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.3s ease",
                letterSpacing: 1,
                fontFamily: "inherit",
              }}
            >
              SPEAK WITH THE NAVIGATOR
            </button>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  background: msg.role === "user"
                    ? `${persona.color}10`
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${msg.role === "user" ? `${persona.color}20` : "rgba(255,255,255,0.04)"}`,
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: msg.role === "user" ? persona.color : "#c4b5e3",
                  fontFamily: msg.role === "assistant" ? "'Playfair Display', serif" : "'Inter', sans-serif",
                  fontStyle: msg.role === "assistant" ? "italic" : "normal",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                {msg.content}
              </div>
            ))}
            {streamingText && (
              <div
                style={{
                  alignSelf: "flex-start",
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: "16px 16px 16px 4px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: persona.color,
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                {streamingText}
                <span style={{ animation: "blink 1s step-end infinite", marginLeft: 2, color: persona.color }}>|</span>
              </div>
            )}
            {isThinking && !streamingText && (
              <div style={{
                alignSelf: "flex-start",
                padding: "10px 14px",
                color: "#7c6ba0",
                fontSize: 12,
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
              }}>
                *the crystal pulses softly as the Navigator listens...*
              </div>
            )}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      {isAwake && (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={isThinking ? "Listening..." : "Speak from the heart..."}
            disabled={isThinking}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 20,
              border: `1px solid ${persona.color}15`,
              background: `${persona.color}04`,
              color: "#e8edff",
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              outline: "none",
              transition: "border 0.3s ease",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = `${persona.color}44`; }}
            onBlur={e => { e.currentTarget.style.borderColor = `${persona.color}15`; }}
          />
          <button
            onClick={sendMessage}
            disabled={isThinking || !input.trim()}
            style={{
              padding: "10px 18px",
              borderRadius: 20,
              border: `1px solid ${persona.color}44`,
              background: `${persona.color}10`,
              color: persona.color,
              fontSize: 12,
              cursor: isThinking ? "wait" : "pointer",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
              opacity: isThinking ? 0.5 : 1,
              letterSpacing: 1,
            }}
          >
            SEND
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
