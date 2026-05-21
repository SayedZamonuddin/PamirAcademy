import { useState, useRef, useEffect } from "react";
import StudentLayout from "./StudentLayout";
import { getContacts, getConversation, sendMessage as apiSendMessage } from "../../../utils/panelApi";

/* ---- SVG Icons ---- */
const SendIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#006236">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const AttachIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006236" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);
const EmojiIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006236" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

export default function StudentMessages() {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getContacts();
        setContacts(data);
        if (data.length > 0) setActiveContact(data[0].id);
      } catch (err) { console.error("Failed to load contacts:", err); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!activeContact) return;
    (async () => {
      try {
        const data = await getConversation(activeContact);
        setMessages(data);
      } catch (err) { console.error("Failed to load conversation:", err); }
    })();
  }, [activeContact]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  const contact = contacts.find(c => c.id === activeContact);

  const filteredContacts = contacts.filter(c =>
    c.display_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSend = async () => {
    if (!inputText.trim() || !activeContact) return;
    const text = inputText.trim();
    setInputText("");
    // Optimistic add
    const tempMsg = { id: Date.now(), sender_name: "You", text, is_mine: true, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, tempMsg]);
    try {
      await apiSendMessage(activeContact, text);
      // Refresh conversation to get server state
      const data = await getConversation(activeContact);
      setMessages(data);
    } catch { /* API may be offline */ }
  };

  function formatTime(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (loading) {
    return (
      <StudentLayout activePage="s-messages">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#006236] border-t-transparent rounded-full animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout activePage="s-messages">
      <div className="flex-1 flex overflow-hidden">
        {/* ---- Contacts Sidebar ---- */}
        <div className="w-[clamp(250px,26vw,340px)] bg-[#eef1ef] flex flex-col border-r-2 border-[#006236]/15 shrink-0">
          <div className="px-4 py-4 border-b-2 border-[#006236]/15">
            <h2 className="text-[#006236] text-lg font-bold m-0 mb-3">Messages</h2>
            <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 border border-[#006236]/20">
              <span className="text-[#006236]/50"><SearchIcon /></span>
              <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)}
                placeholder="Search contacts..."
                className="flex-1 border-none outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(c => {
              const isActive = activeContact === c.id;
              return (
                <div key={c.id} onClick={() => setActiveContact(c.id)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-[#006236]/8 ${
                    isActive ? "bg-[#006236]/10" : "hover:bg-[#006236]/5"
                  }`}>
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#006236]/30 flex items-center justify-center bg-[#006236]/10">
                      <span className="text-[#006236] font-bold text-sm">{c.display_name.split(" ").map(w => w[0]).join("")}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold text-sm truncate ${isActive ? "text-[#006236]" : "text-gray-700"}`}>{c.display_name}</span>
                      <span className="text-gray-400 text-[10px] shrink-0 ml-1">{c.last_message_time ? formatTime(c.last_message_time) : ""}</span>
                    </div>
                    <p className="text-gray-500 text-xs truncate m-0 mt-0.5">{c.last_message}</p>
                  </div>
                  {c.unread_count > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#006236] text-white text-[10px] flex items-center justify-center font-bold shrink-0">{c.unread_count}</span>
                  )}
                </div>
              );
            })}
            {filteredContacts.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">No contacts found.</p>
            )}
          </div>
        </div>

        {/* ---- Chat Area ---- */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#f4f6f5]">
          {contact && (
            <div className="px-5 py-3 bg-[#006236]/5 border-b border-[#006236]/15 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#006236]/30 flex items-center justify-center bg-[#006236]/10">
                <span className="text-[#006236] font-bold text-sm">{contact.display_name.split(" ").map(w => w[0]).join("")}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-[#006236] font-bold text-sm m-0">{contact.display_name}</h3>
                <p className="text-gray-500 text-xs m-0">{contact.role}</p>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.is_mine ? "justify-end" : "justify-start"}`}>
                {!msg.is_mine && (
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mr-2 mt-auto mb-1 border border-[#006236]/20">
                    <div className="w-full h-full bg-[#006236]/10 flex items-center justify-center text-[#006236] text-[10px] font-bold">
                      {contact?.display_name?.charAt(0) || "?"}
                    </div>
                  </div>
                )}
                <div className="flex flex-col max-w-[65%]">
                  <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                    msg.is_mine
                      ? "bg-[#006236] text-white rounded-[18px_18px_4px_18px]"
                      : "bg-[#dce0de] text-gray-800 rounded-[18px_18px_18px_4px]"
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`text-[10px] text-gray-400 mt-1 ${msg.is_mine ? "text-right" : "text-left ml-1"}`}>{formatTime(msg.created_at)}</span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="px-4 py-3 bg-[#eef1ef] border-t border-[#006236]/15 shrink-0">
            <div className="flex items-center gap-2 bg-white rounded-full py-2 pr-3 pl-4 border border-[#006236]/20">
              <button className="bg-transparent border-none cursor-pointer flex items-center p-1"><EmojiIcon /></button>
              <button className="bg-transparent border-none cursor-pointer flex items-center p-1"><AttachIcon /></button>
              <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
                placeholder="Type a message..."
                className="flex-1 border-none outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400" />
              <button onClick={handleSend} className="bg-transparent border-none cursor-pointer flex items-center p-1"><SendIcon /></button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
