import { useState, useRef, useEffect } from "react";
import TeacherLayout from "./TeacherLayout";
/* ---- Images ---- */
const STUDENT_AVATARS = [
  "https://images.unsplash.com/photo-1773243906471-bd9153d1a5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGJveSUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3NDAwODY0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1660128355607-2a311a8acfa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGdpcmwlMjBzdHVkeWluZyUyMG5vdGVib29rfGVufDF8fHx8MTc3NDAwODY0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzM5MzI5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1767619946289-96cea6c14081?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHdvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDAwODY0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1631905131477-eefc1360588a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwdGVlbmFnZXIlMjBib3klMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDAwODY0OXww&ixlib=rb-4.1.0&q=80&w=1080",
];

const CONTACTS = [
  { id: 1, name: "Ahmad Nazari", subject: "English — Elementary", avatar: STUDENT_AVATARS[0], online: true, unread: 2, lastMsg: "Thank you for the lesson!", lastTime: "10:24 AM" },
  { id: 2, name: "Fatima Karimova", subject: "English — Intermediate", avatar: STUDENT_AVATARS[1], online: true, unread: 0, lastMsg: "I finished my homework", lastTime: "9:45 AM" },
  { id: 3, name: "Omar Hassan", subject: "English — Beginner", avatar: STUDENT_AVATARS[2], online: false, unread: 0, lastMsg: "See you tomorrow!", lastTime: "Yesterday" },
  { id: 4, name: "Layla Ahmadi", subject: "English — Advanced", avatar: STUDENT_AVATARS[3], online: false, unread: 5, lastMsg: "Can you share the notes?", lastTime: "Yesterday" },
  { id: 5, name: "Daniyal Mirzo", subject: "English — Elementary", avatar: STUDENT_AVATARS[4], online: true, unread: 0, lastMsg: "Got it, thanks!", lastTime: "Mar 18" },
];

const CONVERSATIONS = {
  1: [
    { id: 1, sender: "Ahmad Nazari", text: "Good morning, teacher!", isTeacher: false, time: "10:00 AM" },
    { id: 2, sender: "You", text: "Good morning Ahmad! How are you today?", isTeacher: true, time: "10:02 AM" },
    { id: 3, sender: "Ahmad Nazari", text: "I'm doing great! I practiced the past simple exercises you gave me.", isTeacher: false, time: "10:05 AM" },
    { id: 4, sender: "You", text: "Wonderful! How did you find them? Were there any difficult parts?", isTeacher: true, time: "10:08 AM" },
    { id: 5, sender: "Ahmad Nazari", text: "The irregular verbs were a bit tricky but I managed most of them.", isTeacher: false, time: "10:15 AM" },
    { id: 6, sender: "You", text: "That's completely normal. We'll review irregular verbs together in our next session. Keep practicing!", isTeacher: true, time: "10:18 AM" },
    { id: 7, sender: "Ahmad Nazari", text: "Thank you for the lesson!", isTeacher: false, time: "10:24 AM" },
  ],
  2: [
    { id: 1, sender: "Fatima Karimova", text: "Hi teacher, I finished my homework on conditional sentences.", isTeacher: false, time: "9:30 AM" },
    { id: 2, sender: "You", text: "Great job Fatima! I'll review it before our next class.", isTeacher: true, time: "9:40 AM" },
    { id: 3, sender: "Fatima Karimova", text: "I finished my homework", isTeacher: false, time: "9:45 AM" },
  ],
  3: [
    { id: 1, sender: "You", text: "Don't forget to practice the vocabulary words I assigned.", isTeacher: true, time: "3:00 PM" },
    { id: 2, sender: "Omar Hassan", text: "See you tomorrow!", isTeacher: false, time: "3:15 PM" },
  ],
  4: [
    { id: 1, sender: "Layla Ahmadi", text: "Teacher, I have a question about the essay structure.", isTeacher: false, time: "2:00 PM" },
    { id: 2, sender: "You", text: "Sure Layla, go ahead!", isTeacher: true, time: "2:05 PM" },
    { id: 3, sender: "Layla Ahmadi", text: "How do I write a strong thesis statement?", isTeacher: false, time: "2:08 PM" },
    { id: 4, sender: "You", text: "A strong thesis statement should be specific, arguable, and state your main point clearly. For example, instead of saying 'Social media is bad', you could say 'Social media negatively impacts teenagers' mental health by increasing anxiety and reducing face-to-face interactions.'", isTeacher: true, time: "2:15 PM" },
    { id: 5, sender: "Layla Ahmadi", text: "That makes a lot of sense! Can you share the notes from last class too?", isTeacher: false, time: "2:20 PM" },
    { id: 6, sender: "Layla Ahmadi", text: "Can you share the notes?", isTeacher: false, time: "2:22 PM" },
  ],
  5: [
    { id: 1, sender: "You", text: "Hi Daniyal, here are some extra exercises for you.", isTeacher: true, time: "11:00 AM" },
    { id: 2, sender: "Daniyal Mirzo", text: "Got it, thanks!", isTeacher: false, time: "11:30 AM" },
  ],
};

