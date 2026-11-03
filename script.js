const guests = [
 {name:"Aigerim",room:"Balcony",floor:2,color:"green",time:"20:45",aitu:true,things:["cup","bag"]},
 {name:"Aliya",room:"Balcony",floor:2,color:"yellow",time:"21:15",aitu:false,things:["phone","cup"]},
 {name:"Madina",room:"Balcony",floor:2,color:"purple",time:"22:10",aitu:true,things:["phone","cup","bag"]},
 {name:"Ivan",room:"Balcony",floor:2,color:"blue",time:"20:10",aitu:true,things:["cup"]},
 {name:"Arman",room:"Hall",floor:2,color:"orange",time:"20:35",aitu:false,things:["bag","glasses"]},
 {name:"Sophia",room:"Hall",floor:2,color:"purple",time:"20:10",aitu:false,things:["phone"]},
 {name:"Dias",room:"Hall",floor:2,color:"green",time:"19:45",aitu:true,things:[]},
 {name:"Bekzat",room:"Hall",floor:2,color:"blue",time:"20:55",aitu:false,things:["bag","cup","cake"]},
 {name:"Aruzhan",room:"Hall",floor:2,color:"purple",time:"21:50",aitu:true,things:["phone"]},
 {name:"Saule",room:"Hall",floor:2,color:"green",time:"21:25",aitu:false,things:["glasses"]},
 {name:"Nurlan",room:"Kitchen",floor:1,color:"red",time:"19:40",aitu:true,things:["phone","cup"]},
 {name:"Emma",room:"Kitchen",floor:1,color:"black",time:"20:15",aitu:false,things:["bag"]},
 {name:"Timur",room:"Kitchen",floor:1,color:"green",time:"21:05",aitu:true,things:["phone","cup","bag"]},
 {name:"Sergey",room:"Kitchen",floor:1,color:"yellow",time:"20:50",aitu:false,things:["glasses","phone"]},
 {name:"Yerlan",room:"Kitchen",floor:1,color:"red",time:"21:40",aitu:true,things:["cake","phone"]},
 {name:"Kamila",room:"Kitchen",floor:1,color:"green",time:"20:05",aitu:false,things:["cup"]},
 {name:"Daniel",room:"Living room",floor:1,color:"blue",time:"19:55",aitu:true,things:["glasses"]},
 {name:"Zarina",room:"Living room",floor:1,color:"green",time:"21:10",aitu:false,things:["bag","cup","cake"]},
 {name:"Natasha",room:"Living room",floor:1,color:"yellow",time:"20:30",aitu:true,things:["bag","cup","cake"]},
 {name:"Askar",room:"Living room",floor:1,color:"black",time:"21:00",aitu:true,things:["phone"]},
 {name:"Inkar",room:"Living room",floor:1,color:"purple",time:"20:20",aitu:false,things:["bag"]}
];
const originalOrder = {};
const iconMap={phone:"▯",glasses:"♧",bag:"♙",cup:"☕",cake:"✦"};
const cases=[
 ["1","Who is in the hall?",()=>$('.room[data-room="Hall"] .guest')],
 ["2","Who is dressed in yellow or purple?",()=>$('.guest.yellow, .guest.purple')],
 ["3","Which AITU students are upstairs?",()=>$('.floor').first().find('.guest.student')],
 ["4","Who has glasses or a bag?",()=>$('.guest').filter(function(){return $(this).hasClass('glasses')||$(this).hasClass('bag')})],
 ["5","Who came with nothing at all?",()=>$('.guest[data-things=""]')],
 ["6","Who has a phone but no bag?",()=>$('.guest.phone').not('.bag')],
 ["7","Who arrived between 20:30 and 21:00 inclusive?",()=>$('.guest').filter(function(){let t=$(this).data('minutes');return t>=1230&&t<=1260})],
 ["8","Who arrived after 21:00 and is not an AITU student?",()=>$('.guest').filter(function(){return $(this).data('minutes')>1260&&!$(this).hasClass('aitu')})],
 ["9","Who stands right next to Askar?",()=>$('.guest').filter(function(){return $(this).next().is('[data-name="Askar"]')||$(this).prev().is('[data-name="Askar"]')})],
 ["10","Who stands last in each room?",()=>$('.room .guests').children('.guest:last-child')],
 ["11","Who stands third in each room?",()=>$('.room .guests').children('.guest:nth-child(3)')],
 ["12","Who stands after Timur in his room?",()=>$('.guest[data-name="Timur"]').next()],
 ["13","Who stands right before someone in black?",()=>$('.guest').filter(function(){return $(this).next('.guest.black').length>0})],
 ["14","In which room is Aruzhan?",()=>$('.guest[data-name="Aruzhan"]').closest('.room')],
 ["15","Which rooms have fewer than 6 guests?",()=>$('.room').filter(function(){return $(this).find('.guest').length<6})],
 ["16","Rooms where somebody has a cup, but nobody wears glasses",()=>$('.room').filter(function(){let $r=$(this);return $r.find('.guest.cup').length>0&&$r.find('.guest.glasses').length===0})],
 ["17","Who came first to each room?",()=>$('.room').each(function(){let $g=$(this).find('.guest').sort((a,b)=>$(a).data('minutes')-$(b).data('minutes'));$(this).data('first',$g.first())})&&$('.room').map(function(){return $(this).data('first')}).get()],
 ["18","Miras joins between Askar and Inkar",null],
 ["19","Natasha leaves the party",null],
 ["20","Who took the cake? (downstairs, 21:00–21:30, crumbs, no cup, next to AITU)",()=>$('.guest').filter(function(){let $g=$(this);return $g.data('floor')===1&&$g.data('minutes')>1260&&$g.data('minutes')<1290&&$g.hasClass('cake')&&!$g.hasClass('cup')&&($g.next('.aitu').length||$g.prev('.aitu').length)})]
];
function minutes(t){let [h,m]=t.split(':').map(Number);return h*60+m}
function card(g){let $c=$(`<button class="guest"></button>`);$c.attr({'data-name':g.name,'data-room':g.room,'data-floor':g.floor,'data-time':g.time,'data-minutes':minutes(g.time),'data-things':g.things.join(',')}).addClass(g.color);g.things.forEach(x=>$c.addClass(x));if(g.aitu)$c.addClass('student');$c.css('--ring',g.color);
 let img=`https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(g.name)}`;
 $c.append(`<img src="${img}" alt="${g.name} avatar"><strong>${g.name}</strong><small>${g.time}</small><div class="icons">${g.things.map(x=>iconMap[x]).join(' ')}</div>`);
 if(g.aitu)$c.append('<span class="aitu-badge">A</span>');return $c}
