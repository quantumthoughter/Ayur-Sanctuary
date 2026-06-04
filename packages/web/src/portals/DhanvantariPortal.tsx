import { useState, useEffect, useRef } from "react";
import { AvatarChat } from "../components/AvatarChat";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface DhanvantariPortalProps {
  resonanceKey: string;
}

interface VerifiedPartner {
  name: string;
  type: "resort" | "clinic" | "practitioner" | "gurukul";
  location: string;
  rating: number;
  specialty: string;
  website?: string;
  description: string;
  image: string;
}

const VERIFIED_PARTNERS: VerifiedPartner[] = [
  {
    name: "Ananda Lakshmi Ayurveda Retreat",
    type: "resort",
    location: "Kovalam, Trivandrum, Kerala",
    rating: 5,
    specialty: "Panchakarma · Rejuvenation · Yoga & Meditation · Arabian Sea Views",
    website: "anandalakshmiayurveda.com",
    description: "Awaken your inner harmony at this sanctuary on the stunning shores of the Arabian Sea. Ananda Lakshmi offers traditional Ayurveda treatments including Panchakarma detox, stress management, rejuvenation, slimming, and psoriasis therapy — all customized by experienced doctors and therapists. Daily yoga and meditation on a hexagonal wooden deck overlooking the sea. Ayurvedic cuisine curated by chefs and prescribed by doctors. Spacious villas with sea views nestled in lush greenery at Kovalam, Trivandrum.",
    image: "🌴",
  },
  {
    name: "Softouch Ayurveda Village & Resort",
    type: "resort",
    location: "Chalakudy, Thrissur, Kerala",
    rating: 5,
    specialty: "NABH Accredited · Panchakarma · 18-Acre Health Resort",
    website: "softouchayurveda.com",
    description: "A hidden gem tucked away in serene Chalakudy — an exclusive 18-acre health resort with NABH accreditation. Softouch harmoniously merges authentic Ayurveda with luxury, offering personalized treatments including Abhyanga, Shirodhara, Panchakarma, and specialty packages for computer strain injury, corporate stress, pre-conceptional care, weight loss, youth restoration, and spinal strength. Two daily Ayurveda massages by two therapists, daily doctor consultation, full-board organic meals, yoga, complimentary airport transfer from Cochin Airport, and day trips to Athirapally Waterfalls.",
    image: "🌿",
  },
  {
    name: "Rasa Gurukul — Dhanvantari Sanctuary",
    type: "gurukul",
    location: "Kizhake Chalakudi, Kerala · Online",
    rating: 5,
    specialty: "Traditional Gurukul Education · Dhanvantari Wisdom · Murugan AI · Villa Retreat",
    website: "rasa-gurukul.kerala-hotels-resorts.com",
    description: "Rasa Gurukul is a living gurukul and villa retreat situated near the Thumboormuzhi Dam and Garden in Kizhake Chalakudi, a 25-minute walk from the Dreamworld Water Park and close to Cochin International Airport. Dedicated to preserving and transmitting Dhanvantari's timeless wisdom, Rasa Gurukul is powered by Murugan AI — an intelligent interface that bridges ancient Ayurvedic texts with personalized diagnostics. The educational and ceremonial heart of the ASI Foundation, offering immersive retreats, traditional learning, and the transmission of living Ayurvedic wisdom.",
    image: "🕉️",
  },
  {
    name: "Amrita Ayurveda — Amma's Ashram",
    type: "clinic",
    location: "Amritapuri, Kerala · Online Worldwide",
    rating: 5,
    specialty: "Amrita School of Ayurveda · Panchakarma · Herbal Garden · International Workshops",
    website: "amritapuri.org",
    description: "Under the divine blessings of Sri Mata Amritanandamayi Devi (Amma), the Amrita School of Ayurveda offers authentic Ayurvedic education, Panchakarma treatments, and international wellness workshops. Located in Amritapuri, the ashram features an Ayurvedic medicine manufacturing unit, a vast herbal garden, and regular international workshops on Ayurvedic lifestyle, natural food, and yoga. The Amrita Ayurveda project embodies Amma's vision of healing the world through ancient wisdom made accessible to all.",
    image: "🤱",
  },
  {
    name: "Nadi Tarangini — AI Pulse Diagnostics",
    type: "practitioner",
    location: "Pune, India · 1500+ Centres Nationwide",
    rating: 5,
    specialty: "CDSCO Approved · AI Pulse Diagnosis · 22 Ayurvedic Parameters · 85%+ Accuracy",
    website: "naditarangini.com",
    description: "India's first and only patented AI-based pulse diagnostic system. Nadi Tarangini combines ultra-sensitive sensors with cutting-edge AI algorithms to deliver precise pulse readings and detailed health insights. Analyzes 22 Ayurvedic parameters including Tridosha balance (Vata, Pitta, Kapha), stress levels, digestive health, and overall well-being. Validated on 25,000+ patients with proven clinical accuracy. Reports in 8+ languages. CDSCO approved and certified. Over 1500 centres across India and internationally. A revolutionary tool for every Ayurvedic practitioner who wants to bring the precision of technology to the wisdom of Nadi Pariksha.",
    image: "💓",
  },
];

