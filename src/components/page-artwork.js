export const pageStudies = {
  work: {
    label: 'A system, from the inside', accent: '#8b7bf0', tabs: ['Product', 'Workflow', 'Outcome'],
    notes: ['Interfaces built around the work people actually do.', 'Agents, tools, and data connected through a clear workflow.', 'Useful output, with context and a clear handoff.'],
    cards: [['PRODUCT / INTERFACE', 'Built for the user.', 'AI assistants · dashboards · web apps'], ['WORKFLOW / LOGIC', 'Connected by design.', 'Inputs → reasoning → tools → output'], ['OUTCOME / HANDOFF', 'Ready for real work.', 'Structured information. Clear next steps.']],
  },
  experience: {
    label: 'Experience, built in layers', accent: '#ba9462', tabs: ['Client work', 'Credentials', 'Education'], light: true,
    notes: ['Direct client delivery across AI, automation, and full-stack development.', 'Three certifications from n8n Education and Google through Coursera.', 'B.S. Artificial Intelligence · IQRA University, Karachi · 2022–2026.'],
    cards: [['CLIENT DELIVERY', 'From brief to build.', 'Azm Al Safwa · Jepsii · Freelance'], ['CERTIFICATIONS', 'Learning, applied.', 'n8n Education · Google / Coursera'], ['EDUCATION', 'Artificial Intelligence', 'IQRA University · Karachi']],
  },
  about: {
    label: 'How I approach a build', accent: '#66a89d', tabs: ['Understand', 'Build', 'Deliver'],
    notes: ['Talk with the client, understand the workflow, and define what the software needs to do.', 'Connect the right models, tools, data, and interfaces for the job.', 'Test, deploy, monitor, and hand over a system people can use.'],
    cards: [['01 / UNDERSTAND', 'Start with the problem.', 'Client conversations · business context'], ['02 / BUILD', 'Connect the right pieces.', 'Agents · tools · data · interfaces'], ['03 / DELIVER', 'Make it work in practice.', 'Test · deploy · monitor · handoff']],
  },
  contact: {
    label: 'Every build starts with a brief', accent: '#709abd', tabs: ['Your idea', 'The context', 'Next steps'], light: true,
    notes: ['Share what you want to build or improve in the form.', 'A little context about your workflow helps explain the problem.', 'Your message starts the conversation about a suitable approach.'],
    cards: [['PROJECT BRIEF', 'What do you have in mind?', 'An AI tool, an automation, or a web app.'], ['BUSINESS CONTEXT', 'Tell me about the work.', 'The workflow, the users, the challenge.'], ['START A CONVERSATION', 'Let’s talk it through.', 'Muhammad Usman · Karachi, Pakistan']],
  },
};

export function studyLayouts(theme) {
  const sizes = theme === 'experience' ? [[5.3,3.4],[4.8,3.4],[4.6,3.2]] : theme === 'contact' ? [[4.9,3.5],[4.6,3.4],[4.5,3.2]] : [[5.8,3.7],[5.6,3.6],[4.3,3.2]];
  return [0,1,2].map(selected => sizes.map(([w,h],i) => i===selected
    ? [.25,.1,1.1,-.03,0,w,h]
    : [i<selected?-2.7:2.4,.38+(i%2)*.35,-1.35,i<selected?.15:-.19,(i-1)*.05,w*.82,h*.82]));
}

