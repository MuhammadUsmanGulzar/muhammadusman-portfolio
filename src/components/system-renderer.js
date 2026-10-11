import { createScreenTexture } from './system-artwork';

// A small WebGL product stage. Geometry and artwork stay local; frames render only on interaction.
export function createSystemRenderer(canvas, initialProject, options = {}) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!gl) return null;
  const resources = { shaders: [], buffers: [], textures: [] };
  const program = gl.createProgram();
  const vertex = `attribute vec3 position; attribute vec3 normal; attribute vec2 uv;
    uniform mat4 matrix; uniform mat4 model; varying vec2 vUV; varying vec3 vNormal;
    void main(){gl_Position=matrix*vec4(position,1.);vUV=uv;vNormal=mat3(model)*normal;}`;
  const fragment = `precision mediump float; varying vec2 vUV; varying vec3 vNormal;
    uniform sampler2D artwork; uniform vec4 color; uniform float textured; uniform float lit;
    void main(){vec4 base=mix(color,texture2D(artwork,vUV),textured);
      float lighting=.55+.45*max(dot(normalize(vNormal),normalize(vec3(-.6,.9,1.))),0.);
      gl_FragColor=vec4(base.rgb*mix(1.,lighting,lit),base.a);}`;
  try {
    for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
      const shader = gl.createShader(type);resources.shaders.push(shader);
      gl.shaderSource(shader, source);gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader unavailable');
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('WebGL unavailable');
  } catch {
    resources.shaders.forEach(shader => gl.deleteShader(shader));gl.deleteProgram(program);return null;
  }
  gl.useProgram(program);
  const attrs = Object.fromEntries(['position','normal','uv'].map(key => [key,gl.getAttribLocation(program,key)]));
  const uniforms = Object.fromEntries(['matrix','model','artwork','color','textured','lit'].map(key => [key,gl.getUniformLocation(program,key)]));
  const identity = () => [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
  const mul = (a,b) => {
    const out = Array(16).fill(0);
    for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];
    return out;
  };
  const translate = (x,y,z) => {const m=identity();m[12]=x;m[13]=y;m[14]=z;return m;};
  const scale = (x,y,z=1) => [x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1];
  const rx = a => {const c=Math.cos(a),s=Math.sin(a);return [1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1];};
  const ry = a => {const c=Math.cos(a),s=Math.sin(a);return [c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1];};
  const rz = a => {const c=Math.cos(a),s=Math.sin(a);return [c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1];};
  const compose = (...m) => m.reduce(mul,identity());
  const perspective = aspect => [2.6/aspect,0,0,0,0,2.6,0,0,0,0,-1.004,-1,0,0,-.2004,0];
  function geometry(data, mode=gl.TRIANGLES) {
    const buffer=gl.createBuffer();resources.buffers.push(buffer);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    return {buffer,count:data.length/8,mode};
  }
  // Rounded, solid slabs, not flat DOM cards. Each screen has a front, back, and lit edge.
  const perimeter=[];
  for(let corner=0;corner<4;corner++){
    const centers=[[.465,.465],[-.465,.465],[-.465,-.465],[.465,-.465]];
    const [cx,cy]=centers[corner];
    for(let i=0;i<=8;i++){const a=(corner*90+i*90/8)*Math.PI/180;perimeter.push([cx+Math.cos(a)*.035,cy+Math.sin(a)*.035]);}
  }
  const face=[],edge=[];
  const pushFace=(p)=>face.push(p[0],p[1],0,0,0,1,p[0]+.5,.5-p[1]);
  for(let i=0;i<perimeter.length;i++){
    const a=perimeter[i],b=perimeter[(i+1)%perimeter.length];
    pushFace([0,0]);pushFace(a);pushFace(b);
    const nx=(a[0]+b[0])/2,ny=(a[1]+b[1])/2;
    for(const p of [[...a,-1],[...b,-1],[...b,0],[...a,-1],[...b,0],[...a,0]])edge.push(...p,nx,ny,0,0,0);
  }
  const screen=geometry(face),rim=geometry(edge);
  const floorLines=[];
  for(let i=-10;i<=10;i++){
    for(const p of [[i,-2.65,-8],[i,-2.65,6],[-10,-2.65,i],[10,-2.65,i]])floorLines.push(...p,0,1,0,0,0);
  }
  const grid=geometry(floorLines,gl.LINES);
  const anisotropy = gl.getExtension('EXT_texture_filter_anisotropic');
  function texture(source) {
    // Power-of-two textures allow mipmaps: fine UI lines stay stable at oblique camera angles.
    const artwork = document.createElement('canvas');
    artwork.width = Math.min(1024, 2 ** Math.floor(Math.log2(source.width)));
    artwork.height = Math.min(1024, 2 ** Math.ceil(Math.log2(source.height)));
    artwork.getContext('2d').drawImage(source, 0, 0, artwork.width, artwork.height);
    const result=gl.createTexture();resources.textures.push(result);gl.bindTexture(gl.TEXTURE_2D,result);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,artwork);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    if(anisotropy)gl.texParameterf(gl.TEXTURE_2D,anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(4,gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
    return result;
  }
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=256;shadowCanvas.height=256;
  const context=shadowCanvas.getContext('2d'),gradient=context.createRadialGradient(128,128,10,128,128,128);
  const shadowStrength = options.shadowStrength ?? .29;
  gradient.addColorStop(0,`rgba(36,43,62,${shadowStrength})`);gradient.addColorStop(.4,`rgba(36,43,62,${shadowStrength*.45})`);gradient.addColorStop(1,'rgba(36,43,62,0)');context.fillStyle=gradient;context.fillRect(0,0,256,256);
  const shadow=texture(shadowCanvas);
  let textures=[];
  function setProject(project) {
    for(const item of textures){gl.deleteTexture(item);resources.textures.splice(resources.textures.indexOf(item),1);}
    textures=['product','workflow','output'].map(type=>texture((options.artwork || createScreenTexture)(project,type)));
    requestRender();
  }
  // x, y, z, yaw, roll, width, height. Camera presets reveal a different layer of the same system.
  const layouts=options.layouts || [
    [[-.6,-.05,.2,-.10,0,6.8,4.25],[-1.1,.65,-1.35,-.10,0,6.6,4.125],[2.7,-.48,1.7,-.20,-.025,2.5,3.438]],
    [[-3.7,-.4,-1.6,.20,-.035,4.4,2.75],[.1,.1,1,-.04,0,7.1,4.438],[3.4,-.5,-1.1,-.22,-.02,2.2,3.025]],
    [[-2.6,-.1,-1.3,.13,0,5.6,3.5],[-1.6,.7,-2.6,.08,0,5.6,3.5],[1.15,.05,1.6,-.08,0,3.3,4.538]],
  ];
  let positions=layouts[0].map(p=>[...p]),target=layouts[0];
  let yaw=-.32,pitch=.13,targetYaw=-.32,targetPitch=.13;
  let frame=0,last=0,width=0,height=0,visible=false,destroyed=false,reduced=false;
  let view=identity();
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.uniform1i(uniforms.artwork,0);
  function draw(mesh,model,color=[1,1,1,1],image=null,lit=0) {
    gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buffer);
    for(const [key,size,offset] of [['position',3,0],['normal',3,12],['uv',2,24]]){gl.enableVertexAttribArray(attrs[key]);gl.vertexAttribPointer(attrs[key],size,gl.FLOAT,false,32,offset);}
    gl.uniformMatrix4fv(uniforms.matrix,false,mul(view,model));gl.uniformMatrix4fv(uniforms.model,false,model);
    gl.uniform4fv(uniforms.color,color);gl.uniform1f(uniforms.textured,image?1:0);gl.uniform1f(uniforms.lit,lit);
    gl.bindTexture(gl.TEXTURE_2D,image||shadow);gl.drawArrays(mesh.mode,0,mesh.count);
  }
  function render() {
    if(destroyed||!width||!height)return;
    const aspect=width/height,distance=Math.max(options.distance || 9.8,(options.fit || 13)/aspect);
    view=compose(perspective(aspect),translate(0,.04,-distance),rx(pitch),ry(yaw));
    gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.depthMask(false);
    if (options.grid !== false) draw(grid,identity(),[.34,.40,.50,.055]);
    draw(screen,compose(translate(.1,-2.60,.2),rx(-Math.PI/2),scale(12,9)),[1,1,1,1],shadow);
    gl.depthMask(true);
    positions.forEach(([x,y,z,turn,roll,w,h],i)=>{
      const base=compose(translate(x,y,z),ry(turn),rz(roll));
      draw(screen,compose(base,translate(0,0,-.10),scale(w+.11,h+.11)),options.lightFrames ? [.78,.80,.84,1] : [.20,.24,.31,1],null,1);
      draw(rim,compose(base,scale(w+.11,h+.11,.10)),options.lightFrames ? [.9,.91,.94,1] : [.41,.46,.55,1],null,1);
      draw(screen,compose(base,scale(w+.11,h+.11)),options.lightFrames ? [.85,.87,.90,1] : [.21,.26,.34,1],null,1);
      draw(screen,compose(base,translate(0,0,.008),scale(w,h)),[1,1,1,1],textures[i]);
    });
  }
  function tick(now) {
    frame=0;if(destroyed||!visible)return;
    const delta=last?Math.min((now-last)/1000,.05):1/60;last=now;
    const ease=reduced?1:1-Math.exp(-delta*6.5);let remaining=0;
    positions=positions.map((p,i)=>p.map((value,j)=>{const next=value+(target[i][j]-value)*ease;remaining+=Math.abs(target[i][j]-next);return next;}));
    yaw+=(targetYaw-yaw)*ease;pitch+=(targetPitch-pitch)*ease;remaining+=Math.abs(targetYaw-yaw)+Math.abs(targetPitch-pitch);
    render();if(remaining>.001)requestRender();else last=0;
  }
  function requestRender(){if(visible&&!destroyed&&!frame)frame=requestAnimationFrame(tick);}
  setProject(initialProject);
  return {
    resize(w,h){width=w;height=h;const dpr=Math.min(window.devicePixelRatio||1,1.75);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);requestRender();},
    setVisible(value){visible=value;last=0;if(!value){cancelAnimationFrame(frame);frame=0;}else requestRender();},
    setReduced(value){reduced=value;requestRender();},
    setProject,
    setStage(stage){target=layouts[stage];targetYaw=stage===1?-.08:stage===2?-.16:-.32;targetPitch=stage===1?.035:.13;requestRender();},
    rotate(dx,dy){targetYaw=Math.max(-.70,Math.min(.55,targetYaw+dx));targetPitch=Math.max(-.18,Math.min(.42,targetPitch+dy));requestRender();},
    destroy(){destroyed=true;cancelAnimationFrame(frame);resources.buffers.forEach(b=>gl.deleteBuffer(b));resources.textures.forEach(t=>gl.deleteTexture(t));resources.shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);},
  };
}
