"use client";

import {useRef,useState} from 'react';

type Video={id:string;title:string;sport?:string|null;public_url:string};
type Report={summary?:string;observable_strengths?:string[];development_questions?:string[];timestamp_evidence?:{time_seconds:number;observation:string}[];confidence?:string;limitations?:string[];next_evaluation_step?:string;error?:string};

export default function FilmAnalyzer({video,athleteId}:{video:Video;athleteId:string}){
  const ref=useRef<HTMLVideoElement>(null);
  const [status,setStatus]=useState('');
  const [report,setReport]=useState<Report|null>(null);
  const [busy,setBusy]=useState(false);

  async function seek(el:HTMLVideoElement,time:number){
    el.currentTime=time;
    await new Promise<void>((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('Video frame sampling timed out.')),5000);
      el.addEventListener('seeked',()=>{clearTimeout(timer);resolve();},{once:true});
    });
  }

  async function analyze(){
    const el=ref.current;
    if(!el||!Number.isFinite(el.duration)||el.duration<=0){setStatus('Play the video once, then try again.');return;}
    setBusy(true);setReport(null);
    try{
      const canvas=document.createElement('canvas');
      canvas.width=512;canvas.height=288;
      const ctx=canvas.getContext('2d');
      if(!ctx)throw new Error('Your browser could not read video frames.');
      const frames:{time:number;image:string}[]=[];
      for(let i=1;i<=6;i++){
        setStatus(`Sampling frame ${i} of 6…`);
        const time=Math.max(.1,el.duration*i/7);
        await seek(el,time);
        ctx.drawImage(el,0,0,canvas.width,canvas.height);
        frames.push({time,image:canvas.toDataURL('image/jpeg',.62)});
      }
      setStatus('AI is reviewing the film…');
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),45000);
      const res=await fetch('/api/ai/film-review',{method:'POST',headers:{'content-type':'application/json'},signal:controller.signal,body:JSON.stringify({athleteId,videoId:video.id,sport:video.sport||undefined,title:video.title,frames})});
      clearTimeout(timer);
      const json=await res.json();
      if(!res.ok)throw new Error(json.error||'Film review failed.');
      setReport(json);setStatus('Review complete and saved.');
    }catch(error){
      setStatus(error instanceof DOMException&&error.name==='AbortError'?'Film review timed out. Try a shorter clip.':error instanceof Error?error.message:'Film review failed.');
    }finally{setBusy(false);}
  }

  return <article className="card">
    <h3>{video.title}</h3>
    <video ref={ref} controls preload="metadata" playsInline style={{width:'100%',maxHeight:420,borderRadius:12}} src={video.public_url}/>
    <div className="row"><button className="btn" type="button" disabled={busy} onClick={analyze}>{busy?'Reviewing…':'Review film with AI'}</button><span className="muted">{status}</span></div>
    {report&&<div className="report">
      <h3>AI film report</h3><p>{report.summary}</p>
      {!!report.observable_strengths?.length&&<><h4>Observable strengths</h4><ul>{report.observable_strengths.map(x=><li key={x}>{x}</li>)}</ul></>}
      {!!report.timestamp_evidence?.length&&<><h4>Timestamp evidence</h4><ul>{report.timestamp_evidence.map((x,i)=><li key={i}><strong>{Math.round(x.time_seconds)}s:</strong> {x.observation}</li>)}</ul></>}
      {!!report.development_questions?.length&&<><h4>Development questions</h4><ul>{report.development_questions.map(x=><li key={x}>{x}</li>)}</ul></>}
      {report.next_evaluation_step&&<p><strong>Next evaluation step:</strong> {report.next_evaluation_step}</p>}
      <p className="muted">Confidence: {report.confidence||'not provided'}</p>
    </div>}
  </article>;
}
