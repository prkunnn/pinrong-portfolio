/*
 * CMS content loader. This leaves the original nine stories in index.html as a file:// fallback.
 * Pages CMS updates content/stories.json (and roles/site) directly in GitHub; GitHub Pages serves the new files.
 */
(()=>{
'use strict';
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const esc = (text) => String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const para = (text) => String(text??'').split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
const path = (s) => {
 const str=String(s||'').trim();
 if(!str || /^\s*(?:javascript|data|blob):/i.test(str)) return '';
 if(/^https?:\/\//i.test(str)) return str;
 // The CMS stores '/assets/...'; GitHub Pages project sites require a relative path instead.
 let v=str.replace(/^\/+/, '');
 if(v.includes('..')||!v.startsWith('assets/')) return '';
 return v;
};
const ext = (url) => {
 try{const u=new URL(url);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}
};
async function data(url){
 const r=await fetch(url,{cache:'no-store'});
 if(!r.ok)throw new Error(`HTTP ${r.status}: ${url}`);
 return r.json();
}
const lightbox=$('#lightbox'),lImg=$('#lightboxImage'),lCaption=$('#lightboxCaption'),lClose=$('#closeLightbox');
let oldFocus=null;
function openLightbox(src,caption){ if(!src||!lightbox)return;oldFocus=document.activeElement;lImg.src=src;lImg.alt=caption||'作品照片';lCaption.textContent=caption||'';lightbox.classList.add('open');document.body.classList.add('modal-open');lClose.focus(); }
function closeLightbox(){if(!lightbox)return;lightbox.classList.remove('open');document.body.classList.remove('modal-open');lImg.removeAttribute('src');oldFocus?.focus();}
lClose?.addEventListener('click',closeLightbox);
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lightbox?.classList.contains('open'))closeLightbox()});
function preparePhotos(node,record){
 const imgs=(Array.isArray(record.images)?record.images:[]).map(path).filter(Boolean);
 const photo=$('.story-photo',node),cap=record.caption||record.title||'作品照片';
 const first=imgs[0]||'';
 photo.dataset.lightbox=first;photo.dataset.caption=cap;photo.setAttribute('aria-label','放大查看：'+cap);
 photo.innerHTML='';
 if(first){
  const m=document.createElement('img');m.src=first;m.loading='lazy';m.decoding='async';m.alt=cap;photo.appendChild(m);
  if(imgs.length>1){const num=document.createElement('span');num.className='photo-count';num.textContent=`1 / ${imgs.length}`;photo.appendChild(num)}
 } else {
  const placeholder=document.createElement('div');placeholder.style.cssText='height:100%;min-height:240px;display:grid;place-items:center;color:#9aafa2;font-size:14px';placeholder.textContent='尚未上傳照片';photo.appendChild(placeholder)
 }
 const label=document.createElement('span');label.className='photo-caption';label.innerHTML='<span>'+esc(cap)+'</span><span aria-hidden="true">↗</span>';photo.appendChild(label);
 const body=$('.story-body',node);$('.photo-thumbs',body)?.remove();
 if(imgs.length>1){
  const film=document.createElement('div');film.className='photo-thumbs';film.setAttribute('aria-label','切換作品照片');
  imgs.forEach((src,i)=>{
   const btn=document.createElement('button');btn.type='button';btn.className='photo-thumb'+(i===0?' selected':'');btn.setAttribute('aria-label',`查看第 ${i+1} 張照片`);
   const img=document.createElement('img');img.src=src;img.alt='';img.loading='lazy';btn.appendChild(img);
   btn.addEventListener('click',()=>{
    $('.story-photo img',node).src=src; photo.dataset.lightbox=src;
    $('.photo-count',photo) && ($('.photo-count',photo).textContent=`${i+1} / ${imgs.length}`);
    $$('.photo-thumb',film).forEach((b,j)=>b.classList.toggle('selected',i===j));
   });film.appendChild(btn)
  });body.appendChild(film)
 }
}
function populate(node,story,i){
 const id='story-'+String(i+1).padStart(2,'0');node.id=id;
 node.dataset.category=['startup','community','education'].includes(story.category)?story.category:'startup';
 $('.chapter-marker span',node).textContent=`CHAPTER ${String(i+1).padStart(2,'0')} · ${story.stage||''}`;
 $('.chapter-marker .count',node).textContent=story.focus||'';
 $('h3',node).textContent=story.title||'未命名故事';
 $('.subtitle',node).textContent=story.subtitle||'';
 const copy=$('.story-copy',node);copy.innerHTML='';
 para(story.body).forEach(par=>{const p=document.createElement('p');p.textContent=par;copy.appendChild(p)});
 if(story.takeaway){const p=document.createElement('p');p.className='takeaway';p.textContent='✳ '+story.takeaway.replace(/^✳\s*/, '');copy.appendChild(p)}
 $('.story-tags',node).innerHTML=(Array.isArray(story.tags)?story.tags:[]).map(tag=>`<span>${esc(tag)}</span>`).join('');
 $('.story-external',node)?.remove();
 const url=ext(story.link);
 if(url){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.className='story-external';a.textContent='查看相關作品／社群 ↗';$('.story-body',node).appendChild(a)}
 preparePhotos(node,story);
}
function refreshStories(stories){
 if(!Array.isArray(stories)||!stories.length)return;
 const clean=stories.filter(x=>x&&typeof x==='object').sort((a,b)=>(Number(a.order)||999)-(Number(b.order)||999));
 const holder=$('#storyStack'),template=$('.story-card',holder);
 if(!holder||!template)return;
 const nodes=clean.map((x,i)=>{const n=template.cloneNode(true);populate(n,x,i);return n});
 holder.replaceChildren(...nodes);
 const aside=$('.sidebar');if(aside){aside.innerHTML='<p>快速跳轉</p>';clean.forEach((x,i)=>{
  const a=document.createElement('a');a.href='#story-'+String(i+1).padStart(2,'0');a.innerHTML=`<b>${String(i+1).padStart(2,'0')}</b>${esc(x.title||'未命名故事')}`;aside.appendChild(a)
 })}
 const groups={all:clean.length,startup:0,community:0,education:0};clean.forEach(x=>{if(Object.hasOwn(groups,x.category))groups[x.category]++});
 const labels={all:'全部故事',startup:'創業與行銷',community:'設計與共創',education:'教育與影響'};
 $$('.filter-btn').forEach(b=>{const g=b.dataset.filter;b.textContent=`${labels[g]} · ${String(groups[g]||0).padStart(2,'0')}`;b.classList.toggle('active',g==='all');b.setAttribute('aria-pressed',String(g==='all'))});
 $('.stats .stat strong') && ($('.stats .stat strong').textContent=clean.length+' 段');
 const bigbtn=$('.primary-btn');if(bigbtn)bigbtn.innerHTML='閱讀 '+clean.length+' 段成長歷程 <span aria-hidden="true">↗</span>';
}
function refreshRoles(roles){
 const cards=$$('.role');if(!Array.isArray(roles))return;
 roles.forEach((r,i)=>{const n=cards[i];if(!n)return;
 $('h3',n).textContent=r.title||'';
 $('p:not(.signature)',n).textContent=r.description||'';
 $('.signature',n).textContent=r.signature||'';
 const img=$('.role-visual img',n),src=path(r.image);if(src)img.src=src;img.alt=r.title||'角色插圖'
 });
}
function refreshSite(s){
 if(!s||typeof s!=='object')return;
 const h=$('.hero h1');if(h)h.innerHTML=esc(s.headline_first||'')+'<br><em>'+esc(s.headline_second||'')+'</em>';
 if(s.hero_intro)$('.lead').textContent=s.hero_intro;
 if(s.stories_intro)$('.story-intro').textContent=s.stories_intro;
 const title=$('.outro-panel h2');if(title&&s.reflection_title)title.textContent=s.reflection_title;
 if(s.reflection_paragraphs){const panel=$('.outro-panel');$$(':scope > p',panel).forEach(p=>p.remove());
 const tail=$('.outro-mini',panel);para(s.reflection_paragraphs).forEach(part=>{const p=document.createElement('p');p.textContent=part;panel.insertBefore(p,tail)})}
}
function initInteractions(){
 const progress=$('#readingProgress'),top=$('#backTop');function update(){const doc=document.documentElement,h=doc.scrollHeight-doc.clientHeight;if(progress)progress.style.width=(h?Math.min(100,window.scrollY/h*100):0)+'%';top?.classList.toggle('visible',window.scrollY>500)}
 addEventListener('scroll',update,{passive:true});update();top?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
 $$('.filter-btn').forEach(b=>b.addEventListener('click',()=>{
  const g=b.dataset.filter;$$('.filter-btn').forEach(f=>{f.classList.toggle('active',f===b);f.setAttribute('aria-pressed',String(f===b))});$$('.story-card').forEach(c=>{c.hidden=g!=='all'&&c.dataset.category!==g});update()
 }));
 document.addEventListener('click',e=>{
   const imageButton=e.target.closest('.story-photo');if(imageButton){openLightbox(imageButton.dataset.lightbox,imageButton.dataset.caption);return}
   const jump=e.target.closest('.sidebar a');if(jump){$$('.filter-btn').forEach(f=>{const all=f.dataset.filter==='all';f.classList.toggle('active',all);f.setAttribute('aria-pressed',String(all))});$$('.story-card').forEach(c=>c.hidden=false)}
 });
 const ob=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)$$('.sidebar a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))})},{rootMargin:'-20% 0px -70% 0px',threshold:0});$$('.story-card').forEach(c=>ob.observe(c));
}
async function start(){
 // Offline file:// preview uses embedded article fallbacks; GitHub Pages loads CMS JSON.
 if(location.protocol==='file:'){initInteractions();return}
 const res=await Promise.allSettled([data('content/stories.json'),data('content/roles.json'),data('content/site.json')]);
 try{if(res[0].status==='fulfilled')refreshStories(res[0].value)}catch(err){console.warn('Stories:',err)}
 try{if(res[1].status==='fulfilled')refreshRoles(res[1].value)}catch(err){console.warn('Roles:',err)}
 try{if(res[2].status==='fulfilled')refreshSite(res[2].value)}catch(err){console.warn('Site:',err)}
 initInteractions();
}
start();
})();
