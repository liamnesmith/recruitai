import {revalidatePath} from 'next/cache';
import {requireUser} from '@/lib/auth';

const sports=['Baseball','Softball','Football','Basketball','Soccer','Volleyball','Track & Field','Cross Country','Swimming','Tennis','Golf','Lacrosse','Wrestling','Other'];
const states=['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
const gradYears=Array.from({length:8},(_,i)=>new Date().getFullYear()+i);
const heights=Array.from({length:25},(_,i)=>{const inches=58+i;return `${Math.floor(inches/12)}'${inches%12}\"`;});

async function save(fd:FormData){
  'use server';
  const {supabase,user}=await requireUser();
  const obj={
    user_id:user.id,
    sport:String(fd.get('sport')||''),
    position:String(fd.get('position')||''),
    grad_year:Number(fd.get('grad_year'))||null,
    school:String(fd.get('school')||''),
    city:String(fd.get('city')||''),
    state:String(fd.get('state')||''),
    height:String(fd.get('height')||''),
    weight:Number(fd.get('weight'))||null,
    gpa:Number(fd.get('gpa'))||null,
    bio:String(fd.get('bio')||''),
    profile_complete:85,
    is_searchable:true
  };
  await supabase.from('athletes').upsert(obj,{onConflict:'user_id'});
  revalidatePath('/dashboard/profile');
}

export default async function Profile(){
  const {supabase,user}=await requireUser();
  const {data:a}=await supabase.from('athletes').select('*').eq('user_id',user.id).maybeSingle();
  return <>
    <h1>Athlete profile</h1>
    <p className="muted">Use the structured fields so coaches can filter and compare athletes accurately.</p>
    <form action={save} className="card form">
      <label>Sport<select className="input" name="sport" defaultValue={a?.sport||''} required><option value="">Select sport</option>{sports.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Primary position<select className="input" name="position" defaultValue={a?.position||''} required><option value="">Select position</option>{['Pitcher','Catcher','Infield','Outfield','Quarterback','Running Back','Wide Receiver','Offensive Line','Defensive Line','Linebacker','Defensive Back','Guard','Forward','Center','Goalkeeper','Defender','Midfielder','Attacker','Sprinter','Distance','Jumps','Throws','Freestyle','Backstroke','Breaststroke','Butterfly','Singles','Doubles','Other'].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Graduation year<select className="input" name="grad_year" defaultValue={a?.grad_year||''} required><option value="">Select year</option>{gradYears.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
      <label>School<input className="input" name="school" placeholder="High school or club" defaultValue={a?.school||''}/></label>
      <label>City<input className="input" name="city" placeholder="City" defaultValue={a?.city||''}/></label>
      <label>State<select className="input" name="state" defaultValue={a?.state||''}><option value="">Select state</option>{states.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Height<select className="input" name="height" defaultValue={a?.height||''}><option value="">Select height</option>{heights.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Weight<input className="input" name="weight" type="number" min="70" max="450" placeholder="Weight in pounds" defaultValue={a?.weight||''}/></label>
      <label>GPA<select className="input" name="gpa" defaultValue={a?.gpa||''}><option value="">Select GPA</option>{Array.from({length:31},(_,i)=>(4-i*.1).toFixed(1)).map(x=><option key={x} value={x}>{x}</option>)}</select></label>
      <label>Recruiting bio<textarea className="input" name="bio" rows={6} placeholder="Goals, playing style, achievements, academic interests, and what you want coaches to know." defaultValue={a?.bio||''}/></label>
      <button className="btn">Save profile</button>
    </form>
  </>;
}
