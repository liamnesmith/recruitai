import Link from 'next/link';
import {requireUser} from '@/lib/auth';

export default async function Dashboard(){
  const {user}=await requireUser();
  const name=user.user_metadata?.full_name||user.email?.split('@')[0]||'there';
  return <>
    <span className="kicker">RecruitAI workspace</span>
    <h1>Welcome, {name}</h1>
    <div className="grid">
      <Link className="card" href="/dashboard/search"><h2>Search athletes</h2><p>Find searchable athlete-created profiles.</p></Link>
      <Link className="card" href="/dashboard/profile"><h2>Build a profile</h2><p>Add academics, measurements and performance evidence.</p></Link>
      <Link className="card" href="/dashboard/videos"><h2>AI film review</h2><p>Upload film and receive timestamped AI observations.</p></Link>
      <Link className="card" href="/dashboard/messages"><h2>Messages</h2><p>Keep coach-athlete conversations in one place.</p></Link>
    </div>
  </>;
}
