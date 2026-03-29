import { useState, useRef, useEffect } from "react";
import StudentLayout from "./StudentLayout";
import { sendMessage as apiSendMessage } from "../../../utils/panelApi";

const TEACHER_AVATARS = [
  "https://images.unsplash.com/photo-1726618069974-c1d5d27f612b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGZlbWFsZSUyMHRlYWNoZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQwMDg2NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3Mzg3MzAwNXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1660128355607-2a311a8acfa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGdpcmwlMjBzdHVkeWluZyUyMG5vdGVib29rfGVufDF8fHx8MTc3NDAwODY0OHww&ixlib=rb-4.1.0&q=80&w=1080",
];

const CONTACTS = [
  { id: 1, name: "Amina Rahimi", role: "English Teacher", avatar: TEACHER_AVATARS[0], online: true, unread: 1, lastMsg: "Keep practicing the irregular verbs!", lastTime: "10:24 AM" },
  { id: 2, name: "Dariush Karimi", role: "Math Teacher", avatar: TEACHER_AVATARS[1], online: false, unread: 0, lastMsg: "Your homework was excellent.", lastTime: "Yesterday" },
  { id: 3, name: "Sarah Nazari", role: "Physics Teacher", avatar: TEACHER_AVATARS[2], online: true, unread: 0, lastMsg: "See you in class tomorrow!", lastTime: "Mar 18" },
  { id: 4, name: "Pamir Academy", role: "Admin Support", avatar: null, online: true, unread: 0, lastMsg: "Welcome to Pamir Academy!", lastTime: "Mar 15" },
];

const CONVERSATIONS = {
  1: [
    { id: 1, sender: "Amina Rahimi", text: "Good morning Ahmad! How are you today?", isStudent: false, time: "10:00 AM" },
    { id: 2, sender: "You", text: "Good morning teacher! I'm doing great. I practiced the exercises you gave.", isStudent: true, time: "10:05 AM" },
    { id: 3, sender: "Amina Rahimi", text: "Wonderful! How did you find the past simple exercises?", isStudent: false, time: "10:08 AM" },
    { id: 4, sender: "You", text: "The irregular verbs were a bit tricky but I managed most of them.", isStudent: true, time: "10:15 AM" },
    { id: 5, sender: "Amina Rahimi", text: "That's completely normal. We'll review them in our next session.", isStudent: false, time: "10:18 AM" },
    { id: 6, sender: "Amina Rahimi", text: "Keep practicing the irregular verbs!", isStudent: false, time: "10:24 AM" },
  ],
  2: [
    { id: 1, sender: "Dariush Karimi", text: "Hi Ahmad, I've reviewed your homework on quadratic equations.", isStudent: false, time: "3:00 PM" },
    { id: 2, sender: "You", text: "How did I do?", isStudent: true, time: "3:05 PM" },
    { id: 3, sender: "Dariush Karimi", text: "Your homework was excellent. Only one minor mistake in question 5.", isStudent: false, time: "3:10 PM" },
  ],
  3: [
    { id: 1, sender: "You", text: "Teacher, could you explain Newton's third law again?", isStudent: true, time: "2:00 PM" },
    { id: 2, sender: "Sarah Nazari", text: "Of course! Every action has an equal and opposite reaction. Think of it like pushing a wall — the wall pushes back equally.", isStudent: false, time: "2:15 PM" },
    { id: 3, sender: "Sarah Nazari", text: "See you in class tomorrow!", isStudent: false, time: "2:20 PM" },
  ],
  4: [
    { id: 1, sender: "Pamir Academy", text: "Welcome to Pamir Academy, Ahmad! We're glad to have you.", isStudent: false, time: "Mar 15" },
    { id: 2, sender: "Pamir Academy", text: "If you have any questions about the platform, feel free to ask here.", isStudent: false, time: "Mar 15" },
  ],
};

/* ---- SVG Icons ---- */
const SendIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#006236"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const AttachIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006236" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>;
const EmojiIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006236" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;

