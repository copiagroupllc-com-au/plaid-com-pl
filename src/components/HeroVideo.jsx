import { useEffect, useRef } from "react";

export default function HeroVideo() {
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Cover image as hero background */}
      <img
        src="/plaid__cover.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <video ref={videoRef} autoPlay muted loop playsInline aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-30">
        <source src="/hero-bg.webm" type="video/webm" />
        <source src="/hero-bg.mp4"  type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F]/90 via-[#111118]/80 to-[#0A0A0F]/90" />
      <div className="absolute inset-0 opacity-8"
        style={{ backgroundImage:"linear-gradient(rgba(220,38,38,0.18) 1px,transparent 1px),linear-gradient(90deg,rgba(220,38,38,0.18) 1px,transparent 1px)", backgroundSize:"80px 80px" }} />
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#DC2626]/50 to-transparent animate-scan" />
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#DC2626]/25 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#DC2626]/25 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-[#DC2626]/25 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#DC2626]/25 rounded-br-3xl" />
      <div className="absolute top-1/4 left-[20%] w-1 h-1 rounded-full bg-[#DC2626] animate-ping opacity-60" />
      <div className="absolute top-2/3 right-1/4 w-1 h-1 rounded-full bg-[#EF4444] animate-ping opacity-40" style={{ animationDelay:"1s" }} />
      <div className="absolute top-1/2 left-3/4 w-1 h-1 rounded-full bg-[#DC2626] animate-ping opacity-50" style={{ animationDelay:"2s" }} />
      <div className="absolute top-3/4 left-1/3 w-1 h-1 rounded-full bg-[#EF4444] animate-ping opacity-35" style={{ animationDelay:"3s" }} />
    </div>
  );
}
