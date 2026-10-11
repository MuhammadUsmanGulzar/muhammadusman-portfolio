export const systems = [
  {
    name: 'PostPilot', kind: 'Agentic marketing', id: 'postpilot-autoposting', accent: '#8b7bf0',
    title: 'From a brief to content you can publish.',
    summary: 'An agentic marketing workspace I am building to research, write, and design content, with the user in control of publishing.',
    status: 'In development', stack: 'Next.js · n8n · Supabase',
    steps: ['Content brief', 'Research & write', 'Generate image', 'Save & review'],
    stageCopy: [
      'Explore the product, the workflow behind it, and the output it creates.',
      'A brief moves through research, writing, image generation, and storage. The user reviews the result before choosing where to post.',
      'A post and supporting image, ready for review. Video, ads, customer replies, and spend analytics are future work.',
    ],
    output: 'Ready for review', outputTitle: 'Your idea.\nReady to share.',
    outputLines: ['Post and image', 'Choose your platform', 'Review before publishing'],
  },
  {
    name: 'Jepsii', kind: 'Aviation operations', id: 'logistics-dashboard', accent: '#ed9a67',
    title: 'An operating view for aviation fuel.',
    summary: 'A platform I built for Jepsii to connect fuel enquiries, jobs, invoices, ledgers, and financial reporting.',
    status: 'Client project', stack: 'Next.js · React · REST APIs',
    steps: ['Fuel enquiry', 'Job & fuel ticket', 'Invoice & payment', 'Ledger updated'],
    stageCopy: [
      'Explore the dashboard, the operational workflow, and the records it brings together.',
      'Follow an enquiry through the fueling job, fuel ticket, invoice, and payment into the financial ledger.',
      'A shared view of operations and finance, including invoices, client balances, vendor balances, and reporting.',
    ],
    output: 'Operations connected', outputTitle: 'One operation.\nOne clear view.',
    outputLines: ['Fuel jobs and tickets', 'Invoices and payments', 'Ledgers and reporting'],
  },
  {
    name: 'Techmen', kind: 'Sales automation', id: 'techmen-sales', accent: '#65b8aa',
    title: 'Give every enquiry a clear next step.',
    summary: 'A client sales workflow that understands enquiries, extracts lead information, and routes important opportunities to the team.',
    status: 'Client project', stack: 'n8n · OpenAI · Google Sheets',
    steps: ['New enquiry', 'Understand intent', 'Score the lead', 'Capture & route'],
    stageCopy: [
      'Explore the sales workflow through an illustrative workspace, routing logic, and structured lead output.',
      'An incoming enquiry is classified, its details are extracted, and the lead is scored before capture and routing.',
      'Structured lead information gives the team the context to respond, with important cases routed to the right person.',
    ],
    output: 'Ready for the team', outputTitle: 'Less sorting.\nMore context.',
    outputLines: ['Enquiry classified', 'Lead details captured', 'Important cases routed'],
  },
];

