export const projectColors = { RE:'#62a69a',TS:'#b39461',DC:'#b789a2',AV:'#709ab0',VB:'#c79575',LS:'#7295bd',PP:'#9586cb',RA:'#6f9c8a',JE:'#c79763',BP:'#86a187',CV:'#8e91be' };
export const cardLayouts = [
  [[-.4,.03,.65,-.12,0,5.5,3.35],[-2,.65,-.6,.12,.06,2.5,2.2],[2.1,-.4,1.1,-.12,-.04,2.55,1.8]],
];

export function createCardArtwork(project,type) {
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=650;
  const c=canvas.getContext('2d'),accent=projectColors[project.icon]||'#9586cb';
  const box=(x,y,w,h,color,r=16)=>{c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();};
  const text=(value,x,y,size,color='#dfe8f2',weight=400)=>{c.fillStyle=color;c.font=`${weight} ${size}px Arial,sans-serif`;c.fillText(value,x,y);};
  const rule=(y)=>{c.strokeStyle='#304056';c.lineWidth=2;c.beginPath();c.moveTo(56,y);c.lineTo(968,y);c.stroke();};
  const wrap=(value,x,y,size,width,color,maxLines=3)=>{c.font=`400 ${size}px Arial,sans-serif`;const words=value.split(' ');let line='',row=0;for(const word of words){const next=line?line+' '+word:word;if(c.measureText(next).width>width&&line){text(line,x,y+row*size*1.4,size,color);row++;line=word;if(row>=maxLines)return;}else line=next;}if(row<maxLines)text(line,x,y+row*size*1.4,size,color);};
  box(0,0,1024,650,'#172438',0);
  text(type==='product'?project.domain.toUpperCase():type==='workflow'?'CONNECTED TOOLS':'OUTPUT',56,74,27,accent,500);rule(110);
  if(type==='product'){
    box(56,158,148,148,accent+'26',26);text(project.icon,86,252,61,accent,500);
    wrap(project.title,244,212,46,720,'#e7edf5',2);
    const first=project.flow[0],last=project.flow[project.flow.length-1];
    box(56,377,382,165,'#223249',18);box(581,377,387,165,'#223249',18);
    text('INPUT',80,419,22,accent);wrap(first,80,466,31,335,'#bfcbdb',2);
    text('OUTCOME',606,419,22,accent);wrap(last,606,466,31,335,'#bfcbdb',2);
    c.strokeStyle=accent;c.lineWidth=4;c.beginPath();c.moveTo(447,458);c.lineTo(568,458);c.lineTo(550,445);c.moveTo(568,458);c.lineTo(550,471);c.stroke();
    text('A workflow with a clear next step.',56,608,25,'#8195ae');
  }else if(type==='workflow'){
    project.stack.slice(0,3).forEach((tool,i)=>{const y=173+i*137;box(56,y,912,110,'#213148',18);box(83,y+29,50,50,accent+'28',12);text(String(i+1),99,y+64,29,accent);text(tool,163,y+69,43,'#c6d2e2');});
  }else{
    box(58,161,78,78,accent+'26',20);text('✓',78,216,44,accent);
    wrap(project.flow[project.flow.length-1],58,320,58,900,'#e3ebf4',2);
    text(project.status?'In development':'Project outcome',60,586,34,accent);
  }
  return canvas;
}