function render(){ $('.guest').stop(true,true);$('.room .guests').empty();guests.forEach(g=>$('.room[data-room="'+g.room+'"] .guests').append(card(g)));$('.guest').each(function(){let n=$(this).data('name');if(!originalOrder[n])originalOrder[n]=true;}); }
function names($items){return $items.map(function(){return $(this).data('name')||$(this).find('h3').text()}).get()}
function show($items,label){$('.guest').removeClass('spotlight');$('.guest').stop(true).fadeTo(300,.2).removeClass('pale');$items.each(function(){if($(this).hasClass('guest'))$(this).addClass('spotlight').stop(true).fadeTo(300,1);else $(this).find('.guest').stop(true).fadeTo(300,1)});let n=names($items);$('#result').text(label+' — '+n.length+': '+(n.length?n.join(', '):'No matching guests in the transcribed data.'))}
cases.forEach((c,i)=>$('#cases').append($('<button>').text('Case '+c[0]+': '+c[1]).on('click',function(){runCase(i)})));
function runCase(i){let c=cases[i];if(i===17){if(!guests.some(g=>g.name==="Miras")){let g={name:"Miras",room:"Living room",floor:1,color:"blue",time:"21:20",aitu:true,things:["phone"]};let idx=guests.findIndex(x=>x.name==="Inkar");guests.splice(idx,0,g)}render();let $m=$('.guest[data-name="Miras"]');$m.hide().insertAfter($('.guest[data-name="Askar"]')).fadeIn(600);show($m,c[1]);$m.animate({top:"-8px"},180).animate({top:"0px"},180);return}
 if(i===18){let $n=$('.guest[data-name="Natasha"]');$n.fadeOut(500,function(){$n.remove();let idx=guests.findIndex(g=>g.name==="Natasha");if(idx>=0)guests.splice(idx,1);$('#result').text('Natasha has left the party.')});return}
 render();let $found=c[2]();if(i===16){$found=$();$('.room').each(function(){let $first=$(this).find('.guest').sort((a,b)=>$(a).data('minutes')-$(b).data('minutes')).first();$found=$found.add($first)})}
 show($found,c[1]);$found.filter('.guest').each(function(){$(this).stop(true).animate({top:"-8px"},150).animate({top:"0px"},150)})}
