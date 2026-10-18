import React, {useEffect,useMemo,useRef,useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Volume2,VolumeX,RotateCcw,ArrowRight,Heart,Skull,ChevronRight} from 'lucide-react'
import {chapters,displayNames,fights,type Character,type Step,type Scene,type Choice} from './story'
import './style.css'

type Phase = 'title'|'story'|'choice'|'attack'|'final'
type Attack = 'boss1'|'boss2'|'boss3'|'proposal'|'marriage'
const asset = (name:Character, mood?:string) => {
 if(name==='friend') return '/assets/friend.webp'
 if(name==='amanda') return '/assets/amanda.webp'
 if(mood && name==='kaarija' && ['happy','angry','shocked','sassy'].includes(mood)) return `/assets/${name}-${mood}.webp`
 return `/assets/${name}.webp`
}
const portrait = (name?:Character, text='') => {
 if(!name || ['mystery','officiant','women'].includes(name)) return null
 const lower=text.toLowerCase()
 const mood= /what the fuck|what\?!|oh my|what\?|erika vikman|you what/.test(lower) ? 'shocked' :
 /fuck you|fuck off|bitch|disgust|don't|shut|creep|sorry|stop|idiot|warning|pig/.test(lower) ? 'angry' :
 /haha|love|yes|happy|cha cha|oops|fair|smiles|promise|birthday/.test(lower) ? 'happy' : undefined
 return asset(name,mood)
}

