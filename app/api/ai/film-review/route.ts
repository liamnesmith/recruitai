import OpenAI from 'openai';
import {z} from 'zod';
import {NextResponse} from 'next/server';
import {requireUser} from '@/lib/auth';

export const maxDuration=60;

const schema=z.object({
  athleteId:z.string().uuid(),
  videoId:z.string().uuid(),
  sport:z.string().optional(),
  title:z.string().optional(),
  frames:z.array(z.object({time:z.number(),image:z.string().startsWith('data:image/')})).min(4).max(8)
});

export async function POST(req:Request){
  try{
    const apiKey=process.env.OPENAI_API_KEY;
    if(!apiKey)return NextResponse.json({error:'OpenAI is not configured on the server yet.'},{status:503});
    const [{supabase,user},body]=await Promise.all([requireUser(),req.json()]);
    const input=schema.parse(body);
    const client=new OpenAI({apiKey});
    const content:any[]=[
      {type:'input_text',text:`Act as a careful college sports film analyst. Analyze only visible evidence in these sampled frames from ${input.sport||'a sport'} clip titled ${input.title||'untitled'}. Return JSON with summary, observable_strengths (array), development_questions (array), timestamp_evidence (array of {time_seconds,observation}), confidence (low|medium|high), limitations (array), and next_evaluation_step. Be specific and concise. Do not infer character, medical conditions, identity, protected traits, or guaranteed future performance.`},
      ...input.frames.flatMap(frame=>[
        {type:'input_text',text:`Timestamp ${frame.time.toFixed(1)} seconds`},
        {type:'input_image',image_url:frame.image,detail:'low'}
      ])
    ];
    const response=await client.responses.create({
      model:process.env.OPENAI_MODEL||'gpt-5-mini',
      input:[{role:'user',content}],
      text:{format:{type:'json_object'}},
      max_output_tokens:900
    });
    const report=JSON.parse(response.output_text);
    await supabase.from('film_reviews').insert({athlete_id:input.athleteId,video_id:input.videoId,requested_by:user.id,report,model:process.env.OPENAI_MODEL||'gpt-5-mini'});
    return NextResponse.json(report,{headers:{'Cache-Control':'no-store'}});
  }catch(error:any){
    return NextResponse.json({error:error?.message||'Unable to analyze film'},{status:400});
  }
}
