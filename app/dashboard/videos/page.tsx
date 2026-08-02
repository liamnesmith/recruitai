import {requireUser} from '@/lib/auth';
import VideoUploader from './uploader';
import FilmAnalyzer from './film-analyzer';

export default async function Videos(){
  const {supabase,user}=await requireUser();
  const {data:a}=await supabase.from('athletes').select('id,sport,videos(id,title,sport,public_url,created_at)').eq('user_id',user.id).maybeSingle();
  if(!a)return <div className="card"><h2>Create your athlete profile first</h2><p>Your profile connects uploaded film to the correct athlete record.</p></div>;
  const videos=((a as any).videos||[]).sort((x:any,y:any)=>new Date(y.created_at).getTime()-new Date(x.created_at).getTime());
  return <>
    <span className="kicker">Film workspace</span><h1>Upload and review film</h1>
    <p className="muted">Short, clear clips work best. The AI samples visible frames and produces timestamped observations; it does not diagnose injuries or guarantee future performance.</p>
    <VideoUploader athleteId={a.id}/>
    {videos.length===0?<div className="card"><p>No videos uploaded yet.</p></div>:videos.map((video:any)=><FilmAnalyzer key={video.id} video={{...video,sport:video.sport||a.sport}} athleteId={a.id}/>)}
  </>;
}
