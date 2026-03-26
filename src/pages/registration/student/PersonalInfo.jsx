import { useState, useRef } from "react";

const STEPS = ["Personal Information", "Exam", "Payment"];

const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const UploadIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#006236" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;

const inputCls = "w-full bg-[#d9d9d9] rounded-full px-6 py-3.5 border-none outline-none text-black";

export default function PersonalInfo() {
  const [formData, setFormData] = useState({ firstName:"", lastName:"", gender:"", birthDate:"", email:"", whatsapp:"", timeZone:"", location:"" });
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePhotoUpload = (e) => { const f = e.target.files?.[0]; if(f){ const r=new FileReader(); r.onloadend=()=>setPhotoPreview(r.result); r.readAsDataURL(f); }};

  return (
    <div className="font-['Nunito_Sans'] w-screen min-h-screen flex flex-col bg-[#f5f5f5] overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-[clamp(24px,5vw,80px)] py-4 bg-white border-b border-gray-200">
        <div className="h-[60px] flex items-center">
          <img
            src="/logo/final_logo.svg"
            alt="Pamir Academy Logo"
            className="h-full w-auto object-contain"
          />
        </div>
        <button className="bg-[#006236] text-white px-8 py-2.5 rounded-full border-none cursor-pointer tracking-wider">LOGIN</button>
      </header>

      {/* Steps */}
      <div className="px-[clamp(24px,5vw,80px)] py-8 bg-white">
        <div className="max-w-[900px] mx-auto flex items-center justify-between gap-4">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-2 flex-1">
              <div className={`h-2.5 w-full max-w-[200px] rounded-full ${i===0 ? "bg-[#006236]" : "bg-[#d9d9d9]"}`}/>
              <span className={`text-[clamp(12px,1.2vw,18px)] whitespace-nowrap ${i===0 ? "text-[#006236] font-semibold" : "text-[#a7a7a7]"}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <main className="flex-1 px-[clamp(24px,5vw,80px)] py-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block mb-2 text-black font-semibold">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ex. Sabri" className={inputCls}/>
            </div>
            <div>
              <label className="block mb-2 text-black font-semibold">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Ex. Smith" className={inputCls}/>
            </div>
            <div>
              <label className="block mb-2 text-black font-semibold">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}
                className={`${inputCls} ${formData.gender ? "text-black" : "text-[#a7a7a7]"} appearance-none cursor-pointer bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23006236' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")] bg-no-repeat bg-[right_20px_center]`}>
                <option value="" disabled>Ex. Male</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-black font-semibold">Birth Date</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={`${inputCls} ${formData.birthDate ? "text-black" : "text-[#a7a7a7]"}`}/>
            </div>
            <div>
              <label className="block mb-2 text-black font-semibold">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" className={inputCls}/>
            </div>
            <div>
              <label className="block mb-2 text-black font-semibold">WhatsApp</label>
              <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="Ex. +442343243" className={inputCls}/>
            </div>
            <div className="col-span-full">
              <label className="block mb-2 text-black font-semibold">Time Zone</label>
              <input type="text" name="timeZone" value={formData.timeZone} onChange={handleChange} placeholder="Ex. Tashkent (UTC +5:00)" className={inputCls}/>
            </div>
            <div className="col-span-full">
              <label className="block mb-2 text-black font-semibold">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ex. New York, USA" className={inputCls}/>
            </div>
          </div>

          {/* Photo upload */}
          <div className="mt-10">
            <label className="block mb-4 text-black font-semibold text-lg">Upload Photo</label>
            <div className="flex items-center gap-10 flex-wrap">
              <button onClick={() => fileInputRef.current?.click()}
                className="w-[180px] h-[180px] bg-[#d9d9d9] rounded-3xl flex flex-col items-center justify-center gap-2 border-none cursor-pointer shrink-0">
                <UploadIcon/><span className="text-[#006236] text-sm">Click to upload</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden"/>
              <div className="w-[180px] h-[180px] rounded-3xl overflow-hidden bg-[#d9d9d9] shrink-0 flex items-center justify-center">
                {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover"/> : <span className="text-[#a7a7a7] text-sm">Preview</span>}
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between mt-12">
            <button className="flex items-center gap-2 bg-[#006236] text-white px-8 py-3.5 rounded-full border-none cursor-pointer tracking-wider"><ChevronLeft/> PREVIOUS</button>
            <button className="flex items-center gap-2 bg-[#006236] text-white px-8 py-3.5 rounded-full border-none cursor-pointer tracking-wider">NEXT <ChevronRight/></button>
          </div>

          <p className="text-center mt-8">
            <span className="text-[#7d807f]">If you need our help? </span>
            <a href="#" className="text-[#006236] no-underline">contact us</a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/85 text-white px-[clamp(24px,5vw,80px)] py-12 mt-auto">
        <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-8">
          <div><h3 className="text-white mb-4">About</h3><ul className="list-none p-0 m-0 flex flex-col gap-2.5">{["Impact","Internship","About"].map(i=><li key={i}><a href="#" className="text-white/75 no-underline">{i}</a></li>)}</ul></div>
          <div className="text-center"><h3 className="text-white mb-4">Contact</h3><ul className="list-none p-0 m-0 flex flex-col gap-2.5">{["Help Center","Share Your Story","Email"].map(i=><li key={i}><a href="#" className="text-white/75 no-underline">{i}</a></li>)}</ul></div>
          <div className="text-right"><h3 className="text-white mb-4">Location</h3><ul className="list-none p-0 m-0 flex flex-col gap-2.5">{["Khorog","London","Dushanbe"].map(i=><li key={i} className="text-white/75">{i}</li>)}</ul></div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-10"><div className="h-[50px] bg-white/20 rounded-xl"/></div>
      </footer>
    </div>
  );
}