$('#clear').on('click',function(){$('.guest').stop(true).removeClass('spotlight pale').fadeTo(200,1);$('#result').text('Spotlight cleared. All guests are visible.')});
let activeGuest=null;
$(document).on('click','.guest',function(e){e.stopPropagation();openGuest($(this))});
function openGuest($g){closeGuest();activeGuest=$g;let name=$g.data('name'),g=guests.find(x=>x.name===name);if(!g)return;let info=`<img src="https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(g.name)}" style="--ring:${g.color}"><h2>${g.name}</h2><p>Came at ${g.time}</p><p>${g.aitu?'AITU student':'Not an AITU student'}</p><p>Clothing: ${g.color}</p><p>${g.things.length?'Has: '+g.things.join(', '):'Has nothing'}</p><div class="move-buttons">${['Balcony','Hall','Kitchen','Living room'].filter(r=>r!==g.room).map(r=>`<button data-dest="${r}">Move to ${r}</button>`).join('')}</div>`;$('#guestModal .modal-content').html(info);$('#backdrop').addClass('open');$('#guestModal').stop(true).css({transform:'scale(.15)'}).animate({dummy:1},{duration:1,step:()=>$('#guestModal').css('transform','scale(1)')});}
function closeGuest(){if(!$('#backdrop').hasClass('open'))return;$('#guestModal').css('transform','scale(.15)');$('#backdrop').removeClass('open');activeGuest=null}
$('.close').on('click',closeGuest);$('#backdrop').on('click',function(e){if(e.target===this)closeGuest()});$(document).on('keydown',e=>{if(e.key==='Escape')closeGuest()});
$(document).on('click','.move-buttons button',function(){let dest=$(this).data('dest'),name=$('#guestModal h2').text(),g=guests.find(x=>x.name===name),$card=$('.guest[data-name="'+name+'"]');if(!g||!$card.length)return;let $target=$('.room[data-room="'+dest+'"] .guests'),start=$card.offset(),$clone=$card.clone().appendTo('body').css({position:'absolute',left:start.left,top:start.top,zIndex:10,width:$card.outerWidth()});$card.animate({opacity:.1,width:0},300,function(){$card.remove()});g.room=dest;g.floor=(dest==='Balcony'||dest==='Hall')?2:1;let $new=card(g).hide().appendTo($target);let end=$new.offset();$clone.animate({left:end.left,top:end.top},650,function(){$clone.remove();$new.fadeIn(250);});closeGuest()});
$('.sort').on('click',function(){let $room=$(this).closest('.room'),$list=$room.find('.guests'),key=$room.data('room');let $cards=$list.children('.guest');let sorted=$cards.toArray().sort((a,b)=>$(a).data('minutes')-$(b).data('minutes'));if($room.data('sorted'))sorted.reverse();$room.data('sorted',!$room.data('sorted'));let positions=$cards.map(function(){return $(this).position()}).get();$cards.each(function(i){$(this).stop(true).css({position:'relative'}).animate({left:0,top:0},250)});sorted.forEach(el=>$list.append(el));});
render();
