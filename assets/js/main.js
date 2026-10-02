(function(){
  function $$(sel,root){return [].slice.call((root||document).querySelectorAll(sel));}
  function toMin(s){var a=s.split(':');return (+a[0])*60+(+a[1]);}

  // Bieżąca data i godzina w Warszawie, niezależnie od strefy czasowej przeglądarki
  var warsaw=(function(){
    var d=new Date();
    try{
      var p={};
      new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Warsaw',year:'numeric',month:'2-digit',day:'2-digit',
        hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(d).forEach(function(x){p[x.type]=+x.value;});
      return {today:Date.UTC(p.year,p.month-1,p.day),min:p.hour*60+p.minute};
    }catch(e){
      return {today:Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()),min:d.getHours()*60+d.getMinutes()};
    }
  })();
  var now=warsaw.min;

  // Menu mobilne
  var btn=document.querySelector('.menu-btn'),nav=document.getElementById('mnav');
  if(btn&&nav){btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o?'true':'false');});}

  // Dzisiejsze Msze: trwa teraz / najbliższa / minione
  $$('[data-live-times]').forEach(function(list){
    var nextFound=false;
    $$('li[data-t]',list).forEach(function(li){
      var t=toMin(li.getAttribute('data-t')),st=li.querySelector('.state');
      if(now>t+60){li.classList.add('past');}
      else if(now>=t){li.classList.add('now');if(st)st.innerHTML='<i class="lamp" aria-hidden="true"></i>trwa teraz';}
      else if(!nextFound){li.classList.add('next');if(st)st.innerHTML='<i class="lamp" aria-hidden="true"></i>najbliższa';nextFound=true;}
    });
    var tm=document.querySelector('[data-tomorrow]');if(!nextFound&&tm)tm.hidden=false;
  });

  // Status biura
  $$('[data-open]').forEach(function(el){
    var r=el.getAttribute('data-open').split('-'),a=toMin(r[0]),b=toMin(r[1]);
    if(now>=a&&now<b){el.textContent='otwarte teraz';el.classList.add('open');}
    else if(now<a){el.textContent='otwarcie o '+r[0].replace(':','.');}
    else{el.textContent='dziś już zamknięte';}
  });

  // Etykiety kolumn dla tabel składanych na wąskim ekranie
  $$('table.stack').forEach(function(t){
    var hs=$$('thead th',t).slice(1).map(function(h){return h.textContent.trim();});
    $$('tbody tr',t).forEach(function(tr){$$('td',tr).forEach(function(td,i){if(hs[i])td.setAttribute('data-l',hs[i]);});});
  });

  // Spis treści: podświetlenie bieżącej sekcji
  var links=$$('.toc a');
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){links.forEach(function(a){a.classList.remove('on');});var a=map[e.target.id];if(a)a.classList.add('on');}
    });},{rootMargin:'-25% 0px -65% 0px'});
    $$('.content section[id]').forEach(function(s){io.observe(s);});
  }

  // Rok liturgiczny: bieżący okres albo najbliższy
  (function(){
    var items=$$('.year li[data-season]');
    if(!items.length)return;
    var RZ=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'],DAY=864e5,today=warsaw.today;
    function easter(y){var a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),
      h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
      mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return Date.UTC(y,mo-1,da);}
    function advent(y){var x=Date.UTC(y,11,25),dow=new Date(x).getUTCDay();return x-(dow===0?7:dow)*DAY-21*DAY;}
    function ranges(y){return {
      adwent:[advent(y),Date.UTC(y,11,24)],
      post:[easter(y)-46*DAY,easter(y)-DAY],
      maj:[Date.UTC(y,4,1),Date.UTC(y,4,31)],
      czerwiec:[Date.UTC(y,5,1),Date.UTC(y,5,30)],
      pazdziernik:[Date.UTC(y,9,1),Date.UTC(y,9,31)]};}
    var y=new Date(today).getUTCFullYear(),r0=ranges(y),r1=ranges(y+1);
    function flag(li,cls,txt){li.classList.add(cls);li.querySelector('b').insertAdjacentHTML('beforeend',' <span class="flag"><i class="lamp" aria-hidden="true"></i>'+txt+'</span>');}
    var cur=items.filter(function(li){var r=r0[li.getAttribute('data-season')];return today>=r[0]&&today<=r[1];})[0];
    if(cur){flag(cur,'now','teraz');return;}
    var best=null,bestStart=Infinity;
    items.forEach(function(li){var k=li.getAttribute('data-season');[r0[k],r1[k]].forEach(function(r){if(r[0]>today&&r[0]<bestStart){bestStart=r[0];best=li;}});});
    if(best){var s=new Date(bestStart);flag(best,'soon','od '+s.getUTCDate()+' '+RZ[s.getUTCMonth()]);}
  })();

  // Listy dokumentów: zapamiętywanie zaznaczeń i druk jednej sekcji
  $$('.check input[type=checkbox]').forEach(function(cb){
    var k='brygida-sakr:'+cb.id;
    try{cb.checked=localStorage.getItem(k)==='1';}catch(e){}
    cb.addEventListener('change',function(){try{localStorage.setItem(k,cb.checked?'1':'0');}catch(e){}});
  });
  $$('[data-print]').forEach(function(b){
    b.addEventListener('click',function(){
      b.closest('section').classList.add('is-printing');document.body.setAttribute('data-printing','');
      try{window.print();}catch(e){}
    });
  });
  window.addEventListener('afterprint',function(){
    document.body.removeAttribute('data-printing');
    $$('.is-printing').forEach(function(s){s.classList.remove('is-printing');});
  });

  // Kopiowanie numerów kont
  $$('[data-copy]').forEach(function(b){
    var label=b.textContent;
    function show(msg,ok){b.textContent=msg;b.classList.toggle('ok',ok);setTimeout(function(){b.textContent=label;b.classList.remove('ok');},2200);}
    function fallback(){
      var r=document.createRange();r.selectNodeContents(b.parentNode.querySelector('code'));
      var sel=window.getSelection();sel.removeAllRanges();sel.addRange(r);
      var ok=false;try{ok=document.execCommand('copy');}catch(e){}
      if(ok){show('Skopiowano',true);}else{show('Zaznaczono — naciśnij Ctrl+C',false);}
    }
    b.addEventListener('click',function(){
      try{navigator.clipboard.writeText(b.getAttribute('data-copy')).then(function(){show('Skopiowano',true);},fallback);}
      catch(e){fallback();}
    });
  });
})();