/* ---- SVG Icons ---- */
const SendIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#006236"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const AttachIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006236" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>;
const EmojiIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006236" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const PhoneIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const VideoIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;

export default function TeacherMessages() {
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

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg = { id: Date.now(), sender: "You", text: inputText.trim(), isTeacher: true, time: timeStr };
    setMessages(prev => ({ ...prev, [activeContact]: [...(prev[activeContact] || []), newMsg] }));
    setInputText("");
  };

  return (
    <TeacherLayout activePage="t-messages">
      <div className="flex-1 flex overflow-hidden">
        {/* ---- Contacts Sidebar ---- */}
        <div className="w-[clamp(240px,25vw,340px)] bg-[#d9d9d9] flex flex-col border-r-2 border-[#006236]/15 shrink-0">
          {/* Header */}
          <div className="px-4 py-4 border-b-2 border-[#006236]/15">
            <h2 className="text-[#006236] text-[clamp(18px,2vw,24px)] font-bold m-0 mb-3">Messages</h2>
            <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 border border-[#006236]/20">
              <span className="text-[#006236]/50"><SearchIcon/></span>
              <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)}
                placeholder="Search students..."
                className="flex-1 border-none outline-none bg-transparent text-sm text-black"/>
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(c => (
              <div key={c.id} onClick={() => setActiveContact(c.id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-[#006236]/10 ${
                  activeContact === c.id ? "bg-[#006236]/15" : "hover:bg-[#006236]/5"
                }`}>
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#006236]">
                    <img src={c.avatar} alt={c.name} className="w-full h-full object-cover"/>
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

        {/* ---- Chat Area ---- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat header */}
          {contact && (
            <div className="px-5 py-3 bg-[#006236]/5 border-b border-[#006236]/15 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#006236]">
                  <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover"/>
                </div>
                <div>
                  <h3 className="text-[#006236] font-bold text-sm m-0">{contact.name}</h3>
                  <p className="text-gray-400 text-xs m-0 flex items-center gap-1">
                    {contact.online && <span className="w-2 h-2 rounded-full bg-[#006236] inline-block"/>}
                    {contact.online ? "Online" : "Offline"} · {contact.subject}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-full bg-[#006236]/10 text-[#006236] flex items-center justify-center border-none cursor-pointer hover:bg-[#006236]/20 transition-colors"><PhoneIcon/></button>
                <button className="w-9 h-9 rounded-full bg-[#006236]/10 text-[#006236] flex items-center justify-center border-none cursor-pointer hover:bg-[#006236]/20 transition-colors"><VideoIcon/></button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-[clamp(12px,2vw,24px)] flex flex-col gap-3 bg-[#d9d9d9]/40">
            {activeConvo.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.isTeacher ? "items-end" : "items-start"}`}>
                <span className="text-gray-400 text-[10px] mb-0.5 px-1">{msg.time}</span>
                <div className={`${
                  msg.isTeacher
                    ? "bg-[#006236] rounded-[20px_20px_4px_20px]"
                    : "bg-[#7d807f] rounded-[20px_20px_20px_4px]"
                } text-white px-5 py-2.5 text-[clamp(13px,1.2vw,16px)] max-w-[70%]`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef}/>
          </div>

          {/* Input bar */}
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
    </TeacherLayout>
  );
}