export default function StudentMessages() {
  const [activeContact, setActiveContact] = useState(1);
  const [messages, setMessages] = useState(CONVERSATIONS);
  const [inputText, setInputText] = useState("");
  const [searchText, setSearchText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  const activeConvo = messages[activeContact] || [];
  const contact = CONTACTS.find(c => c.id === activeContact);

  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg = { id: Date.now(), sender: "You", text: inputText.trim(), isStudent: true, time: timeStr };
    setMessages(prev => ({ ...prev, [activeContact]: [...(prev[activeContact] || []), newMsg] }));
    const text = inputText.trim();
    setInputText("");
    try { await apiSendMessage(activeContact, text); } catch { /* API may be offline */ }
  };

  return (
    <StudentLayout activePage="s-messages">
      <div className="flex-1 flex overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-[clamp(240px,25vw,340px)] bg-[#d9d9d9] flex flex-col border-r-2 border-[#006236]/15 shrink-0">
          <div className="px-4 py-4 border-b-2 border-[#006236]/15">
            <h2 className="text-[#006236] text-[clamp(18px,2vw,24px)] font-bold m-0 mb-3">Messages</h2>
            <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 border border-[#006236]/20">
              <span className="text-[#006236]/50"><SearchIcon/></span>
              <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)}
                placeholder="Search contacts..."
                className="flex-1 border-none outline-none bg-transparent text-sm text-black"/>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(c => (
              <div key={c.id} onClick={() => setActiveContact(c.id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-[#006236]/10 ${
                  activeContact === c.id ? "bg-[#006236]/15" : "hover:bg-[#006236]/5"
                }`}>
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#006236] flex items-center justify-center bg-[#006236]/15">
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.name} className="w-full h-full object-cover"/>
                    ) : (
                      <span className="text-[#006236] font-bold text-sm">{c.name.split(" ").map(w => w[0]).join("")}</span>
                    )}
                  </div>
                  {c.online && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#006236] border-2 border-[#d9d9d9]"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[#006236] font-semibold text-sm truncate">{c.name}</span>
                    <span className="text-gray-400 text-[10px] shrink-0 ml-1">{c.lastTime}</span>
                  </div>
                  <p className="text-gray-500 text-xs truncate m-0 mt-0.5">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#c51310] text-white text-[10px] flex items-center justify-center font-bold shrink-0">{c.unread}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {contact && (
            <div className="px-5 py-3 bg-[#006236]/5 border-b border-[#006236]/15 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#006236] flex items-center justify-center bg-[#006236]/15">
                  {contact.avatar ? (
                    <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover"/>
                  ) : (
                    <span className="text-[#006236] font-bold text-sm">{contact.name.split(" ").map(w => w[0]).join("")}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-[#006236] font-bold text-sm m-0">{contact.name}</h3>
                  <p className="text-gray-400 text-xs m-0 flex items-center gap-1">
                    {contact.online && <span className="w-2 h-2 rounded-full bg-[#006236] inline-block"/>}
                    {contact.online ? "Online" : "Offline"} · {contact.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-[clamp(12px,2vw,24px)] flex flex-col gap-3 bg-[#d9d9d9]/40">
            {activeConvo.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.isStudent ? "items-end" : "items-start"}`}>
                <span className="text-gray-400 text-[10px] mb-0.5 px-1">{msg.time}</span>
                <div className={`${
                  msg.isStudent
                    ? "bg-[#006236] rounded-[20px_20px_4px_20px]"
                    : "bg-[#7d807f] rounded-[20px_20px_20px_4px]"
                } text-white px-5 py-2.5 text-[clamp(13px,1.2vw,16px)] max-w-[70%]`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef}/>
          </div>

          <div className="px-4 py-3 bg-[#d9d9d9] border-t border-[#006236]/15 shrink-0">
            <div className="flex items-center gap-2 bg-white rounded-full py-2 pr-3 pl-5 border border-[#006236]/20">
              <button className="bg-transparent border-none cursor-pointer flex items-center p-1"><EmojiIcon/></button>
              <button className="bg-transparent border-none cursor-pointer flex items-center p-1"><AttachIcon/></button>
              <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
                placeholder="Type a message..."
                className="flex-1 border-none outline-none bg-transparent text-[clamp(13px,1.2vw,16px)] text-black"/>
              <button onClick={sendMessage} className="bg-transparent border-none cursor-pointer flex items-center p-1"><SendIcon/></button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
