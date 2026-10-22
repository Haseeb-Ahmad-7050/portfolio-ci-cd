import {useEffect,useRef,useState} from 'react'
import {EMAIL,ROLES,TECH,NAV,SKILLS,PROJECTS} from './data.js'

const raf=fn=>{let p=0;return e=>{if(p)return;p=requestAnimationFrame(()=>{p=0;fn(e)})}}
const letters=s=>[...s].map((c,i)=><span key={i}>{c}</span>)
// pause infinite animations while off-screen
function usePause(ref){useEffect(()=>{const el=ref.current,io=new IntersectionObserver(([e])=>el.classList.toggle('off',!e.isIntersecting));io.observe(el);return()=>io.disconnect()},[ref])}

function Clock(){
  const r=useRef()
  useEffect(()=>{
    const f=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Karachi',hour:'2-digit',minute:'2-digit',second:'2-digit'})
    const t=()=>{if(!document.hidden)r.current.textContent='Lahore '+f.format(new Date())};t()
    const id=setInterval(t,1000);return()=>clearInterval(id)
  },[])
  return <span ref={r}>Lahore</span>
}

function Nav(){
  const bar=useRef(),[on,setOn]=useState(-1)
  useEffect(()=>{
    const secs=NAV.map(id=>document.getElementById(id));let last=-1
    const h=raf(()=>{
      const d=document.documentElement
      bar.current.style.transform=`scaleX(${scrollY/(d.scrollHeight-innerHeight)||0})`
      let a=-1;secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.4)a=i})
      if(a!==last){last=a;setOn(a)}
    })
    addEventListener('scroll',h,{passive:true});h()
    return()=>removeEventListener('scroll',h)
  },[])
  return <>
    <div id="prog" ref={bar}/>
    <nav><div className="wrap">
      <a href="#top" className="logo">HASEEB<i>.</i>DEV</a>
      <div className="links">{NAV.map((id,i)=><a key={id} href={'#'+id} className={on===i?'on':''}>{id[0].toUpperCase()+id.slice(1)}</a>)}</div>
      <div className="clock"><b/><Clock/></div>
    </div></nav>
  </>
}

function Cursor(){
  const r=useRef()
  useEffect(()=>{
    if(!matchMedia('(pointer:fine)').matches)return
    const h=raf(e=>{const c=r.current;c.style.left=e.x+'px';c.style.top=e.y+'px';c.classList.toggle('h',!!e.t?.closest('a,button,.ac,.st,.ex'))})
    const m=e=>h({x:e.clientX,y:e.clientY,t:e.target})
    addEventListener('mousemove',m,{passive:true});return()=>removeEventListener('mousemove',m)
  },[])
  return <div id="cur" ref={r}/>
}

function Role(){
  const r=useRef()
  useEffect(()=>{
    let i=0,t;const el=r.current
    const id=setInterval(()=>{if(document.hidden)return;el.style.opacity=0;t=setTimeout(()=>{el.textContent=ROLES[i=++i%ROLES.length];el.style.opacity=1},250)},2600)
    return()=>{clearInterval(id);clearTimeout(t)}
  },[])
  return <span className="w" ref={r} style={{transition:'opacity .25s'}}>{ROLES[0]}</span>
}

function Hero(){
  const h=useRef();usePause(h)
  useEffect(()=>{
    const el=h.current,f=raf(e=>{const b=el.getBoundingClientRect();el.style.setProperty('--mx',e.x-b.left+'px');el.style.setProperty('--my',e.y-b.top+'px')})
    const m=e=>f({x:e.clientX,y:e.clientY});el.addEventListener('mousemove',m,{passive:true});return()=>el.removeEventListener('mousemove',m)
  },[])
  return <header className="hero" id="top" ref={h}>
    <div className="dots"/><div className="dots2"/>
    <div className="reg" style={{left:28,top:90}}/><div className="reg" style={{right:28,top:90}}/><div className="reg" style={{left:28,bottom:30}}/><div className="reg" style={{right:28,bottom:30}}/>
    <div className="wrap">
      <div className="tag"><b/>Open to summer internships</div>
      <h1>{letters('Muhammad')}<br/><em>{letters('Haseeb')}</em>{' '}{letters('Ahmad')}</h1>
      <div className="role">MERN stack developer who builds <Role/></div>
      <p className="lede">Final-year CS student in Lahore. I build full-stack apps and ship them.</p>
      <div className="cta"><a className="btn f" href="#projects">View projects →</a><a className="btn" href="#contact">Get in touch</a></div>
    </div>
    <svg className="badge" viewBox="0 0 150 150"><defs><path id="c" d="M75 75m-58 0a58 58 0 1 1 116 0a58 58 0 1 1-116 0"/></defs><text><textPath href="#c">OPEN TO INTERNSHIPS • LAHORE • 2026 •</textPath></text><path d="M65 75h20M75 65v20" stroke="#ff5a1f"/></svg>
  </header>
}

function Marquee(){
  const r=useRef();usePause(r)
  const items=[0,1].flatMap(n=>[...TECH,...TECH].flatMap((t,i)=>[<span key={`${n}s${i}`}>{t}</span>,<i key={`${n}i${i}`}>✦</i>]))
  return <div className="mq" ref={r}><div>{items}</div></div>
}

function Count({n,children}){
  const r=useRef()
  useEffect(()=>{
    const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;io.disconnect()
      const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1200);r.current.textContent=Math.round(n*(1-(1-k)**3))+(n===3?'+':'');k<1&&requestAnimationFrame(f)})(t0)},{threshold:.15})
    io.observe(r.current);return()=>io.disconnect()
  },[n])
  return <b ref={r}>0</b>
}