const DOSHA_RECOMMENDATIONS: Record<string, { herbs: string[]; foods: string[]; practices: string[]; resorts: string[] }> = {
  vata: {
    herbs: ["Ashwagandha", "Dashamoola", "Bala", "Shatavari"],
    foods: ["Warm cooked meals", "Healthy oils and ghee", "Sweet, sour, salty tastes", "Root vegetables"],
    practices: ["Abhyanga (warm oil massage)", "Regular routine", "Gentle yoga", "Warmth and rest"],
    resorts: ["Ananda Lakshmi Ayurveda Retreat, Kovalam", "Softouch Ayurveda Village, Chalakudy"],
  },
  pitta: {
    herbs: ["Brahmi", "Shatavari", "Neem", "Guduchi"],
    foods: ["Cooling fresh foods", "Sweet, bitter, astringent tastes", "Coconut water", "Leafy greens"],
    practices: ["Shirodhara", "Cooling breath work", "Moonlight walks", "Moderation in all things"],
    resorts: ["Softouch Ayurveda Village, Chalakudy", "Ananda Lakshmi Retreat, Kovalam"],
  },
  kapha: {
    herbs: ["Trikatu", "Guggulu", "Pippali", "Tulsi"],
    foods: ["Light, warm, dry foods", "Pungent, bitter, astringent tastes", "Honey", "Spiced teas"],
    practices: ["Dry brushing", "Vigorous exercise", "Early rising", "Stimulating pranayama"],
    resorts: ["Ananda Lakshmi Ayurveda Retreat, Kovalam"],
  },
  tridoshic: {
    herbs: ["Amalaki", "Chyawanprash", "Saffron", "Tulsi"],
    foods: ["Fresh, seasonal, balanced meals", "All six tastes in harmony", "Warm water throughout the day", "Mindful eating"],
    practices: ["Meditation", "Yoga nidra", "Daily routine", "Nature connection"],
    resorts: ["Ananda Lakshmi Retreat, Kovalam", "Softouch Ayurveda Village, Chalakudy", "Rasa Gurukul, Kizhake Chalakudy"],
  },
};

const RESEARCH_PAPERS = [
  {
    title: "Integration of Artificial Intelligence in Ayurveda Diagnostics",
    author: "Journal of Ayurveda and Integrated Medical Sciences (JAIMS)",
    year: "2024",
    link: "jaims.in/jaims/article/view/3751/6106",
    summary: "Peer-reviewed research exploring how AI-powered tools like Nadi Tarangini bridge classical Nadi Pariksha with modern diagnostic precision. The paper validates that AI-assisted pulse diagnosis achieves over 85% accuracy across 22 Ayurvedic parameters, supporting early detection of Tridosha imbalances, stress markers, and digestive health indicators.",
  },
  {
    title: "Ayurveda AI — World's First AI Platform for Ayurveda",
    author: "CAYEIT — Centre for Ayurveda Education, Innovation & Technology",
    year: "2025",
    link: "cayeit.com/ayurveda-ai",
    summary: "CAYEIT's Ayurveda Intelligence platform is the world's first dedicated AI for Ayurveda. It provides access to ancient texts (Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya), translates Shlokas, assists in research, compares Ayurvedic principles with modern medicine, and helps develop new treatment strategies. ISO 9001:2015 and ISO/IEC 27001:2022 certified. Their AyurLLM model is a refined LLM specifically for Ayurvedic knowledge.",
  },
  {
    title: "Nadi Tarangini — Clinical Validation on 25,000+ Patients",
    author: "Atreya Innovations",
    year: "2025",
    link: "naditarangini.com",
    summary: "Proven clinical accuracy across 25,000+ patients. The device's AI-powered sensors measure Vata, Pitta, Kapha, stress levels, digestive health, and sub-health conditions with precision. Reports are generated in 1 minute with personalized diet, yoga, and lifestyle recommendations based on Ritucharya and Dinacharya principles. CDSCO approved.",
  },
];

