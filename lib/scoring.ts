export type AthleteLike={gpa?:number|null,profile_complete?:number|null,verified_metrics?:number|null,stats?:Record<string,unknown>|null,measurements?:Record<string,unknown>|null};
export function scoreAthlete(a:AthleteLike){
 const stats=Object.keys(a.stats||{}).length, metrics=Object.keys(a.measurements||{}).length;
 const academic=Math.min(100,Math.round(((a.gpa||0)/4)*100));
 const evidence=Math.min(100,20+stats*10+metrics*10+(a.verified_metrics||0)*15);
 const completeness=Math.max(0,Math.min(100,a.profile_complete||0));
 const overall=Math.round(academic*.2+evidence*.45+completeness*.35);
 return {overall,academic,evidence,completeness,confidence:Math.round((evidence+completeness)/2)};
}
