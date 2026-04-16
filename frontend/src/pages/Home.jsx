import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const AnimatedSection = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
    }}>{children}</div>
  );
};

const slides = [
  { image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600', title:'Discover the Himalayas', subtitle:'North India', desc:'Snow-capped peaks, serene valleys, and royal heritage await you', link:'/destinations/north-india', cta:'Explore North India' },
  { image:'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1600', title:"God's Own Country", subtitle:'South India', desc:'Backwaters, beaches, and Ayurveda in beautiful Kerala', link:'/destinations/south-india', cta:'Explore South India' },
  { image:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600', title:'Sun, Sand & Smiles', subtitle:'Goa & West India', desc:'Golden beaches, vibrant culture and unforgettable sunsets', link:'/destinations/west-india', cta:'Explore West India' },
  { image:'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600', title:'Paradise on Earth', subtitle:'International', desc:'Maldives, Bali, Dubai and more luxury destinations abroad', link:'/destinations/international', cta:'Explore International' },
];

const destinations = [
  { title:'North India',  icon:'🏔️', iconAnim:'icon-float',  image:'https://images.unsplash.com/photo-1477587458883-47145ed31fd1?w=600', link:'/destinations/north-india',  count:'25+ Resorts',    color:'#0077C8' },
  { title:'South India',  icon:'🌴', iconAnim:'icon-wobble', image:'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600', link:'/destinations/south-india',  count:'30+ Resorts',    color:'#00d2aa' },
  { title:'East India',   icon:'🍵', iconAnim:'icon-bounce', image:'https://images.unsplash.com/photo-1544634076-a90160ddf44e?w=600', link:'/destinations/east-india',   count:'18+ Resorts',    color:'#6c63ff' },
  { title:'West India',   icon:'🏖️', iconAnim:'icon-pulse',  image:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', link:'/destinations/west-india',   count:'22+ Resorts',    color:'#f0a500' },
  { title:'International',icon:'🌍', iconAnim:'icon-spin',   image:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', link:'/destinations/international',count:'50+ Properties', color:'#ff6b6b' },
];

const stats = [
  { number:'200+',    label:'Properties',      icon:'🏨', color:'#0077C8', anim:'icon-bounce' },
  { number:'15+',     label:'Years Experience', icon:'🏆', color:'#f0a500', anim:'icon-pulse'  },
  { number:'50,000+', label:'Happy Members',    icon:'😊', color:'#00d2aa', anim:'icon-wobble' },
  { number:'15+',     label:'Countries',        icon:'🌍', color:'#6c63ff', anim:'icon-float'  },
];

const whyUs = [
  { icon:'🏆', anim:'', title:'Award Winning',       desc:"Recognized as India's Best Holiday Club for 5 consecutive years", color:'#f0a500', bg:'linear-gradient(135deg,#fff9e6,#fff3cc)' },
  { icon:'💎', anim:'', title:'Premium Properties',  desc:'200+ handpicked luxury resorts across India and 15+ countries',   color:'#0077C8', bg:'linear-gradient(135deg,#e8f4ff,#dbeeff)' },
  { icon:'🎯', anim:'', title:'Tailored Experiences', desc:'Personalized holiday packages crafted just for your family',        color:'#ff6b6b', bg:'linear-gradient(135deg,#fff0f0,#ffe4e4)' },
  { icon:'🛡️', anim:'', title:'Guaranteed Value',    desc:'Best price guarantee with flexible cancellation policies',          color:'#00d2aa', bg:'linear-gradient(135deg,#e6fff9,#ccfff0)' },
  { icon:'📞', anim:'', title:'24/7 Concierge',      desc:'Round-the-clock support for all your holiday needs',                color:'#6c63ff', bg:'linear-gradient(135deg,#f0eeff,#e4deff)' },
  { icon:'✈️', anim:'', title:'Complete Holiday',     desc:'From booking to return — we handle every detail',                  color:'#ff9f43', bg:'linear-gradient(135deg,#fff4e6,#ffe8cc)' },
];

const testimonials = [
  { name:'Rajesh Sharma', city:'New Delhi', rating:5, text:'My Holiday Club has transformed the way our family vacations. The properties are stunning and the service is impeccable!', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', accent:'#0077C8' },
  { name:'Priya Mehta',   city:'Mumbai',    rating:5, text:'Best investment we made! Three years of membership and every holiday has been memorable. The Maldives trip was absolutely magical.', img:'https://images.unsplash.com/photo-1494790108755-2616b612b648?w=100', accent:'#6c63ff' },
  { name:'Arun Kumar',    city:'Bangalore', rating:5, text:'Exceptional value for money. The variety of destinations and the quality of resorts make MHC the best holiday club in India.', img:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', accent:'#00d2aa' },
];

const Home = ({ onMemberClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  return (
    <div style={{ position:'relative' }}>

      {/* FLOATING BACKGROUND PARTICLES */}
      <div className="bg-particles" aria-hidden="true">
        {Array.from({ length:10 }, (_, i) => <div key={i} className="particle" />)}
      </div>

      <style>{`
        @keyframes slideInText { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scrollPulse { 0%,100%{opacity:0.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.3)} }
        @keyframes arrowSlide  { 0%,100%{transform:translateX(0)} 50%{transform:translateX(6px)} }
        @keyframes gradientFlow{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes float       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .dest-img { transition: transform 0.5s ease; }
        .dest-card:hover .dest-img { transform: scale(1.08) !important; }
        .arrow-anim { display:inline-block; animation:arrowSlide 1.2s ease-in-out infinite; }
        .why-card { transition:all 0.35s cubic-bezier(0.4,0,0.2,1); }
        .why-card:hover { transform:translateY(-8px) scale(1.02); }
        .pkg-row { transition:all 0.3s ease; margin-bottom:12px; }
        .pkg-row:hover { transform:translateX(10px); }
        .stat-card { transition:all 0.3s; cursor:default; }
        .stat-card:hover { transform:translateY(-4px); }
      `}</style>

      {/* ===== HERO SLIDER ===== */}
      <div style={{ position:'relative', height:'100vh', overflow:'hidden' }}>
        {slides.map((slide, i) => (
          <div key={i} style={{ position:'absolute', inset:0, opacity:i===currentSlide?1:0, transition:'opacity 1.2s ease', zIndex:i===currentSlide?1:0 }}>
            <img src={slide.image} alt={slide.title} style={{ width:'100%', height:'100%', objectFit:'cover', transform:i===currentSlide?'scale(1.05)':'scale(1)', transition:'transform 8s ease' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(0,0,0,0.78) 0%,rgba(0,0,0,0.3) 60%,transparent 100%)' }} />
          </div>
        ))}

        <div className="container" style={{ position:'absolute', inset:0, zIndex:2, display:'flex', alignItems:'center' }}>
          <div style={{ maxWidth:'660px', color:'white' }}>
            <div style={{
              display:'inline-block', padding:'7px 22px',
              background:'linear-gradient(135deg,rgba(240,165,0,0.95),rgba(255,107,107,0.9))',
              borderRadius:'50px', fontSize:'0.85rem', fontWeight:700,
              letterSpacing:'2px', textTransform:'uppercase', marginBottom:'20px',
              boxShadow:'0 4px 15px rgba(240,165,0,0.4)'
            }}>{slides[currentSlide].subtitle}</div>

            <h1 key={currentSlide} style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.8rem,6vw,5.5rem)', fontWeight:800, lineHeight:1.05, marginBottom:'20px', animation:'slideInText 0.8s ease', textShadow:'0 2px 20px rgba(0,0,0,0.3)' }}>
              {slides[currentSlide].title}
            </h1>
            <p key={`d-${currentSlide}`} style={{ fontSize:'1.2rem', opacity:0.92, lineHeight:1.7, marginBottom:'36px', animation:'slideInText 0.8s ease 0.2s both', textShadow:'0 1px 8px rgba(0,0,0,0.3)' }}>
              {slides[currentSlide].desc}
            </p>
            <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
              <Link to={slides[currentSlide].link} className="btn-primary" style={{ fontSize:'1rem', padding:'14px 32px' }}>
                <span className="icon-float" style={{ display:'inline-block' }}>🗺️</span> {slides[currentSlide].cta}
              </Link>
              <button onClick={onMemberClick} className="btn-gold" style={{ fontSize:'1rem', padding:'14px 32px' }}>
                <span className="icon-pulse" style={{ display:'inline-block' }}>⭐</span> Become a Member
              </button>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div style={{ position:'absolute', bottom:'40px', left:'50%', transform:'translateX(-50%)', zIndex:2, display:'flex', gap:'10px' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => { setCurrentSlide(i); setAutoPlay(false); }} style={{
              width:i===currentSlide?'36px':'10px', height:'10px', borderRadius:'5px', border:'none', cursor:'pointer',
              background:i===currentSlide?'linear-gradient(90deg,#f0a500,#ff6b6b)':'rgba(255,255,255,0.5)',
              transition:'all 0.4s ease', boxShadow:i===currentSlide?'0 2px 10px rgba(240,165,0,0.5)':'none'
            }} />
          ))}
        </div>

        {/* Arrow buttons */}
        {['←','→'].map((arrow, i) => (
          <button key={i}
            onClick={() => { setCurrentSlide(p => i===0?(p-1+slides.length)%slides.length:(p+1)%slides.length); setAutoPlay(false); }}
            style={{ position:'absolute', top:'50%', [i===0?'left':'right']:'24px', transform:'translateY(-50%)', zIndex:2, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.35)', color:'white', width:'52px', height:'52px', borderRadius:'50%', cursor:'pointer', fontSize:'1.1rem', fontWeight:'bold', transition:'all 0.3s', display:'flex', alignItems:'center', justifyContent:'center' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.32)'; e.currentTarget.style.transform='translateY(-50%) scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.18)'; e.currentTarget.style.transform='translateY(-50%) scale(1)'; }}
          >{arrow}</button>
        ))}

        <div style={{ position:'absolute', bottom:'24px', right:'40px', zIndex:2, color:'rgba(255,255,255,0.6)', fontSize:'0.75rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
          <div style={{ width:'1px', height:'40px', background:'rgba(255,255,255,0.4)', animation:'scrollPulse 2s ease infinite' }} />
          <span style={{ letterSpacing:'2px' }}>SCROLL</span>
        </div>
      </div>

      {/* ===== STATS BAR ===== */}
      <div style={{ background:'linear-gradient(135deg,#0a1628 0%,#1a1a2e 60%,#0d1f3c 100%)', padding:'44px 0', position:'relative', overflow:'hidden' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px', textAlign:'center' }}>
            {stats.map((s, i) => (
              <AnimatedSection key={i} delay={i*0.1}>
                <div className="stat-card" style={{ padding:'22px 12px', borderRadius:'18px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.09)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                >
                  <div className={s.anim} style={{ fontSize:'2.2rem', marginBottom:'8px', display:'block' }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:800, background:`linear-gradient(135deg,${s.color},white)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{s.number}</div>
                  <div style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.65)', letterSpacing:'0.5px', marginTop:'4px' }}>{s.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* ===== DESTINATIONS ===== */}
      <section style={{ padding:'90px 0', background:'linear-gradient(180deg,#f0f4ff 0%,#f8faff 100%)' }}>
        <div className="container">
          <AnimatedSection>
            <div style={{ textAlign:'center', marginBottom:'60px' }}>
              <div className="badge" style={{ marginBottom:'16px' }}>
                <span className="icon-bounce" style={{ display:'inline-block', marginRight:'6px' }}>✈️</span>Our Destinations
              </div>
              <h2 className="section-title">
                Explore <span style={{ background:'linear-gradient(135deg,#0077C8,#6c63ff,#00d2aa)', backgroundSize:'300% 300%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'gradientFlow 4s ease infinite' }}>India & Beyond</span>
              </h2>
              <p className="section-subtitle" style={{ margin:'0 auto' }}>From the majestic Himalayas to tropical beaches — discover our curated collection of premium holiday destinations.</p>
            </div>
          </AnimatedSection>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'24px' }}>
            {destinations.map((dest, i) => (
              <AnimatedSection key={i} delay={i*0.1}>
                <Link to={dest.link} style={{ textDecoration:'none', display:'block' }}>
                  <div className="dest-card" style={{ borderRadius:'20px', overflow:'hidden', boxShadow:'0 6px 24px rgba(0,0,0,0.1)', background:'white', border:'2px solid transparent', transition:'all 0.35s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=dest.color+'60'; e.currentTarget.style.boxShadow=`0 14px 44px ${dest.color}30`; e.currentTarget.style.transform='translateY(-8px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.boxShadow='0 6px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform='translateY(0)'; }}
                  >
                    <div style={{ position:'relative', height:'210px', overflow:'hidden' }}>
                      <img src={dest.image} alt={dest.title} className="dest-img" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top,${dest.color}dd 0%,transparent 55%)` }} />
                      <div style={{ position:'absolute', bottom:'16px', left:'16px', color:'white' }}>
                        <span className={dest.iconAnim} style={{ fontSize:'2.2rem', display:'block', marginBottom:'4px' }}>{dest.icon}</span>
                        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.25rem', fontWeight:700 }}>{dest.title}</h3>
                        <p style={{ fontSize:'0.8rem', opacity:0.9 }}>{dest.count}</p>
                      </div>
                    </div>
                    <div style={{ padding:'16px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ color:dest.color, fontWeight:700, fontSize:'0.9rem' }}>Explore Now</span>
                      <span className="arrow-anim" style={{ color:dest.color, fontSize:'1.3rem', fontWeight:'bold' }}>→</span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section style={{ padding:'90px 0', background:'white', position:'relative', overflow:'hidden', zIndex:2, isolation:'isolate' }}>
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <AnimatedSection>
            <div style={{ textAlign:'center', marginBottom:'60px' }}>
              <div className="badge" style={{ marginBottom:'16px' }}>
                <span className="icon-pulse" style={{ display:'inline-block', marginRight:'6px' }}>💡</span>Why Choose Us
              </div>
              <h2 className="section-title">The <span style={{ background:'linear-gradient(135deg,#0077C8,#6c63ff,#00d2aa)', backgroundSize:'300% 300%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'gradientFlow 4s ease infinite' }}>My Holiday Club</span> Advantage</h2>
              <p className="section-subtitle" style={{ margin:'0 auto' }}>We don't just book holidays — we create lifelong memories with premium service at every step.</p>
            </div>
          </AnimatedSection>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'24px' }}>
            {whyUs.map((item, i) => (
              <AnimatedSection key={i} delay={i*0.1}>
                <div className="why-card" style={{ padding:'32px', borderRadius:'20px', background:item.bg, border:`2px solid ${item.color}20`, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'4px', background:`linear-gradient(90deg,${item.color},transparent)`, borderRadius:'20px 20px 0 0' }} />
                  <span className={item.anim} style={{ fontSize:'3rem', marginBottom:'16px', display:'block' }}>{item.icon}</span>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:'#1a1a2e', marginBottom:'10px', fontWeight:700 }}>{item.title}</h3>
                  <p style={{ color:'#4b5563', lineHeight:1.7, fontSize:'0.95rem' }}>{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PACKAGES TEASER ===== */}
      <section style={{ padding:'90px 0', background:'linear-gradient(135deg,#0a1628 0%,#1a1a2e 50%,#16213e 100%)', color:'white', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-120px', right:'-120px', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,119,200,0.15) 0%,transparent 70%)', animation:'float 8s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle,rgba(108,99,255,0.12) 0%,transparent 70%)', animation:'float 10s ease-in-out infinite 2s', pointerEvents:'none' }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <AnimatedSection>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px', alignItems:'center' }}>
              <div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 18px', background:'rgba(240,165,0,0.2)', borderRadius:'50px', color:'#f0a500', fontSize:'0.85rem', fontWeight:700, marginBottom:'24px', border:'1px solid rgba(240,165,0,0.3)' }}>
                  <span className="icon-pulse" style={{ display:'inline-block' }}>⭐</span> Membership Plans
                </div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,4vw,3rem)', marginBottom:'20px', lineHeight:1.2 }}>
                  Invest in Memories,<br />
                  <span style={{ background:'linear-gradient(135deg,#f0a500,#ff6b6b)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Not Just Holidays</span>
                </h2>
                <p style={{ color:'rgba(255,255,255,0.75)', lineHeight:1.9, marginBottom:'36px', fontSize:'1.05rem' }}>Our membership plans give you exclusive access to 200+ premium properties at member-only prices. Travel more, spend less, experience the extraordinary.</p>
                <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
                  <Link to="/packages" className="btn-primary">
                    <span className="icon-bounce" style={{ display:'inline-block' }}>📋</span> View All Plans
                  </Link>
                  <button onClick={onMemberClick} className="btn-gold">
                    <span className="icon-wobble" style={{ display:'inline-block' }}>🌟</span> Join Now
                  </button>
                </div>
              </div>
              <div>
                {[
                  { name:'Holiday Starter', price:'₹2,99,999', nights:'3 Nights / 4 Days',   color:'#0077C8', icon:'🌤️', anim:'icon-float'  },
                  { name:'Holiday Classic', price:'₹4,99,999', nights:'7 Nights / 8 Days',   color:'#f0a500', icon:'☀️', anim:'icon-pulse'  },
                  { name:'Holiday Premium', price:'₹7,99,999', nights:'14 Nights / 15 Days', color:'#00d2aa', icon:'🌟', anim:'icon-bounce' },
                ].map((pkg, i) => (
                  <div key={i} className="pkg-row" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'22px 28px', borderRadius:'16px', background:'rgba(255,255,255,0.06)', border:`1px solid ${pkg.color}30` }}
                    onMouseEnter={e => { e.currentTarget.style.background=`${pkg.color}18`; e.currentTarget.style.borderColor=`${pkg.color}60`; }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor=`${pkg.color}30`; }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                      <span className={pkg.anim} style={{ fontSize:'2rem', display:'inline-block' }}>{pkg.icon}</span>
                      <div>
                        <div style={{ fontWeight:700, marginBottom:'4px', fontSize:'1rem' }}>{pkg.name}</div>
                        <div style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.55)' }}>{pkg.nights}</div>
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ color:pkg.color, fontWeight:800, fontSize:'1.15rem' }}>{pkg.price}</div>
                      <Link to="/packages" style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.8rem', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'4px' }}>
                        Know more <span className="arrow-anim" style={{ display:'inline-block' }}>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{ padding:'90px 0', background:'linear-gradient(180deg,#f8faff 0%,#f0f4ff 100%)' }}>
        <div className="container">
          <AnimatedSection>
            <div style={{ textAlign:'center', marginBottom:'60px' }}>
              <div className="badge" style={{ marginBottom:'16px' }}>
                <span className="icon-pulse" style={{ display:'inline-block', marginRight:'6px' }}>💬</span>Testimonials
              </div>
              <h2 className="section-title">What Our <span style={{ background:'linear-gradient(135deg,#0077C8,#6c63ff,#00d2aa)', backgroundSize:'300% 300%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'gradientFlow 4s ease infinite' }}>Members Say</span></h2>
            </div>
          </AnimatedSection>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:'28px' }}>
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i*0.15}>
                <div style={{ padding:'32px', background:'white', borderRadius:'20px', boxShadow:`0 8px 30px ${t.accent}15`, position:'relative', overflow:'hidden', border:`1px solid ${t.accent}20`, transition:'all 0.3s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow=`0 16px 50px ${t.accent}28`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 8px 30px ${t.accent}15`; }}
                >
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'4px', background:`linear-gradient(90deg,${t.accent},transparent)` }} />
                  <div style={{ fontSize:'3rem', color:t.accent, marginBottom:'16px', opacity:0.25, fontFamily:'serif', lineHeight:1 }}>"</div>
                  <p style={{ color:'#4b5563', lineHeight:1.8, marginBottom:'24px', fontStyle:'italic', fontSize:'0.97rem' }}>{t.text}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <img src={t.img} alt={t.name} style={{ width:'50px', height:'50px', borderRadius:'50%', objectFit:'cover', border:`3px solid ${t.accent}50` }} />
                    <div>
                      <div style={{ fontWeight:700, color:'#1a1a2e', fontSize:'0.95rem' }}>{t.name}</div>
                      <div style={{ fontSize:'0.82rem', color:'#6b7280' }}>{t.city}</div>
                    </div>
                    <div style={{ marginLeft:'auto', color:'#f0a500', fontSize:'1rem', letterSpacing:'2px' }}>{'★'.repeat(t.rating)}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{ padding:'90px 0', background:'linear-gradient(135deg,#0077C8 0%,#6c63ff 50%,#00d2aa 100%)', backgroundSize:'300% 300%', animation:'gradientFlow 6s ease infinite', color:'white', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', left:'10%', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-40px', right:'8%', width:'150px', height:'150px', borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <AnimatedSection>
            <div style={{ fontSize:'3.5rem', marginBottom:'20px' }}>
              <span className="icon-float"  style={{ display:'inline-block' }}>🌴</span>
              <span className="icon-bounce" style={{ display:'inline-block', margin:'0 12px' }}>✈️</span>
              <span className="icon-float"  style={{ display:'inline-block', animationDelay:'0.5s' }}>🏖️</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,4vw,3.5rem)', marginBottom:'20px', textShadow:'0 2px 20px rgba(0,0,0,0.2)' }}>Ready to Start Your Journey?</h2>
            <p style={{ fontSize:'1.15rem', opacity:0.92, marginBottom:'40px', maxWidth:'600px', margin:'0 auto 40px', lineHeight:1.7 }}>Join 50,000+ happy members who trust My Holiday Club for their dream holidays.</p>
            <div style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={onMemberClick} style={{
                padding:'16px 44px', background:'white', color:'#0077C8', border:'none',
                borderRadius:'50px', fontWeight:800, fontSize:'1.05rem', cursor:'pointer',
                transition:'all 0.3s', boxShadow:'0 8px 30px rgba(0,0,0,0.2)',
                display:'inline-flex', alignItems:'center', gap:'8px', fontFamily:"'Poppins',sans-serif"
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px) scale(1.04)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0) scale(1)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(0,0,0,0.2)'; }}
              >
                <span className="icon-pulse" style={{ display:'inline-block' }}>⭐</span> Become a Member Today
              </button>
              <Link to="/contact" style={{
                padding:'16px 44px', background:'rgba(255,255,255,0.18)', color:'white',
                border:'2px solid rgba(255,255,255,0.5)', borderRadius:'50px', fontWeight:700,
                textDecoration:'none', fontSize:'1.05rem', transition:'all 0.3s',
                display:'inline-flex', alignItems:'center', gap:'8px', backdropFilter:'blur(4px)'
              }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.28)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.18)'; e.currentTarget.style.transform='translateY(0)'; }}
              >
                <span className="icon-wobble" style={{ display:'inline-block' }}>📞</span> Talk to Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