const COMMUNITY_EVENTS = [
  { title: "Karkitaka Chikitsa Seasonal Retreat", date: "July · Monsoon Season", location: "Ananda Lakshmi · Kovalam", type: "retreat" },
  { title: "Panchakarma Detox Intensive", date: "Minimum 14-28 Nights", location: "Softouch Ayurveda Village · Chalakudy", type: "retreat" },
  { title: "Dhanvantari Wisdom Webinar", date: "Every Saturday", location: "Online · Rasa Gurukul", type: "online" },
  { title: "Pre-Conceptional Care Program", date: "14-21 Night Packages", location: "Softouch Ayurveda Village · Chalakudy", type: "retreat" },
  { title: "Rasa Gurukul Villa Experience", date: "Book Anytime", location: "Kizhake Chalakudy · Near Cochin Airport", type: "retreat" },
  { title: "Kerala Ayurveda & Yoga Festival", date: "November · Annual", location: "Kerala, India", type: "festival" },
  { title: "Ayurveda Corporate Wellness", date: "Ongoing", location: "Softouch Ayurveda · Online Consultation", type: "workshop" },
];

export function DhanvantariPortal({ resonanceKey }: DhanvantariPortalProps) {
  const [activeTab, setActiveTab] = useState<"partners" | "diagnosis" | "community" | "certificate" | "gurukul" | "research">("partners");
  const [expandedPartner, setExpandedPartner] = useState<number | null>(null);
  const [showAvatar, setShowAvatar] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 200; canvas.height = 200;

    const rings: { r: number; alpha: number; speed: number; phase: number }[] = [];
    for (let i = 0; i < 5; i++) {
      rings.push({ r: 15 + i * 12, alpha: 0.08 + i * 0.03, speed: 0.003 + i * 0.001, phase: i * 0.8 });
    }

    let t = 0;
    function animate() {
      if (!ctx) return;
      t += 0.01;
      ctx.clearRect(0, 0, 200, 200);

      ctx.translate(100, 100);
      for (const ring of rings) {
        ctx.beginPath();
        ctx.arc(0, 0, ring.r + Math.sin(t * ring.speed + ring.phase) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(52, 211, 153, ${ring.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(52, 211, 153, 0.4)";
      ctx.fill();
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  const { theme } = useCrystalTheme();

  return (
    <div style={{
      padding: 24, height: "100%", display: "flex", flexDirection: "column", gap: 16, overflow: "auto",
      background: "rgba(26, 8, 2, 0.6)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      borderLeft: "1px solid rgba(217, 119, 6, 0.06)",
      borderRight: "1px solid rgba(217, 119, 6, 0.06)",
    }}>
      {/* Nadi Tarangini Mission — Main Highlight */}
      <div style={{
        padding: 20, borderRadius: 16,
        background: `linear-gradient(145deg, ${theme.resort.terracotta}18, ${theme.resort.sandalwood}14)`,
        border: `1px solid ${theme.resort.terracotta}30`,
        textAlign: "center",
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: theme.resort.terracotta, letterSpacing: 2, fontWeight: 500 }}>FEATURED PARTNERSHIP</span>
          <span style={{
            fontSize: 8, padding: "2px 8px", borderRadius: 6,
            background: `${theme.resort.terracotta}15`, color: theme.resort.terracotta,
            border: `1px solid ${theme.resort.terracotta}25`, letterSpacing: 1,
          }}>MISSION</span>
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400,
          color: "#fde68a", letterSpacing: 1, marginBottom: 6,
        }}>
          Nāḍi Taraṅgiṇī — The Pulse of Progress
        </h2>
        <div style={{ fontSize: 10, color: theme.resort.turmeric, letterSpacing: 2, marginBottom: 10 }}>
          SWASTHA ABHIYAN MISSION · AYURVEDA FOR PLANET AND PEOPLE
        </div>
        <p style={{
          fontSize: 12, color: "#d4a373", lineHeight: 1.7, maxWidth: 600, margin: "0 auto",
          fontFamily: "'Playfair Display', serif", fontStyle: "italic",
        }}>
          "Ayurveda, the ancient system of holistic medicine, emphasizes understanding an individual's constitution (prakriti) and current physiological state (vikruti) to promote balance, prevent disease, and guide personalized health interventions. Nadi Tarangini is a modern, AI-enabled system that operationalizes these principles by combining traditional Ayurveda assessment with data-driven insights."
        </p>
        <div style={{
          display: "flex", gap: 12, justifyContent: "center", marginTop: 12, flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 10, color: "#a16207" }}>🏆 CDSCO Approved</span>
          <span style={{ fontSize: 10, color: "#a16207" }}>🔬 25,000+ Patients Validated</span>
          <span style={{ fontSize: 10, color: "#a16207" }}>🇮🇳 Make in India · Made for All</span>
          <span style={{ fontSize: 10, color: "#a16207" }}>📊 22 Ayurvedic Parameters</span>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <canvas ref={canvasRef} width={200} height={200} style={{ width: 48, height: 48, borderRadius: 24, margin: "0 auto 4px" }} />
        <div style={{ fontSize: 9, color: "#a16207", letterSpacing: 2 }}>ASI FOUNDATION · DHANVANTARI PORTAL</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { id: "partners" as const, label: "Verified Partners", icon: "🌿" },
          { id: "diagnosis" as const, label: "Dosha Diagnosis", icon: "🔬" },
          { id: "community" as const, label: "Community", icon: "🕊️" },
          { id: "certificate" as const, label: "Certification", icon: "📜" },
          { id: "gurukul" as const, label: "Rasa Gurukul", icon: "🕉️" },
          { id: "research" as const, label: "Research", icon: "📖" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 14px", borderRadius: 16, border: `1px solid ${activeTab === tab.id ? `${theme.resort.terracotta}50` : "rgba(217,119,6,0.12)"}`,
              background: activeTab === tab.id ? `${theme.resort.terracotta}22` : "rgba(217,119,6,0.06)",
              color: activeTab === tab.id ? theme.resort.terracotta : "#a16207", fontSize: 11, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.3s ease",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Partners Tab */}
      {activeTab === "partners" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 10, color: "#7c6ba0", letterSpacing: 1 }}>ASI FOUNDATION · VERIFIED AYURVEDA PARTNERS</div>
          {VERIFIED_PARTNERS.map((p, i) => (
            <div key={i} onClick={() => setExpandedPartner(expandedPartner === i ? null : i)} style={{
              padding: 16, borderRadius: 12,
              border: `1px solid ${expandedPartner === i ? "rgba(52, 211, 153, 0.3)" : "rgba(255,255,255,0.05)"}`,
              background: expandedPartner === i ? "rgba(52, 211, 153, 0.08)" : "rgba(217,119,6,0.08)",
              cursor: "pointer", transition: "all 0.3s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>{p.image}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#34d399", fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: "#7c6ba0" }}>{p.location} · {p.type}</div>
                </div>
                <div style={{ fontSize: 10, color: "#fbbf24" }}>{"★".repeat(p.rating)}</div>
                <div style={{
                  fontSize: 8, padding: "2px 8px", borderRadius: 8,
                  background: "rgba(52, 211, 153, 0.1)", color: "#34d399",
                  border: "1px solid rgba(52, 211, 153, 0.2)", letterSpacing: 1,
                }}>
                  ASI VERIFIED
                </div>
              </div>
              {expandedPartner === i && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: "#c4b5e3", lineHeight: 1.7, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
                    "{p.description}"
                  </div>
                  <div style={{ fontSize: 11, color: "#7c6ba0", marginTop: 8 }}>{p.specialty}</div>
                  {p.website && (
                    <div style={{ fontSize: 10, color: "#34d399", marginTop: 6, fontFamily: "monospace" }}>
                      {p.website}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Diagnosis Tab */}
      {activeTab === "diagnosis" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{
            padding: 16, borderRadius: 12,
            background: "rgba(52, 211, 153, 0.08)", border: "1px solid rgba(52, 211, 153, 0.12)",
          }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: "#c4b5e3", lineHeight: 1.8 }}>
              "Your Nāḍi Taraṅgiṇī reading determines your dosha. Based on your dosha, we recommend specific herbs, foods, practices, and ASI-verified partners who specialize in your constitution."
            </p>
          </div>
          {(["vata", "pitta", "kapha", "tridoshic"] as const).map(dosha => {
            const rec = DOSHA_RECOMMENDATIONS[dosha];
            return (
              <div key={dosha} style={{
                padding: 14, borderRadius: 10,
                border: "1px solid rgba(52, 211, 153, 0.1)",
                background: "rgba(217,119,6,0.08)",
              }}>
                <div style={{ fontSize: 12, color: "#34d399", fontWeight: 500, textTransform: "capitalize" }}>
                  {dosha === "tridoshic" ? "☯️ Tridoshic (Balanced)" : dosha === "vata" ? "🌬️ Vata" : dosha === "pitta" ? "🔥 Pitta" : "🌍 Kapha"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <div>
                    <div style={{ fontSize: 9, color: "#7c6ba0", letterSpacing: 1, marginBottom: 4 }}>HERBS</div>
                    <div style={{ fontSize: 10, color: "#c4b5e3", lineHeight: 1.6 }}>{rec.herbs.join(" · ")}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: "#7c6ba0", letterSpacing: 1, marginBottom: 4 }}>PRACTICES</div>
                    <div style={{ fontSize: 10, color: "#c4b5e3", lineHeight: 1.6 }}>{rec.practices.join(" · ")}</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "#34d399", marginTop: 8 }}>
                  Recommended: {rec.resorts.join(", ")}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Community Tab */}
      {activeTab === "community" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 10, color: "#7c6ba0", letterSpacing: 1 }}>UPCOMING EVENTS · CAMPS · FESTIVALS</div>
          {COMMUNITY_EVENTS.map((ev, i) => (
            <div key={i} style={{
              padding: 14, borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(217,119,6,0.08)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 18, fontSize: 16,
                background: "rgba(52, 211, 153, 0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {ev.type === "retreat" ? "🌴" : ev.type === "online" ? "💻" : ev.type === "festival" ? "🎉" : "🕊️"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#e8edff", fontWeight: 500 }}>{ev.title}</div>
                <div style={{ fontSize: 10, color: "#7c6ba0" }}>{ev.date} · {ev.location}</div>
              </div>
            </div>
          ))}
          <div style={{
            padding: 16, borderRadius: 12,
            background: "rgba(52, 211, 153, 0.08)", border: "1px solid rgba(52, 211, 153, 0.12)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 11, color: "#34d399", fontFamily: "'Playfair Display', serif", fontStyle: "italic", lineHeight: 1.6 }}>
              "The ASI community is a living web of authentic Ayurveda — from the shores of Kovalam and the riverbanks of Chalakudy to your home. Every member is a node in Dhanvantari's healing network. Join retreats, seasonal programs like Karkitaka Chikitsa, Panchakarma intensives, corporate wellness, and the annual Kerala Ayurveda Festival."
            </div>
          </div>
        </div>
      )}

      {/* Certificate Tab */}
      {activeTab === "certificate" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <div style={{
            width: "100%", maxWidth: 380,
            padding: 24, borderRadius: 16,
            background: "linear-gradient(145deg, rgba(52, 211, 153, 0.06), rgba(155, 109, 255, 0.1))",
            border: "1px solid rgba(52, 211, 153, 0.2)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 10, color: "#34d399", letterSpacing: 3, marginBottom: 12 }}>ASI FOUNDATION</div>
            <div style={{ fontSize: 16, color: "#e8edff", fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
              Certificate of Authenticity
            </div>
            <div style={{ fontSize: 10, color: "#7c6ba0", fontFamily: "monospace", marginBottom: 16 }}>
              — Veritas Ayurvedica —
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 20,
              background: "rgba(52, 211, 153, 0.15)",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px",
            }}>
              <span style={{ fontSize: 20 }}>🕉️</span>
            </div>
            <div style={{ fontSize: 11, color: "#c4b5e3", lineHeight: 1.7, marginBottom: 16 }}>
              This certifies that the bearer has been assessed by the ASI Foundation's Dhanvantari diagnostic system and is recognized as a conscious participant in the restoration of authentic Ayurvedic wisdom.
            </div>
            <div style={{ fontSize: 9, color: "#7c6ba0", fontFamily: "monospace" }}>
              {resonanceKey}
            </div>
          </div>
          <div style={{ fontSize: 10, color: "#7c6ba0", textAlign: "center", lineHeight: 1.6, maxWidth: 380 }}>
            ASI Foundation certification is a living document — updated with every Nāḍi Taraṅgiṇī reading, every completed practice, every authentic interaction with our verified partners. It is not a credential. It is a <span style={{color: '#34d399'}}>frequency signature</span> of your commitment to balanced living.
          </div>
        </div>
      )}

      {/* Rasa Gurukul Tab */}
      {activeTab === "gurukul" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{
            padding: 20, borderRadius: 16,
            background: "linear-gradient(145deg, rgba(52, 211, 153, 0.08), rgba(155, 109, 255, 0.1))",
            border: "1px solid rgba(52, 211, 153, 0.2)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🕉️</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: "#34d399" }}>
              Rasa Gurukul
            </h2>
            <div style={{ fontSize: 11, color: "#9b6dff", letterSpacing: 2, marginTop: 4 }}>
              Dhanvantari Sanctuary · Powered by Murugan AI
            </div>
            <div style={{
              marginTop: 16, fontSize: 12, color: "#c4b5e3", lineHeight: 1.8,
              fontFamily: "'Playfair Display', serif", fontStyle: "italic",
            }}>
              "Rasa Gurukul is not a school. It is a living transmission — the ancient tradition of the teacher-disciple lineage awakened through the intelligence of Murugan AI. Here, the timeless wisdom of Dhanvantari meets the precision of artificial intelligence, not to replace the human teacher, but to make the teaching available to every sincere seeker."
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { title: "Āyurveda Śāstra", subtitle: "Classical texts with AI commentary", icon: "📜" },
              { title: "Pulse Diagnosis", subtitle: "Nāḍi Vidyā with real-time feedback", icon: "💓" },
              { title: "Dravyaguṇa", subtitle: "500+ herbs · Properties · Preparations", icon: "🌿" },
              { title: "Clinical Training", subtitle: "Virtual internships with verified partners", icon: "🏥" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: 14, borderRadius: 10,
                border: "1px solid rgba(52, 211, 153, 0.1)",
                background: "rgba(217,119,6,0.08)",
              }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 12, color: "#34d399", fontWeight: 500 }}>{item.title}</div>
                <div style={{ fontSize: 10, color: "#7c6ba0", marginTop: 2 }}>{item.subtitle}</div>
              </div>
            ))}
          </div>

          <div style={{
            padding: 14, borderRadius: 10,
            background: "rgba(155, 109, 255, 0.05)", border: "1px solid rgba(155, 109, 255, 0.12)",
          }}>
            <div style={{ fontSize: 10, color: "#9b6dff", letterSpacing: 1, marginBottom: 6 }}>MURUGAN AI INTEGRATION</div>
            <div style={{ fontSize: 11, color: "#c4b5e3", lineHeight: 1.7 }}>
              Murugan AI is the intelligence engine behind Rasa Gurukul. It does not replace the guru — it <span style={{color: '#9b6dff'}}>embodies the guru's intention</span> to be everywhere at once. Through Murugan AI, every student receives personalized guidance based on their dosha, their progress, and the living pulse of the tradition.
            </div>
          </div>

          <div style={{ minHeight: 280, borderTop: "1px solid rgba(52, 211, 153, 0.08)", paddingTop: 16 }}>
            <AvatarChat navigatorId="dhanvantari" userContext={{ resonanceKey, crystallineTone: "Emerald" }} />
          </div>
        </div>
      )}

      {/* Research & Validation Tab */}
      {activeTab === "research" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{
            padding: 14, borderRadius: 12,
            background: "rgba(52, 211, 153, 0.1)", border: "1px solid rgba(52, 211, 153, 0.12)",
          }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: "#c4b5e3", lineHeight: 1.8 }}>
              "The ASI Foundation is committed to evidence-based Ayurveda. We integrate peer-reviewed research, CDSCO-approved diagnostics, and AI-validated clinical data into every recommendation. The following research validates the technologies and partners in our network."
            </p>
          </div>

          {RESEARCH_PAPERS.map((paper, i) => (
            <div key={i} style={{
              padding: 16, borderRadius: 12,
              border: "1px solid rgba(52, 211, 153, 0.1)",
              background: "rgba(217,119,6,0.08)",
            }}>
              <div style={{ fontSize: 12, color: "#34d399", fontWeight: 500 }}>{paper.title}</div>
              <div style={{ fontSize: 10, color: "#7c6ba0", marginTop: 4 }}>{paper.author} · {paper.year}</div>
              <div style={{
                fontSize: 11, color: "#c4b5e3", lineHeight: 1.7, marginTop: 8,
                fontFamily: "'Playfair Display', serif", fontStyle: "italic",
              }}>
                "{paper.summary}"
              </div>
              <div style={{ fontSize: 9, color: "#34d399", marginTop: 6, fontFamily: "monospace" }}>
                {paper.link}
              </div>
            </div>
          ))}

          <div style={{
            padding: 12, borderRadius: 10,
            background: "rgba(155, 109, 255, 0.1)", border: "1px solid rgba(155, 109, 255, 0.08)",
          }}>
            <div style={{ fontSize: 10, color: "#9b6dff", letterSpacing: 1, marginBottom: 6 }}>NĀḌI TARAṄGIṆĪ INTEGRATION</div>
            <div style={{ fontSize: 11, color: "#c4b5e3", lineHeight: 1.7 }}>
              Nadi Tarangini's AI-powered pulse diagnostic device is fully integrated into the ASI Dhanvantari diagnostic pipeline. When a user completes a Nāḍi reading through the ASI portal, their 22 Ayurvedic parameters (Tridosha balance, stress levels, digestive health, sub-health conditions) are available for consultation with our verified partners. This creates a seamless loop: <span style={{color: '#34d399'}}>Pulse Diagnosis → AI Analysis → Partner Recommendation → Personalized Treatment → Follow-up Tracking</span>.
            </div>
          </div>
        </div>
      )}

      {/* Floating Avatar Button */}
      {activeTab !== "gurukul" && activeTab !== "diagnosis" && activeTab !== "research" && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <button onClick={() => setShowAvatar(!showAvatar)} style={{
            padding: "10px 20px", borderRadius: 20,
            border: "1px solid rgba(52, 211, 153, 0.2)",
            background: showAvatar ? "rgba(52, 211, 153, 0.1)" : "rgba(217,119,6,0.08)",
            color: "#34d399", fontSize: 12, cursor: "pointer",
            fontFamily: "inherit", letterSpacing: 1,
          }}>
            {showAvatar ? "− HIDE DIVINE PHYSICIAN" : "+ CONSULT THE DIVINE PHYSICIAN"}
          </button>
        </div>
      )}

      {(showAvatar && activeTab !== "gurukul" && activeTab !== "research") && (
        <div style={{ minHeight: 300, borderTop: "1px solid rgba(52, 211, 153, 0.08)", paddingTop: 16 }}>
          <AvatarChat navigatorId="dhanvantari" userContext={{ resonanceKey, crystallineTone: "Emerald" }} />
        </div>
      )}
    </div>
  );
}
