document.documentElement.lang='pl';
(function(){
  var btn=document.querySelector('.menu-btn'),nav=document.getElementById('mnav');
  if(btn&&nav){btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o?'true':'false');});}
  function nowMin(){
    try{var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
      return (+p.find(function(x){return x.type==='hour'}).value)*60+(+p.find(function(x){return x.type==='minute'}).value);}
    catch(e){var d=new Date();return d.getHours()*60+d.getMinutes();}
  }
  function toMin(s){var a=s.split(':');return (+a[0])*60+(+a[1]);}
  var now=nowMin();
  document.querySelectorAll('[data-live-times]').forEach(function(list){
    var found=false;
    list.querySelectorAll('li[data-t]').forEach(function(li){
      var t=toMin(li.getAttribute('data-t')),st=li.querySelector('.state');
      if(now>t+60){li.classList.add('past');}
      else if(now>=t){li.classList.add('now');if(st)st.innerHTML='<i class="lamp" aria-hidden="true"></i>trwa teraz';found=true;}
      else if(!found){li.classList.add('next');if(st)st.innerHTML='<i class="lamp" aria-hidden="true"></i>najbliższa';found=true;}
    });
    var tm=document.querySelector('[data-tomorrow]');if(!found&&tm)tm.hidden=false;
  });
  document.querySelectorAll('[data-open]').forEach(function(el){
    var r=el.getAttribute('data-open').split('-'),a=toMin(r[0]),b=toMin(r[1]);
    if(now>=a&&now<b){el.textContent='otwarte teraz';el.classList.add('open');}
    else if(now<a){el.textContent='otwarcie o '+r[0].replace(':','.');}
    else{el.textContent='dziś już zamknięte';}
  });
  document.querySelectorAll('table.stack').forEach(function(t){
    var hs=[].slice.call(t.querySelectorAll('thead th')).slice(1).map(function(h){return h.textContent.trim();});
    t.querySelectorAll('tbody tr').forEach(function(tr){[].slice.call(tr.querySelectorAll('td')).forEach(function(td,i){if(hs[i])td.setAttribute('data-l',hs[i]);});});
  });
  var links=[].slice.call(document.querySelectorAll('.toc a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){links.forEach(function(a){a.classList.remove('on');});var a=map[e.target.id];if(a)a.classList.add('on');}
    });},{rootMargin:'-25% 0px -65% 0px'});
    document.querySelectorAll('.content section[id]').forEach(function(s){io.observe(s);});
  }
})();
(function(){
  var m;try{m=+new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Warsaw',month:'numeric'}).format(new Date());}catch(e){m=new Date().getMonth()+1;}
  var items=[].slice.call(document.querySelectorAll('.year li[data-months]'));
  function has(li,x){return li.getAttribute('data-months').split(',').map(Number).indexOf(x)>-1;}
  var cur=items.filter(function(li){return has(li,m);})[0];
  function flag(li,cls,txt){li.classList.add(cls);var b=li.querySelector('b');b.insertAdjacentHTML('beforeend',' <span class="flag"><i class="lamp" aria-hidden="true"></i>'+txt+'</span>');}
  if(cur){flag(cur,'now','teraz');return;}
  for(var k=1;k<=12;k++){var x=((m-1+k)%12)+1;var nx=items.filter(function(li){return has(li,x);})[0];if(nx){flag(nx,'soon',nx.getAttribute('data-start'));break;}}
})();
(function(){
  document.querySelectorAll('.check input[type=checkbox]').forEach(function(cb){
    var k='brygida-sakr:'+cb.id;
    try{cb.checked=localStorage.getItem(k)==='1';}catch(e){}
    cb.addEventListener('change',function(){try{localStorage.setItem(k,cb.checked?'1':'0');}catch(e){}});
  });
  document.querySelectorAll('[data-print]').forEach(function(b){
    b.addEventListener('click',function(){
      var s=b.closest('section');s.classList.add('is-printing');document.body.setAttribute('data-printing','');
      try{window.print();}catch(e){}
    });
  });
  window.addEventListener('afterprint',function(){
    document.body.removeAttribute('data-printing');
    document.querySelectorAll('.is-printing').forEach(function(s){s.classList.remove('is-printing');});
  });
})();
(function(){
  document.querySelectorAll('[data-copy]').forEach(function(b){
    var label=b.textContent;
    function show(msg,ok){b.textContent=msg;b.classList.toggle('ok',ok);setTimeout(function(){b.textContent=label;b.classList.remove('ok');},2200);}
    function fallback(){
      var code=b.parentNode.querySelector('code');var r=document.createRange();r.selectNodeContents(code);
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