export function createPageArtwork(study, type) {
  const index = ['product','workflow','output'].indexOf(type);
  const [label,title,subtitle] = study.cards[index];
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=700;
  const c=canvas.getContext('2d'),light=study.light,accent=study.accent;
  const ink=light?'#354357':'#e4eaf5',muted=light?'#8390a1':'#8a9bb2',line=light?'#e0e4eb':'#2a374c';
  function box(x,y,w,h,fill,stroke,r=10){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.lineWidth=2;c.strokeStyle=stroke;c.stroke();}}
  function text(value,x,y,size=22,color=muted,weight=400){c.font=`${weight} ${size}px Arial,sans-serif`;c.fillStyle=color;c.fillText(value,x,y);}
  function path(points,color=line,width=2){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.stroke();}
  box(0,0,1024,700,light?'#fbfbfa':'#142033');
  text(label,54,68,18,accent,600);text('MU / PORTFOLIO',786,68,15,muted);
  path([[54,98],[970,98]]);text(title,54,164,38,ink,500);text(subtitle,54,208,21,muted);
  if(study===pageStudies.experience){
    if(index===0){
      const roles=[['2026 — NOW','Azm Al Safwa','AI Engineer · contract'],['2026','Jepsii','Full-stack dashboard development'],['2025 — NOW','Freelance','Agentic AI & automation']];
      path([[79,280],[79,596]],'#d2b58b',3);
      roles.forEach(([date,name,role],i)=>{const y=284+i*125;box(70,y-8,18,18,accent,null,9);text(date,115,y+4,16,accent);text(name,115,y+43,28,ink,500);text(role,115,y+75,20,muted);});
    } else if(index===1){
      box(30,27,964,646,null,'#d9c59e',4);
      [['n8n Professional Certificate','n8n Education · August 2026'],['Google AI Essentials','Coursera · September 2025'],['Foundations: Data, Data, Everywhere','Coursera · September 2025']].forEach(([name,issuer],i)=>{const y=287+i*113;text(String(i+1).padStart(2,'0'),55,y,20,accent);text(name,112,y,25,ink,500);text(issuer,112,y+36,19,muted);path([[112,y+58],[964,y+58]]);});
    } else {
      text('B.S.',56,304,76,accent,500);text('2022 – 2026',56,356,26,ink);path([[56,394],[961,394]]);
      text('FINAL YEAR PROJECT',56,445,17,accent,600);text('PI-MF Autoencoder',56,493,31,ink,500);text('Computer vision for CCTV anomaly detection',56,536,20,muted);text('Pose · movement · appearance',56,578,20,muted);
    }
  } else if(study===pageStudies.contact){
    if(index===0){
      [['01','What would you like to build?'],['02','Who will use it?'],['03','What needs to improve?']].forEach(([n,t],i)=>{const y=299+i*99;text(n,58,y,18,accent);text(t,119,y,25,ink);path([[119,y+35],[948,y+35]]);});
    }else if(index===1){
      ['Your current workflow','The tools and data involved','The result you are looking for'].forEach((t,i)=>{const y=291+i*102;box(56,y-26,40,40,'#e7eff5',null,10);text('↗',65,y+3,24,accent);text(t,127,y+2,25,ink);});
    }else{
      box(174,270,676,278,'#edf2f7','#c8d7e5',15);path([[180,278],[513,445],[844,278]],'#b7ccdd',3);path([[180,541],[396,411]],'#c7d7e4',2);path([[844,541],[629,411]],'#c7d7e4',2);
      text('A conversation about your project.',246,604,24,ink);
    }
  } else if(study===pageStudies.about){
    const labels=index===0?['Listen','Map the workflow','Define the scope']:index===1?['AI models','Tools & APIs','Data & UI']:['Test & validate','Deploy & monitor','Client handoff'];
    labels.forEach((t,i)=>{const x=54+i*311;box(x,293,282,153,'#1b2a3f','#354960');box(x+19,313,39,35,accent+'22');text(String(i+1).padStart(2,'0'),x+26,338,17,accent);text(t,x+19,398,23,ink);if(i<2)path([[x+282,370],[x+311,370]],accent,3);});
    path([[194,446],[194,527],[827,527],[827,446]],'#44685f',2);
    text(index===0?'Clear requirements before implementation.':index===1?'Choose tools for the problem.': 'Keep the client involved through delivery.',195,582,22,'#a9c9c0');
  } else {
    if(index===0){
      box(54,257,916,325,'#1b2940','#35435b');box(54,257,168,325,'#192439');['Overview','Projects','Activity'].forEach((t,i)=>text(t,76,307+i*50,19,i?'#7185a1':accent));
      for(let i=0;i<3;i++){box(252+i*229,286,209,80,'#24344e');text(['AI assistants','Automations','Web apps'][i],273+i*229,332,19,ink);}
      for(let i=0;i<3;i++){box(252,391+i*51,665,37,'#202f47');box(269,403+i*51,200+i*60,7,'#667893',null,3);}
    }else if(index===1){
      const labels=['Inputs','Agent logic','Tools','Output'];labels.forEach((t,i)=>{const x=54+i*238;box(x,316,202,125,'#1b2940','#35435b');text(t,x+22,387,24,ink);if(i<3)path([[x+202,378],[x+238,378]],accent,3);});
      path([[393,442],[393,539],[853,539],[853,442]],'#655f9b',2);text('Context, tool use, and a clear handoff.',254,591,23,muted);
    }else{
      ['Useful answers','Structured records','A clear next step'].forEach((t,i)=>{const y=294+i*108;box(56,y-26,42,42,accent+'20');text('✓',66,y+5,26,accent);text(t,131,y+5,31,ink);path([[131,y+39],[948,y+39]]);});
    }
  }
  text(study===pageStudies.experience?'Experience summary · details below':'Illustrative process view',54,666,16,muted);
  return canvas;
}