function App(){
 const [phase,setPhase]=useState<Phase>('title')
 const [chapter,setChapter]=useState(0)
 const [index,setIndex]=useState(0)
 const [queue,setQueue]=useState<Step[]>([])
 const [qIndex,setQIndex]=useState(0)
 const [active,setActive]=useState<Attack|null>(null)
 const [sound,setSound]=useState(false)
 const [visible,setVisible]=useState(0)
 const [hit,setHit]=useState(false)
 const [effects,setEffects]=useState('')
 const audio=useRef<AudioContext|null>(null)
 const steps=chapters[chapter]?.steps ?? []
 const step=phase==='attack'?queue[qIndex]:steps[index]
 const scene:Scene=chapters[chapter]?.scene??'bar'
 const speaker=step?.speaker
 const left:Character='vendela'
 // Reveal each character only when the story actually introduces them.
 // During attack sequences keep the boss visible until the FATALITY, then hide them.
 const inFight = phase==='choice' || (phase==='attack' && active!==null && active in fights)
 const isEpilogue = phase==='attack' && active===null
 const attackReachedFatality = phase==='attack' && queue.slice(0,qIndex+1).some(s=>s.special==='fatality')
 // Once the kick launches him, the Fuckboy stays off-screen for the rest of the attack.
 const isBallBusterFlight = phase==='attack' && active==='boss1' &&
   queue.some((s,i)=>i<=qIndex && s.text==='WHOOSH!')
 const bossDefeated = isEpilogue || attackReachedFatality || isBallBusterFlight
 const chapterBoss:Character|undefined = chapter===0?'fuckboy':chapter===1?'perv':chapter===2?'creep':undefined
 // Introductions happen on the first relevant line, never at the start of a chapter.
 const bossIntroduced = chapter===0 ? index>=4 : chapter===1 ? index>=1 : chapter===2 ? index>=5 : false
 const flightStart = isBallBusterFlight && step?.text==='WHOOSH!'
 const right:Character|undefined = chapter<=2
   ? (phase==='story' && chapter===0 && index<3 ? 'amanda' :
      (!bossDefeated || flightStart) && (inFight || (phase==='story' && bossIntroduced)) ? chapterBoss : undefined)
   : chapter===3 ? (index>=10 ? 'kaarija' : undefined)
   : chapter===4 ? (index>=28?'amanda':index>=19?'erika':index>=10?'kaarija':index>=3&&index<=9?'amanda':'kaarija') : undefined
 const mysteryRight = chapter===3 && phase==='story' && index>=4 && index<10
 const launched = isBallBusterFlight || bossDefeated
 const text=step?.text??''
 const complete=visible>=text.length
 const choiceOptions:Choice[]=useMemo(()=>{
  if(!active)return []
  if(active in fights)return fights[active as keyof typeof fights].choices
  if(active==='proposal')return ['YES','ABSOLUTELY','CHA CHA CHA'].map(label=>({label,steps:[{text:'WEDDING UNLOCKED!',special:'wedding'}]}))
  return ['YES','OBVIOUSLY','ICH KOMME!'].map(label=>({label,steps:[{text:'THROUPLE ENDING UNLOCKED!',special:'ending'}]}))
 },[active])
 const beep=(freq=420,duration=.055)=>{
  if(!sound)return
  try{const ctx=audio.current??new AudioContext();audio.current=ctx;const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type='square';osc.frequency.value=freq;gain.gain.setValueAtTime(.022,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration)}catch{/* sound optional */}
 }
 useEffect(()=>{setVisible(0);if(!step)return;let count=0;const timer=window.setInterval(()=>{count=Math.min(step.text.length,count+2);setVisible(count);if(count%8===0&&step.speaker)beep(360+(count%4)*40,.022);if(count>=step.text.length)clearInterval(timer)},24);return()=>clearInterval(timer)},[chapter,index,phase,qIndex,queue,step?.text])
 useEffect(()=>{if(step?.effect){setEffects(step.effect);const t=setTimeout(()=>setEffects(''),520);return()=>clearTimeout(t)}},[step])
 const reset=()=>{setPhase('title');setChapter(0);setIndex(0);setQueue([]);setQIndex(0);setActive(null);setHit(false)}
 const advanceStory=()=>{
  if(step?.action){setActive(step.action);setPhase('choice');beep(640,.12);return}
  if(index<steps.length-1){setIndex(i=>i+1);return}
  if(chapter<chapters.length-1){setChapter(c=>c+1);setIndex(0);return}
  setPhase('final')
 }
 const next=()=>{
  if(phase==='title'){setPhase('story');beep(600,.12);return}
  if(phase==='final'){reset();return}
  if(phase==='choice')return
  if(!complete){setVisible(text.length);return}
  beep(520,.025)
  if(phase==='attack'){
   if(qIndex<queue.length-1){setQIndex(q=>q+1);return}
   if(active==='marriage'){setPhase('final');setActive(null);return}
   if(active==='proposal'){setActive(null);setPhase('story');setChapter(4);setIndex(0);return}
   if(active && active in fights){const fight=fights[active as keyof typeof fights];setQueue(fight.after);setQIndex(0);setActive(null);setPhase('attack');setHit(false);return}
   setPhase('story');return
  }
  advanceStory()
 }
 const pick=(choice:Choice)=>{
  if(!active)return
  setQueue(choice.steps);setQIndex(0);setPhase('attack');setHit(true);beep(220,.17)
 }
 // After a boss's epilogue, move to the next chapter instead of repeating the boss.
 const epilogue=phase==='attack'&&!active
 const nextRef=useRef(next);nextRef.current=next
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key===' '||e.key==='Enter'){if(e.target instanceof HTMLButtonElement)return;e.preventDefault();nextRef.current()}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[])
 const nextWithEpilogue=()=>{
  if(epilogue&&complete&&qIndex===queue.length-1){setPhase('story');setChapter(c=>Math.min(c+1,4));setIndex(0);setQueue([]);setHit(false);return}
  next()
 }
 nextRef.current=nextWithEpilogue
 const isFatality=step?.special==='fatality';const isWedding=step?.special==='wedding';const isEnding=step?.special==='ending'
 const currentBoss=active&&active in fights?fights[active as keyof typeof fights]:null
 return <div className={`app scene-${scene} effect-${effects}`}>
  <div className="noise"/>
  <header className="topbar"><div className="brand">♥ <span>KILL, MARRY, <em>KÄÄRIJÄ</em></span> ♥</div><div className="top-actions"><span className="chapter-count">{phase==='title'?'INSERT COIN':phase==='final'?'GAME CLEAR':`CHAPTER ${String(chapter+1).padStart(2,'0')} / 05`}</span><button className="icon-button" onClick={()=>setSound(s=>!s)} aria-label={sound?'Mute sound':'Enable sound'} title={sound?'Mute':'Sound on'}>{sound?<Volume2 size={18}/>:<VolumeX size={18}/>}</button><button className="icon-button" onClick={reset} aria-label="Restart game" title="Restart"><RotateCcw size={17}/></button></div></header>
  {phase==='title'?<main className="start-screen"><div className="start-halo"/><div className="pixel-stars">✦ &nbsp; ♥ &nbsp; ✧ &nbsp; ♥ &nbsp; ✦</div><div className="start-avatar"><img src="/assets/vendela.webp" alt="Vendela"/></div><p className="overline">A VERY UNHINGED BIRTHDAY ADVENTURE</p><h1>KILL<span className="comma">,</span><br/>MARRY<span className="comma">,</span><br/><span className="lime">KÄÄRIJÄ</span></h1><p className="subtitle">VENDELA'S BIRTHDAY MASSACRE</p><p className="tagline">LOVE IS A BATTLEFIELD. <strong>LITERALLY.</strong></p><button className="main-button pulse" onClick={next}>▶ START GAME</button><p className="hint">CLICK TO CONTINUE · SPACE / ENTER · SOUND OPTIONAL</p></main>:
  phase==='final'?<main className="end-screen"><div className="end-hearts">♥ ♥ ♥</div><p className="overline">THE SECRET ENDING</p><h1>THROUPLE<br/><span className="lime">ENDING</span><br/>UNLOCKED!</h1><div className="end-portraits"><img src={asset('vendela')}/><img src={asset('kaarija')}/><img src={asset('erika')}/></div><h2>VENDELA + KÄÄRIJÄ + ERIKA</h2><p className="end-copy">Happily ever after.</p><div className="birthday">AMANDA: “Happy birthday, bitch.”</div><button className="main-button" onClick={reset}><RotateCcw size={16}/> PLAY AGAIN</button><p className="hint">MADE WITH LOVE, CHAOS & QUESTIONABLE DECISIONS</p></main>:
  <main className="game-layout"><div className="chapter-heading"><span className="chapter-tag">{chapters[chapter].title}</span><span className="location">{scene==='bar'?'◉ BROVAKTEN / THE BAR':scene==='dance'?'◉ BROVAKTEN / DANCE FLOOR':scene==='outside'?'◉ OUTSIDE BROVAKTEN': '♥ THE WEDDING'}</span></div>
  <section className={`stage ${phase==='choice'?'in-battle':''} ${hit?'hit':''} ${launched?'boss-launched':''} ${flightStart?'boss-flight-start':''}`}>
   <div className="stage-art">{scene==='outside'?<div className="outside-image"/>:<><div className="light-beams"/><div className="disco-ball">✦</div><div className="bar-backdrop"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="dance-tiles"/><div className="dance-lasers"/><div className="wedding-decor"><span>♥</span><span>♥</span><span>♥</span><span>♥</span></div><div className="crowd"><span/><span/><span/><span/><span/><span/></div></>}
    {scene==='wedding'&&<><div className="wedding-arch">♥</div><div className="wedding-floor"/></>}
    <div className="floor"/>
    <div className="character left"><div className="character-glow"/><img src={portrait(left, speaker===left?text: "")??asset(left)} alt={displayNames[left]}/><div className="nameplate">{displayNames[left]}</div></div>
    {right&&<div className={`character right ${speaker===right?'speaking':''}`}><div className="character-glow"/><img src={portrait(right, speaker===right?text: "")??asset(right)} alt={displayNames[right]}/><div className="nameplate">{displayNames[right]}</div></div>}
    {mysteryRight&&<div className="unknown-silhouette">?</div>}{phase==='choice'&&currentBoss&&<div className="boss-overlay"><div className="boss-label">⚠ BOSS BATTLE ⚠</div><div className="boss-name">{currentBoss.title}</div><div className="hp"><span>HP</span><div className="hp-track"><div/></div><span>100%</span></div></div>}
    {phase==='choice'&&active==='proposal'&&<div className="boss-overlay love-overlay"><div className="boss-label">♥ LOVE AT FIRST CHA CHA CHA ♥</div><div className="boss-name">MARRY KÄÄRIJÄ?</div></div>}
    {phase==='choice'&&active==='marriage'&&<div className="boss-overlay love-overlay"><div className="boss-label">♥ A NEW CHOICE APPEARS ♥</div><div className="boss-name">MARRY THEM BOTH?</div></div>}
    {(isFatality||isWedding||isEnding)&&<div className={`special-banner ${isFatality?'fatality':''}`}>{isFatality?'FATALITY!':step.text}</div>}
   </div>
  </section>
  <section className="lower-panel">{phase==='choice'?<div className="choice-panel"><div className="choice-title"><Skull size={18}/> CHOOSE YOUR {active==='proposal'||active==='marriage'?'DESTINY':'ATTACK'} <Skull size={18}/></div><div className="choice-grid">{choiceOptions.map((choice,i)=><button className="choice-button" key={choice.label} onClick={()=>pick(choice)}><span className="choice-index">0{i+1}</span><span>{choice.label}</span><ChevronRight size={18}/></button>)}</div></div>:<button className="dialogue" onClick={nextWithEpilogue} aria-label="Continue dialogue"><div className="dialogue-icon">{portrait(speaker,text)?<img src={portrait(speaker,text)!} alt={speaker?displayNames[speaker]:''}/>:speaker==='mystery'?<span className="unknown-icon">?</span>:speaker==='officiant'?<span className="unknown-icon">✝</span>:speaker==='women'?<span className="unknown-icon">!!!</span>:<Heart size={26}/>}</div><div className="dialogue-copy"><div className={`speaker ${speaker?'':'narrator'}`}>{speaker?displayNames[speaker]:'NARRATOR'}</div><p>{text.slice(0,visible)}{!complete&&<span className="cursor">▌</span>}</p></div><div className="dialogue-next">{complete?<span>▼</span>:<span>···</span>}</div></button>}</section>
  <div className="bottom-status"><span>♥ ♥ ♥ <span className="dim">VENDELA / LVL 99</span></span><span>{phase==='choice'?'PICK YOUR MOVE':phase==='attack'?'FINISH HIM!':'CLICK OR PRESS SPACE TO CONTINUE'} <ArrowRight size={12}/></span></div>
  </main>}
  <footer className="footer"><span>© VENDELA'S BIRTHDAY MASSACRE</span><span>BUILT FOR ONE VERY SPECIAL BIRTHDAY ♥</span></footer>
 </div>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