function Skills(){
  const [k,setK]=useState('Frontend')
  return <div className="sk rv">
    <div className="tabs">{Object.keys(SKILLS).map(x=><button key={x} className={x===k?'on':''} onMouseEnter={()=>setK(x)} onClick={()=>setK(x)}>{x}<span>{SKILLS[x].length}</span></button>)}</div>
    <div className="items">{SKILLS[k].map((x,i)=><div key={k+x} style={{animationDelay:i*60+'ms'}}>{x}</div>)}</div>
  </div>
}

function Projects(){
  const [o,setO]=useState(0)
  return <div className="pj rv">{PROJECTS.map((p,i)=>
    <div key={p[0]} className={'row'+(o===i?' open':'')}>
      <button className="rh" onClick={()=>setO(o===i?-1:i)}><i>0{i+1}</i><h3>{p[0]}</h3><time>{p[1]}</time><u/></button>
      <div className="bd"><div><div className="bi">
        <div><h4>{p[2]}</h4><p>{p[3]}</p><div className="chips">{p[4].map(c=><span key={c}>{c}</span>)}</div></div>
        <div className="art" dangerouslySetInnerHTML={{__html:p[5]}}/>
      </div></div></div>
    </div>)}</div>
}

function Contact(){
  const [s,setS]=useState(false)
  const copy=e=>{e.preventDefault();try{navigator.clipboard.writeText(EMAIL)}catch{}setS(true);setTimeout(()=>setS(false),1800)}
  return <>
    <section id="contact" className="ct"><div className="wrap">
      <div className="rv"><small style={{color:'var(--ac)'}}>06 / LET’S BUILD SOMETHING</small></div>
      <h2 className="rv" style={{marginTop:14}}>Let’s work <em>together</em></h2>
      <p className="rv">Looking for a summer internship. Say hello.</p>
      <div className="rv"><a className="mail" href={'mailto:'+EMAIL} onClick={copy}>{EMAIL}</a><div className="hint">click to copy</div></div>
      <div className="meta rv"><span>+92 347 2567461</span><a href="https://linkedin.com/in/haseeb-ahmad1482842bb" target="_blank" rel="noopener noreferrer">linkedin.com/in/haseeb-ahmad1482842bb</a><span>Lahore, Pakistan</span></div>
      <footer>Designed &amp; built by Muhammad Haseeb Ahmad · 2026</footer>
    </div></section>
    <div id="toast" className={s?'s':''}>Email copied to clipboard</div>
  </>
}

const Head=({n,a,b})=><div className="sh rv"><small>{n} /</small><h2>{a} <em>{b}</em></h2></div>

export default function App(){
  useEffect(()=>{
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15})
    document.querySelectorAll('.rv').forEach(e=>io.observe(e));return()=>io.disconnect()
  },[])
  return <>
    <Cursor/><Nav/><Hero/><Marquee/>
    <section id="about"><div className="wrap">
      <Head n="01" a="About" b="me"/>
      <div className="ab">
        <div className="rv">
          <p>I’m a Computer Science student at <b>Riphah International University</b>. I learn best by building things people actually use.</p>
          <p>So far I’ve built a design tool and a client website. Now I’m working on an offline <b>RAG</b> assistant for my final-year project, and looking for a summer internship.</p>
        </div>
        <div className="stats rv hatch">
          <div className="st"><Count n={3}/><span>Shipped projects</span></div>
          <div className="st"><Count n={2026}/><span>Graduating</span></div>
          <div className="st"><b style={{fontSize:34}}>Lahore, PK</b><span>Based in</span></div>
        </div>
      </div>
    </div></section>

    <section id="skills" className="hatch"><div className="wrap"><Head n="02" a="Technical" b="skills"/><Skills/></div></section>

    <section id="experience"><div className="wrap">
      <Head n="03" a="Where I’ve" b="worked"/>
      <div className="ex rv">
        <div><h3>Full-Stack Web Development Intern</h3><p>INTERBOOT Internship Group</p></div><time>Jul — Nov</time>
        <svg viewBox="0 0 100 100" fill="none" stroke="#ff5a1f"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="32"/><circle cx="50" cy="50" r="18"/><path d="M4 50h92M50 4v92"/></svg>
      </div>
    </div></section>

    <section id="projects"><div className="wrap">
      <Head n="04" a="Selected" b="work"/>
      <Projects/>
      <div className="also rv"><h4>— ALSO BUILT</h4><div className="ag">
        <div className="ac"><h5>Digital Persona Twin</h5><p>An offline chatbot that copies how one person texts.</p></div>
        <div className="ac"><h5>Text-to-Slides Generator</h5><p>Turns text into slides, with a mobile app.</p></div>
      </div></div>
    </div></section>

    <section id="edu" className="hatch"><div className="wrap">
      <Head n="05" a="Education &" b="certifications"/>
      <div className="ed rv">
        <div className="bx" style={{background:'var(--bg)'}}><h3>BS Computer Science</h3><div className="ac2">Riphah International University</div><small>2023 — Present</small></div>
        <div className="bx" style={{background:'var(--bg)'}}><h3>Certifications</h3><ul style={{marginTop:14,padding:0}}><li>Cisco — JavaScript Essentials 1 &amp; 2</li><li>Cisco — C++ Essentials 1 &amp; 2</li><li>AWS Academy — Cloud Foundations</li><li>AWS Academy — Cloud Architecture &amp; Learner Lab</li></ul></div>
      </div>
    </div></section>

    <Contact/>
  </>
}
