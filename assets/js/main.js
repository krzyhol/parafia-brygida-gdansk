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

  var DAY=864e5,RZ=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'],
    DNI=['niedziela','poniedziałek','wtorek','środa','czwartek','piątek','sobota'],
    W_DNI=['w niedzielę','w poniedziałek','we wtorek','w środę','w czwartek','w piątek','w sobotę'];
  function data(t){var d=new Date(t);return d.getUTCDate()+' '+RZ[d.getUTCMonth()];}
  function iso(t){return new Date(t).toISOString().slice(0,10);}
  function hm(s){return s.replace(/^0/,'').replace(':','.');}
  function easter(y){var a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),
    h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
    mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return Date.UTC(y,mo-1,da);}
  function advent(y){var x=Date.UTC(y,11,25),dow=new Date(x).getUTCDay();return x-(dow===0?7:dow)*DAY-21*DAY;}

  // Porządek Mszy (jak na stronie Msze i nabożeństwa) i dopiski na dany dzień.
  // W święta poniżej porządek jest inny i podaje go ogłoszenie, więc mszeDnia zwraca null.
  var NIEDZIELA=['07:00','09:00','11:00','12:30','18:30'],POWSZEDNI=['07:00','15:00','18:30'],
    SWIETA=['1-1','1-6','8-15','11-1','12-24','12-25','12-26'],    // miesiąc-dzień
    SWIETA_RUCHOME=[-3,-2,-1,0,1,60];                               // dni od Wielkanocy: Triduum, Wielkanoc, poniedziałek, Boże Ciało
  function mszeDnia(t){
    var d=new Date(t),y=d.getUTCFullYear(),m=d.getUTCMonth(),dow=d.getUTCDay(),nr=Math.ceil(d.getUTCDate()/7),e=easter(y),
      post=t>=e-46*DAY&&t<e,adw=t>=advent(y)&&t<Date.UTC(y,11,24),n={};
    if(SWIETA.indexOf((m+1)+'-'+d.getUTCDate())>=0||SWIETA_RUCHOME.some(function(k){return t===e+k*DAY;}))return null;
    function note(h,s){(n[h]=n[h]||[]).push(s);}
    if(dow===0){
      note('07:00','transmisja w Radiu Plus Gdańsk');note('09:00','dla dzieci');note('11:00','suma');
      if(nr===1||nr===3)note('12:30','po Mszy chrzty');
      if(post)note('18:30','wcześniej, o 17.30, Gorzkie Żale');
    }else{
      if(adw)note('07:00','roraty');
      if(dow===6&&nr===1)note('07:00','po Mszy adoracja z różańcem i Męski Różaniec');
      note('15:00','z Koronką do Miłosierdzia Bożego');
      if(post&&dow===5){note('07:00','po Mszy Droga Krzyżowa');note('15:00','po Mszy Droga Krzyżowa');note('18:30','wcześniej, o 18.00, Droga Krzyżowa');}
    }
    var wiecz=[dow===2&&'litania do św. Brygidy',dow===3&&'nowenna do Matki Bożej Nieustającej Pomocy',
      dow===5&&nr===1&&'litania do Najświętszego Serca Pana Jezusa',
      m===4&&'nabożeństwo majowe',m===5&&'nabożeństwo czerwcowe',m===9&&'różaniec'].filter(Boolean);
    if(wiecz.length)note('18:30','po Mszy '+wiecz.join(', '));
    return (dow===0?NIEDZIELA:POWSZEDNI).map(function(h){return [h,(n[h]||[]).join('; ')];});
  }

  // Menu mobilne
  var btn=document.querySelector('.menu-btn'),nav=document.getElementById('mnav');
  if(btn&&nav){btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o?'true':'false');});}

  // Dzisiejsza data, Msze dziś i jutro, link do liturgii dnia.
  // Elementy z data-for="RRRR-MM-DD" (wspomnienie, czytania, kolor szat) są tylko na ten dzień — w inne dni znikają.
  (function(){
    var t=warsaw.today,dow=new Date(t).getUTCDay(),dzis=mszeDnia(t),jutro=mszeDnia(t+DAY),
      dzien=DNI[dow].charAt(0).toUpperCase()+DNI[dow].slice(1)+', '+data(t);
    function godziny(m){return m?m.map(function(x){return hm(x[0]);}).join(' · '):'zob. ogłoszenia';}
    $$('[data-date]').forEach(function(el){el.textContent=dzien+' '+new Date(t).getUTCFullYear();});
    $$('[data-dayline]').forEach(function(el){el.innerHTML=dzien+' · Msze: <b class="num">'+godziny(dzis)+'</b>';});
    $$('[data-msze-dzis]').forEach(function(el){el.textContent=godziny(dzis);});
    $$('[data-for]').forEach(function(el){el.hidden=el.getAttribute('data-for')!==iso(t);});
    $$('[data-liturgia]').forEach(function(a){
      a.href='https://niezbednik.niedziela.pl/dzien/'+iso(t);
      var p=a.previousElementSibling;if(p&&p.hidden)a.textContent='Czytania i liturgia dnia';
    });
    $$('[data-live-times]').forEach(function(list){
      if(!dzis){
        list.removeAttribute('data-live-times');list.hidden=true;
        list.insertAdjacentHTML('afterend','<p class="side-note">Dziś porządek świąteczny — godziny Mszy podajemy w <a class="link" href="aktualnosci.html">ogłoszeniach duszpasterskich</a>.</p>');
        return;
      }
      list.innerHTML=dzis.map(function(x){
        return '<li data-t="'+x[0]+'"><span class="t">'+hm(x[0])+'</span><span class="state"></span>'+(x[1]?'<span class="n">'+x[1]+'</span>':'')+'</li>';
      }).join('');
    });
    $$('[data-tomorrow]').forEach(function(el){
      el.textContent='Jutro, '+W_DNI[(dow+1)%7]+' '+data(t+DAY)+', '+
        (jutro?'pierwsza Msza o '+hm(jutro[0][0])+'.':'porządek świąteczny — godziny Mszy w ogłoszeniach.');
    });
    // W niedzielę zamiast niedzielnych godzin — godziny w dni powszednie
    if(dow===0)$$('[data-msze-inne]').forEach(function(p){
      p.querySelector('b').textContent='W dni powszednie:';p.querySelector('.num').textContent=POWSZEDNI.map(hm).join(' · ');
    });
    // Spowiedź także 18.00–19.00 w I piątek miesiąca: dziś (do 19.00) albo najbliższy
    $$('[data-spowiedz]').forEach(function(el){
      for(var i=0;i<38;i++){var d=new Date(t+i*DAY);if(d.getUTCDay()===5&&d.getUTCDate()<=7&&!(i===0&&now>=19*60))break;}
      el.textContent=i===0?'dziś (I piątek miesiąca) także 18.00–19.00':'w I piątek miesiąca, '+(i===1?'jutro':data(t+i*DAY))+', także 18.00–19.00';
    });
  })();

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

  // Najbliższe dni: dziś / jutro / za n dni, minione wyszarzone
  (function(){
    function utc(s){var p=s.split('-');return Date.UTC(+p[0],p[1]-1,+p[2]);}
    var day=warsaw.today;
    $$('[data-days] li').forEach(function(li){
      var t=li.querySelector('time'),dt=t&&t.getAttribute('datetime'),w=document.createElement('span');
      w.className='when';li.insertBefore(w,li.firstChild);
      if(!dt||dt.length!==10)return;
      var n=Math.round((utc(dt)-day)/864e5);
      if(n<0){li.classList.add('past');w.textContent='minęło';}
      else if(n===0){li.classList.add('soon');w.innerHTML='<i class="lamp" aria-hidden="true"></i>dziś';}
      else if(n===1){li.classList.add('soon');w.textContent='jutro';}
      else if(n<7){w.textContent='za '+n+' dni';}
    });
  })();

  // Pokaz zdjęć ołtarza: zmiana co kilka sekund, pauza przyciskiem, najechaniem i fokusem klawiatury.
  // Przy „ogranicz ruch” nie przewija się sam. Kolejny slajd włącza koniec animacji paska postępu.
  $$('[data-tour]').forEach(function(tour){
    var slides=$$('.slide',tour),nav=tour.querySelector('[data-tour-nav]'),stage=tour.querySelector('.stage');
    if(slides.length<2||!nav)return;
    var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,cur=-1,thumbs=[];
    var ICON={pause:'<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 2h3v10H3zM8 2h3v10H8z" fill="currentColor"/></svg>',
      play:'<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 2l8 5-8 5z" fill="currentColor"/></svg>'};
    slides.forEach(function(s,i){
      var title=s.querySelector('figcaption b').textContent,b=document.createElement('button');
      s.setAttribute('role','group');s.setAttribute('aria-roledescription','zdjęcie');s.setAttribute('aria-label',(i+1)+' z '+slides.length);
      b.type='button';b.className='thumb';b.setAttribute('aria-label','Zdjęcie '+(i+1)+' z '+slides.length+': '+title);
      b.innerHTML='<img alt="" loading="lazy" src="'+s.querySelector('img').getAttribute('src')+'"><i class="bar"></i>';
      b.addEventListener('click',function(){show(i);});
      nav.appendChild(b);thumbs.push(b);
    });
    var play=document.createElement('button');play.type='button';play.className='tour-play';
    play.addEventListener('click',function(){setPlaying(!tour.classList.contains('playing'));});
    if(!still)nav.appendChild(play);
    function setPlaying(on){
      tour.classList.toggle('playing',on);
      play.innerHTML=on?ICON.pause:ICON.play;
      play.setAttribute('aria-label',on?'Zatrzymaj pokaz zdjęć':'Wznów pokaz zdjęć');play.title=play.getAttribute('aria-label');
      stage.setAttribute('aria-live',on?'off':'polite');
    }
    function show(i){
      i=(i+slides.length)%slides.length;if(i===cur)return;
      if(cur>=0){var old=slides[cur];old.classList.remove('on');old.classList.add('was');old.setAttribute('aria-hidden','true');
        thumbs[cur].removeAttribute('aria-current');setTimeout(function(){if(!old.classList.contains('on'))old.classList.remove('was');},1000);}
      cur=i;slides[i].classList.remove('was');slides[i].classList.add('on');slides[i].removeAttribute('aria-hidden');
      thumbs[i].setAttribute('aria-current','true');
    }
    slides.forEach(function(s){s.setAttribute('aria-hidden','true');});
    tour.classList.add('is-ready');nav.hidden=false;
    show(0);setPlaying(!still);
    nav.addEventListener('animationend',function(e){if(e.target.classList.contains('bar'))show(cur+1);});
    nav.addEventListener('keydown',function(e){
      var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
      if(d&&thumbs.indexOf(document.activeElement)>=0){e.preventDefault();show(cur+d);thumbs[cur].focus();}
    });
    var x0=null;
    stage.addEventListener('pointerdown',function(e){x0=e.pointerType==='mouse'?null:e.clientX;});
    stage.addEventListener('pointerup',function(e){if(x0===null)return;var dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40)show(cur+(dx<0?1:-1));});
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){tour.classList.toggle('offscreen',!es[0].isIntersecting);},{threshold:.3}).observe(tour);
    }
  });

  // Godziny biura i zwiedzania wg dnia tygodnia: data-hours="2=16:00-17:00 3=…" (0 = niedziela).
  // [data-today] dostaje dzisiejsze godziny albo „zamknięte”, .status — stan i najbliższe otwarcie.
  (function(){
    var dow=new Date(warsaw.today).getUTCDay();
    function fmt(r){return r.replace(/:/g,'.').replace('-','–');}
    $$('[data-hours]').forEach(function(box){
      var h={},out=box.querySelector('[data-today]'),st=box.querySelector('.status');
      box.getAttribute('data-hours').split(/\s+/).forEach(function(p){var kv=p.split('=');h[kv[0]]=kv[1];});
      function next(){
        for(var i=1;i<=7;i++){var d=(dow+i)%7;if(h[d])return 'najbliżej '+W_DNI[d]+' '+data(warsaw.today+i*DAY)+', '+fmt(h[d]);}
        return '';
      }
      var r=h[dow];
      if(!r){if(out)out.textContent='zamknięte';if(st)st.textContent=next();return;}
      if(out)out.textContent=fmt(r);
      if(!st)return;
      var a=toMin(r.split('-')[0]),b=toMin(r.split('-')[1]);
      if(now>=a&&now<b){st.textContent='otwarte teraz';st.classList.add('open');}
      else if(now<a){st.textContent='otwarcie o '+fmt(r.split('-')[0]);}
      else{st.textContent='dziś już zamknięte, '+next();}
    });
  })();

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
    var today=warsaw.today;
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
    if(best)flag(best,'soon','od '+data(bestStart));
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