// Canvas artwork is an illustrative product study, never live client data.
export function createScreenTexture(project, type) {
  const canvas = document.createElement('canvas');
  canvas.width = type === 'output' ? 640 : 1280;
  canvas.height = type === 'output' ? 880 : 800;
  const c = canvas.getContext('2d');
  const accent = project.accent;
  const rect = (x,y,w,h,r,fill,stroke) => {
    c.beginPath();c.roundRect(x,y,w,h,r);
    if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke();}
  };
  const text = (value,x,y,size=18,color='#9eacbf',weight=400) => {
    c.fillStyle=color;c.font=`${weight} ${size}px Arial, sans-serif`;c.fillText(value,x,y);
  };
  const line = (x,y,x2,y2,color='#2a3446',width=1) => {
    c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.stroke();
  };
  const pill = (value,x,y,w=130,color=accent) => {rect(x,y,w,32,16,color+'20');text(value,x+15,y+22,14,color);};
  rect(0,0,canvas.width,canvas.height,0,'#111927');
  if(type==='output') {
    text('03 / OUTPUT',40,53,16,accent,600);
    line(40,80,600,80);
    pill(project.output,40,108,project.name==='Jepsii'?210:190);
    const gradient=c.createLinearGradient(40,170,600,560);gradient.addColorStop(0,accent+'38');gradient.addColorStop(1,'#202838');
    rect(40,170,560,365,20,gradient);
    // A composed typographic image, rather than a stock or generated placeholder.
    c.save();c.beginPath();c.roundRect(40,170,560,365,20);c.clip();
    for(let i=0;i<5;i++){c.strokeStyle=accent+'38';c.lineWidth=2;c.beginPath();c.arc(535,215,65+i*31,0,Math.PI*2);c.stroke();}
    project.outputTitle.split('\n').forEach((t,i)=>text(t,72,365+i*52,43,'#f4f4fa',500));
    c.restore();
    text(project.name==='PostPilot'?'CONTENT PREVIEW':'STRUCTURED OUTPUT',42,580,14,'#8291a6',600);
    project.outputLines.forEach((label,i)=>{const y=623+i*61;rect(42,y-18,26,26,8,accent+'20');text('✓',48,y+1,16,accent);text(label,84,y+2,21,'#d8dfeb');if(i<2)line(84,y+23,595,y+23,'#202d3e');});
    text('Illustrative preview',42,841,15,'#728197');
    return canvas;
  }
  // Window chrome.
  ['#ee977c','#e5c882','#89bfa8'].forEach((color,i)=>{c.fillStyle=color;c.beginPath();c.arc(32+i*22,27,5,0,Math.PI*2);c.fill();});
  text(project.name+' / '+(type==='workflow'?'Workflow':'Workspace'),148,33,15,'#8f9bac');
  text('ILLUSTRATIVE PREVIEW',1065,33,12,'#64738a');line(0,54,1280,54);
  if(type==='workflow') {
    text('02 / WORKFLOW',48,108,15,accent,600);
    text('How the system works',48,158,32,'#edf0f7',500);
    text(project.kind,48,190,17);
    // Connection bus with branches into four legible nodes.
    line(177,367,1103,367,accent+'85',3);
    project.steps.forEach((label,i)=>{
      const x=48+i*310;
      rect(x,272,255,190,15,'#192336','#364057');
      rect(x+20,293,44,42,11,accent+'22');text(String(i+1).padStart(2,'0'),x+31,321,17,accent,600);
      text(label,x+20,382,20,'#e9ecf5',500);text(i===3?'Prepared for the next step':'Connected workflow step',x+20,419,14,'#8e9bb0');
      if(i<3){rect(x+263,354,37,26,8,'#111927');text('→',x+272,374,20,accent);}
    });
    line(177,463,177,544,accent+'75',2);line(177,544,650,544,accent+'75',2);line(650,544,650,590,accent+'75',2);
    rect(437,580,426,112,14,'#182331','#344456');
    text(project.name==='PostPilot'?'Human review before publishing':project.name==='Jepsii'?'Operations and finance stay connected':'Important cases go to the team',466,622,20,'#dce4f0',500);
    text(project.name==='PostPilot'?'History and media stored in Supabase':'A clear handoff with the relevant context',466,657,15,'#93a2b8');
    text('A simplified view of the implemented workflow',48,752,15,'#75859d');
    return canvas;
  }
  rect(0,55,209,745,0,'#141d2d');line(210,55,210,800);
  text(project.name,26,107,27,'#f1f3fa',600);
  const items=project.name==='PostPilot'?['Overview','New generation','History','Media library']:project.name==='Jepsii'?['Dashboard','Inquiries','Jobs','Invoices','Ledger','Vendors']:['Overview','Enquiries','Lead capture','Routing','Activity'];
  items.forEach((label,i)=>{const y=162+i*55;if(i===0)rect(16,y-28,177,42,7,accent+'22');text(label,42,y,17,i===0?accent:'#8392a8',i===0?600:400);});
  text('WORKSPACE',242,108,12,'#76859c',600);
  text(project.name==='PostPilot'?'Your content, in one place.':project.name==='Jepsii'?'Aviation fuel operations':'Enquiries with a next step.',242,151,31,'#eef1fa',500);
  pill(project.name==='PostPilot'?'Create a post':project.name==='Jepsii'?'Create enquiry':'Sales workflow',1050,108,180);
  if(project.name==='PostPilot') {
    const g=c.createLinearGradient(242,190,1228,408);g.addColorStop(0,'#383253');g.addColorStop(1,'#25273e');rect(242,190,986,218,15,g);
    text('AI CONTENT STUDIO',273,232,14,'#bdadff',600);text('Turn an idea into',273,287,35,'#f6f3ff',500);text('a ready-to-publish post.',273,332,35,'#f6f3ff',500);
    text('Research. Write. Design. Review.',273,374,17,'#b4adc8');
    c.save();c.translate(1070,291);c.rotate(.12);rect(-100,-70,151,158,10,'#c7b9ed');rect(-85,-53,121,75,5,'#8672c6');for(let i=0;i<3;i++)rect(-83,37+i*12,90-i*15,4,2,'#a492c9');c.restore();
    text('Generation history',243,462,23,'#e3e8f2',500);text('OUTPUT',834,460,12,'#6f819b');text('REVIEW',1077,460,12,'#6f819b');
    ['A clear brief, a useful first draft','Create content for the right audience','Keep the human in the workflow'].forEach((label,i)=>{const y=506+i*76;rect(243,y,985,64,9,'#182233');text(label,269,y+37,19,'#c6d0e0');text(i===1?'Text post':'Post + image',833,y+37,16);pill('Prepared',1070,y+15,131,'#83cdb2');});
  } else if(project.name==='Jepsii') {
    ['Inquiries','Fueling jobs','Invoices','Financial ledger'].forEach((label,i)=>{const x=242+i*252;rect(x,193,235,113,12,'#1b2535');rect(x+19,211,31,31,8,accent+'20');text(String(i+1).padStart(2,'0'),x+25,232,14,accent);text(label,x+19,279,18,'#d4dce9');});
    ['Revenue flow','Margin overview'].forEach((label,i)=>{const x=242+i*504;rect(x,331,482,235,12,'#182232');text(label,x+22,369,20,'#d7dfed');for(let j=0;j<4;j++)line(x+23,401+j*40,x+455,401+j*40,'#293548');c.beginPath();c.moveTo(x+25,512);c.bezierCurveTo(x+135,382,x+170,480,x+234,440);c.bezierCurveTo(x+320,374,x+356,436,x+454,402);c.strokeStyle=i?'#73bda9':accent;c.lineWidth=4;c.stroke();});
    text('Connected records',244,612,22,'#dde4ef',500);['Fuel tickets','Invoices & payments','Client & vendor balances'].forEach((label,i)=>{const y=649+i*42;line(243,y+19,1226,y+19,'#243044');text(label,246,y,17,'#aebdd0');text('View records →',1075,y,15,accent);});
  } else {
    rect(242,190,986,170,14,'#1c3337');text('SALES AUTOMATION',270,230,14,accent,600);text('Understand. Qualify. Route.',270,280,35,'#e7f4f0',500);text('Consistent lead capture from every enquiry.',270,324,18,'#99b5b0');
    text('Enquiry routing',242,415,23,'#e2eaf3',500);text('INTENT',690,415,13,'#78899e');text('NEXT STEP',986,415,13,'#78899e');
    [['Product request','Product information','Capture lead'],['Pricing enquiry','Commercial interest','Score opportunity'],['Complex request','Needs a person','Route to team']].forEach(([label,intent,next],i)=>{const y=457+i*88;rect(242,y,986,72,10,'#1a2535');text(label,266,y+43,20,'#d4ddeb');text(intent,688,y+42,17);pill(next,979,y+20,226);});
    text('Illustrative records · no client data',244,770,14,'#78899e');
  }
  return canvas;
}
