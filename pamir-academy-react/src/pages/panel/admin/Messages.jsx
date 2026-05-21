import { useState, useEffect, useRef } from "react";
import DashboardLayout from "./DashboardLayout";
import { getContacts, getConversation, sendMessage as apiSendMessage } from "../../../utils/panelApi";

const SendIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#006236"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
);

export default function Messages() {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
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
  }, [messages]);

  const contact = contacts.find(c => c.id === activeContact);

  const handleSend = async () => {
    if (!inputText.trim() || !activeContact) return;
    const text = inputText.trim();
    setInputText("");
    const tempMsg = { id: Date.now(), text, is_mine: true, created_at: new Date().toISOString(), sender_name: "Admin" };
    setMessages(prev => [...prev, tempMsg]);
    try {
      await apiSendMessage(activeContact, text);
      const data = await getConversation(activeContact);
      setMessages(data);
    } catch { /* API may be offline */ }
  };

  if (loading) {
    return (
      <DashboardLayout activePage="messages">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#006236] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="messages">
      <div className="flex-1 flex overflow-hidden">
        {/* Contacts sidebar */}
        <div className="w-[clamp(200px,22vw,300px)] bg-white border-r-2 border-[#006236]/15 flex flex-col shrink-0">
          <div className="px-4 py-4 border-b-2 border-[#006236]/15">
            <h2 className="text-[#006236] text-lg font-bold m-0">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map(c => (
              <div key={c.id} onClick={() => setActiveContact(c.id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[#006236]/10 transition-colors ${
                  activeContact === c.id ? "bg-[#006236]/10" : "hover:bg-[#006236]/5"
                }`}>
                <div className="w-10 h-10 rounded-full bg-[#006236]/10 flex items-center justify-center text-[#006236] font-bold text-sm shrink-0">
                  {c.display_name.split(" ").map(w => w[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[#006236] font-semibold text-sm block truncate">{c.display_name}</span>
                  <p className="text-gray-500 text-xs truncate m-0">{c.last_message}</p>
                </div>
                {c.unread_count > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#006236] text-white text-[10px] flex items-center justify-center font-bold shrink-0">{c.unread_count}</span>
                )}
              </div>
            ))}
            {contacts.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">No contacts.</p>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {contact && (
            <div className="px-5 py-3 bg-[#006236]/5 border-b border-[#006236]/15 shrink-0">
              <h3 className="text-[#006236] font-bold text-sm m-0">{contact.display_name}</h3>
              <p className="text-gray-500 text-xs m-0">{contact.role}</p>
            </div>
          )}

          <div className="flex-1 bg-[#f4f6f5] p-[clamp(16px,2vw,32px)] flex flex-col gap-4 overflow-y-auto">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.is_mine ? "items-end" : "items-start"}`}>
                <span className="text-[#006236] text-[clamp(11px,1vw,14px)] mb-1">{msg.is_mine ? "You" : (msg.sender_name || "User")}</span>
                <div className={`${msg.is_mine ? "bg-[#006236]" : "bg-[#7d807f]"} text-white px-6 py-3 rounded-[30px] text-[clamp(14px,1.4vw,20px)] max-w-[70%]`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex items-center gap-3 px-5 py-3 bg-white border-t border-[#006236]/15 shrink-0">
            <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
              placeholder="Type a message..."
              className="flex-1 border border-[#006236]/15 rounded-full py-2 px-5 outline-none text-[clamp(14px,1.4vw,20px)] text-black"/>
            <button onClick={handleSend} className="bg-transparent border-none cursor-pointer flex items-center p-2"><SendIcon/></button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
