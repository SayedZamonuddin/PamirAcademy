import { useState } from "react";
import DashboardLayout from "./DashboardLayout";

const INITIAL_MESSAGES = [
  { id: 1, sender: "Admin", text: "Hello", isAdmin: true },
  { id: 2, sender: "Ubaid Sayedi", text: "Why are you?", isAdmin: false },
  { id: 3, sender: "Admin", text: "I am doing well", isAdmin: true },
  { id: 4, sender: "Ubaid Sayedi", text: "Great", isAdmin: false },
];

const SendIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#006236"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
);

export default function Messages() {
  const [messages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");

  return (
    <DashboardLayout activePage="messages">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-[clamp(16px,4vw,60px)] mb-6 flex-wrap">
          {["English","Admin"].map(label => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-white text-[clamp(20px,2.5vw,36px)] font-semibold">{label}</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 15 12 9 18 15"/></svg>
            </div>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex-1 bg-[#d9d9d9] rounded-[30px] p-[clamp(16px,2vw,32px)] flex flex-col gap-4 min-h-[350px] overflow-auto">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.isAdmin ? "items-end" : "items-start"}`}>
              <span className="text-[#006236] text-[clamp(11px,1vw,14px)] mb-1">{msg.sender}</span>
              <div className={`${msg.isAdmin ? "bg-[#006236]" : "bg-[#7d807f]"} text-white px-6 py-3 rounded-[30px] text-[clamp(14px,1.4vw,20px)] max-w-[70%]`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 mt-5 bg-[#d9d9d9] rounded-full py-2 pr-4 pl-6">
          <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
            placeholder="Enter you text to chat..."
            className="flex-1 border-none outline-none bg-transparent text-[clamp(14px,1.4vw,20px)] text-black"/>
          <button className="bg-transparent border-none cursor-pointer flex items-center p-2"><SendIcon/></button>
        </div>
      </div>
    </DashboardLayout>
  );
}
