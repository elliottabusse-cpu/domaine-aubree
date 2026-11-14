(function(){
'use strict';
var D = window.AUBREE;
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = function(s,c){return (c||document).querySelector(s);};
var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};
var eur = function(n){return n.toFixed(2).replace('.',',')+' €';};
var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 8h12M9 3l5 5-5 5"/></svg>';
var TYPE = {rouge:'Rouge', blanc:'Blanc', rose:'Rosé'};

/* ---------- images ---------- */
var S = {hero:[800,1400,2400],arbre:[800,1400,2200],automne:[800,1400,2200],blanc:[800,1400],noir:[800,1400],hiver:[800,1400],rangs:[800,1400],coteau:[800,1400],vrille:[800,1400],cueillette:[800,1400],village:[800,1400],terrasses:[800,1400],cave:[800,1000],futs:[800,1000],voute:[800,1000],vendange:[800,1000],rouge:[800,1000],arbres:[1000],feuilles:[1000],couchant:[1000],vert:[1000],chai:[1000],reserve:[1000]};
function pic(k, alt, sizes, eager){
  var a = S[k], src = 'img/'+k+'-'+a[Math.min(1,a.length-1)]+'.webp';
  var ss = a.map(function(w){return 'img/'+k+'-'+w+'.webp '+w+'w';}).join(', ');
  return '<img src="'+src+'" srcset="'+ss+'" sizes="'+(sizes||'100vw')+'" alt="'+(alt||'')+'"'+(eager?' fetchpriority="high"':' loading="lazy"')+' decoding="async">';
}

/* ---------- bouteille ---------- */
var bid = 0;
function bottle(w){
  var id = 'b'+(bid++);
  return '<svg viewBox="0 0 120 410" aria-hidden="true"><defs>'+
  '<linearGradient id="'+id+'g" x1="0" x2="1"><stop offset="0" stop-color="'+w.g[0]+'"/><stop offset=".28" stop-color="'+w.g[1]+'"/><stop offset=".55" stop-color="'+w.g[0]+'"/><stop offset=".86" stop-color="'+w.g[1]+'" stop-opacity=".85"/><stop offset="1" stop-color="'+w.g[0]+'"/></linearGradient>'+
  '<linearGradient id="'+id+'c" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".35" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>'+
  '<radialGradient id="'+id+'s"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'+
  '<ellipse cx="60" cy="400" rx="50" ry="7" fill="url(#'+id+'s)"/>'+
  '<path d="M49 12H71V122C71 142 98 150 98 180V384Q98 396 86 396H34Q22 396 22 384V180C22 150 49 142 49 122Z" fill="url(#'+id+'g)"/>'+
  '<rect x="47.5" y="8" width="25" height="74" rx="3" fill="'+w.cap+'"/><rect x="47.5" y="8" width="25" height="74" rx="3" fill="url(#'+id+'c)"/><rect x="47.5" y="76" width="25" height="3" fill="#000" opacity=".2"/>'+
  '<rect x="27" y="228" width="66" height="112" rx="1.5" fill="#F5F0E6"/><rect x="31" y="232" width="58" height="104" fill="none" stroke="#1D1915" stroke-width=".5" opacity=".5"/>'+
  '<text x="60" y="254" text-anchor="middle" font-family="Instrument Sans,sans-serif" font-size="5" letter-spacing="2" fill="#6E655B">DOMAINE DE</text>'+
  '<text x="60" y="270" text-anchor="middle" font-family="Fraunces,serif" font-size="12" fill="#1D1915">L’Aubrée</text>'+
  '<line x1="48" y1="280" x2="72" y2="280" stroke="'+w.cap+'" stroke-width="1"/>'+
  '<text x="60" y="296" text-anchor="middle" font-family="Fraunces,serif" font-style="italic" font-size="'+(w.name.length>15?6.4:7.2)+'" fill="#1D1915">'+w.name+'</text>'+
  '<text x="60" y="320" text-anchor="middle" font-family="Instrument Sans,sans-serif" font-size="6" letter-spacing="1.5" fill="#4A423A">'+w.year+'</text>'+
  '<path d="M30 190Q33 300 31 380" stroke="#fff" stroke-opacity=".28" stroke-width="5" fill="none" stroke-linecap="round"/>'+
  '<path d="M90 200Q91 300 90 370" stroke="#fff" stroke-opacity=".1" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
}
function wine(id){return D.wines.filter(function(w){return w.id===id;})[0];}
function card(w){
  return '<article class="prod rv" data-type="'+w.type+'" data-price="'+w.price+'">'+
  '<div class="shotwrap"><a class="shot" href="#vin-'+w.id+'" aria-label="'+w.name+', voir la fiche">'+(w.badge?'<span class="badge">'+w.badge+'</span>':'')+bottle(w)+'</a>'+
  '<div class="quick"><button class="btn" type="button" data-add="'+w.id+'">Ajouter au panier</button></div></div>'+
  '<a class="info" href="#vin-'+w.id+'"><div><h3>'+w.name+'</h3><p class="sub">'+TYPE[w.type]+' '+w.year+' · '+w.cep+'</p></div><span class="price">'+eur(w.price)+'</span></a>'+
  '<div class="notes">'+w.notes.map(function(n){return '<span>'+n+'</span>';}).join('')+'</div></article>';
}

/* ---------- blocs réutilisés ---------- */
function banner(k, eyebrow, title, text, crumbs){
  return '<section class="pbanner">'+pic(k,'','100vw',true)+'<div class="wrap">'+
  (crumbs?'<nav class="crumbs" aria-label="Fil d’Ariane"><a href="#">Accueil</a><span>/</span>'+crumbs+'</nav>':'')+
  '<span class="eyebrow">'+eyebrow+'</span><h1>'+title+'</h1>'+(text?'<p>'+text+'</p>':'')+'</div></section>';
}
function seasons(){
  var s=[['hiver','Vignes taillées en hiver, sol couvert de givre','Décembre à mars','i.','La taille',"Chaque pied est taillé à la main. C'est la taille qui décide du rendement de l'année."],
         ['blanc','Grappes de raisin blanc sur un vieux cep','Avril à août','ii.','La vigne',"Travail du sol, effeuillage, palissage. On aère les grappes pour qu'elles mûrissent saines."],
         ['vendange','Mains tenant deux grappes de raisin blanc fraîchement cueillies','Septembre','iii.','Les vendanges',"Récolte manuelle en petites caisses, puis tri à la table avant d'entrer en cuve."],
         ['futs','Fûts de chêne alignés dans le chai','Octobre à avril','iv.',"L'élevage",'Cuves béton pour les blancs, fûts de plusieurs vins pour les rouges de garde.'],
         ['noir','Grappes de raisin noir mûr sous les feuilles',"Toute l'année",'v.','La mise en bouteille','Au domaine, sans filtration pour les rouges, quand le vin est prêt.']];
  return '<section class="year" aria-labelledby="yearTitle"><div class="wrap sechead"><div><span class="eyebrow rv">Le savoir-faire</span><h2 class="h2 rv" id="yearTitle">Une année <em>au domaine.</em></h2></div>'+
  '<div class="ctrl rv"><button type="button" data-rail="-1" aria-label="Précédent"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><button type="button" data-rail="1" aria-label="Suivant"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button></div></div>'+
  '<div class="rail" id="rail" tabindex="0" role="region" aria-label="Les étapes de l\u2019année, faire défiler horizontalement">'+s.map(function(x){return '<article class="season"><div class="ph zoom">'+pic(x[0],x[1],'(max-width:640px) 80vw, 420px')+'</div><div class="k"><span>'+x[2]+'</span><b>'+x[3]+'</b></div><h3>'+x[4]+'</h3><p>'+x[5]+'</p></article>';}).join('')+'</div>'+
  '<div class="progress" aria-hidden="true"><i id="prog"></i></div></section>';
}
function postCard(p, big){
  return '<article class="post rv" data-cat="'+p.cat+'"><a href="#article-'+p.id+'"><div class="ph zoom">'+pic(p.img,'',big?'(max-width:1100px) 100vw, 45vw':'(max-width:640px) 100vw, 30vw')+'</div><div class="m"><b>'+p.cat+'</b><span>'+p.date+'</span></div><h3>'+p.title+'</h3>'+(big===2?'<p class="ex">'+p.ex+'</p>':'')+'</a></article>';
}
function newsletter(){
  return '<section class="news" aria-labelledby="newsTitle"><div class="wrap"><div class="box rv">'+pic('rouge','','100vw')+
  '<span class="eyebrow">Lettre du domaine</span><h2 class="h2" id="newsTitle">Les nouveaux millésimes, <em>avant tout le monde.</em></h2>'+
  '<p>Quatre lettres par an : sorties de millésimes, dates de portes ouvertes et nouvelles des vignes. Pas plus.</p>'+
  '<form class="nform" novalidate><label for="mail" style="position:absolute;left:-9999px">Adresse e-mail</label><input id="mail" type="email" placeholder="Votre adresse e-mail" required autocomplete="email"><button class="btn light" type="submit">S’inscrire</button></form><p class="msg" role="status"></p></div></div></section>';
}
function ctaBand(k, eyebrow, title, text, href, label){
  return '<section class="sec tight"><div class="wrap"><div class="band rv">'+pic(k,'','100vw')+'<div><span class="eyebrow">'+eyebrow+'</span><h2 class="h2" style="margin-top:18px">'+title+'</h2><p>'+text+'</p></div><a class="btn light" href="'+href+'">'+label+' '+ARROW+'</a></div></div></section>';
}

/* ---------- pages ---------- */
var V = {};

V.home = function(){
  var feat = ['grands-rangs','coteau-aube','pierre-levee','fleur-galets'].map(wine);
  return '<section class="hero" aria-label="Accueil">'+pic('hero','Coteau planté de vignes, une petite maison de vigne au premier plan et la vallée en contrebas','100vw',true)+
  '<span class="meta">Le coteau, en novembre</span><div class="content"><div class="wrap grid">'+
  '<h1><span class="l"><span>Des vins de coteau,</span></span><span class="l"><span><em>élevés sans hâte.</em></span></span></h1>'+
  '<div class="side"><p>Dix-huit hectares sur un sol calcaire, travaillés à la main et vinifiés au domaine depuis quatre générations.</p>'+
  '<div class="btns"><a class="btn light" href="#vins">Découvrir nos vins '+ARROW+'</a><a class="btn line-light" href="#visites">Réserver une visite</a></div></div></div></div><span class="scrollcue" aria-hidden="true"></span></section>'+

  '<section class="intro"><div class="wrap"><div class="grid"><div>'+
  '<span class="eyebrow rv">Le domaine</span><p class="statement rv">Ici, on taille à la main, on vendange en caisses et on laisse <em>le temps</em> faire une partie du travail.</p>'+
  '<p class="lead rv">Le domaine est né en 1952 de trois hectares de vigne. Il s’étend aujourd’hui sur dix-huit hectares d’un seul tenant, à flanc de coteau. Chaque parcelle est vinifiée séparément pour que le vin garde la trace de son sol.</p>'+
  '<a class="btn ghost rv" href="#domaine">Notre histoire '+ARROW+'</a>'+
  '<div class="sign rv"><div class="av">'+pic('vrille','','52px')+'</div><div><b>Claire et Antoine Delmas</b><span>Vignerons, quatrième génération (personnages fictifs)</span></div></div></div>'+
  '<div class="collage rv"><div class="a zoom">'+pic('arbre','Rangs de vigne au printemps, un arbre isolé sur la colline','(max-width:960px) 90vw, 45vw')+'</div><div class="b zoom">'+pic('vrille',"Vrille de vigne enroulée autour d'un fil de palissage",'(max-width:960px) 45vw, 22vw')+'</div><div class="tag"><b>1987</b>Première mise en bouteille au domaine</div></div></div>'+
  '<div class="stats"><div class="rv"><b>18<sup>ha</sup></b><span>D’un seul tenant, à flanc de coteau</span></div><div class="rv"><b>4</b><span>Cépages, vinifiés parcelle par parcelle</span></div><div class="rv"><b>320<sup>m</sup></b><span>D’altitude moyenne, nuits fraîches</span></div><div class="rv"><b>18<sup>mois</sup></b><span>D’élevage pour notre cuvée de garde</span></div></div></div></section>'+

  '<section class="wines"><div class="wrap"><div class="sechead"><div><span class="eyebrow rv">La boutique</span><h2 class="h2 rv">Nos vins, <em>du domaine à votre table.</em></h2></div><a class="ulink rv" href="#vins">Voir les 8 vins</a></div>'+
  '<div class="products">'+feat.map(card).join('')+'</div><div class="more rv"><a class="btn ghost" href="#vins">Toute la boutique '+ARROW+'</a></div></div></section>'+

  '<section class="terroir"><div class="bg" data-parallax>'+pic('automne','Rangs de vigne aux feuilles rouges et dorées en automne sous un ciel bleu','100vw')+'</div><div class="wrap">'+
  '<span class="eyebrow rv">Terroir</span><h2 class="h2 rv">Un sol pauvre, <em>des vignes qui cherchent.</em></h2>'+
  '<p class="lead rv">Sur le calcaire, les racines descendent profondément pour trouver l’eau. Les rendements sont faibles, les raisins concentrés. Le vent du nord sèche les grappes après la pluie et limite les traitements.</p>'+
  '<div class="facts"><div class="rv"><b>Calcaire</b><span>Argilo-calcaire, galets en surface</span></div><div class="rv"><b>Sud-est</b><span>Exposition, soleil du matin</span></div><div class="rv"><b>35 hl/ha</b><span>Rendement moyen</span></div></div>'+
  '<p class="rv" style="margin-top:44px"><a class="btn line-light" href="#domaine">Le terroir en détail</a></p></div></section>'+

  seasons()+

  '<section class="visits"><div class="wrap"><div class="grid rv"><div class="ph">'+pic('cave',"Galerie voûtée en briques du chai, bouteilles en rangs de part et d'autre",'(max-width:960px) 100vw, 50vw')+'</div><div class="txt">'+
  '<span class="eyebrow">Œnotourisme</span><h2 class="h2">Visiter <em>le domaine.</em></h2><p class="lead">Une balade dans les vignes, le chai, puis une dégustation commentée avec l’un de nous. D’avril à octobre, du mardi au samedi, sur réservation.</p>'+
  '<div class="offers">'+D.offers.map(function(o){return '<div class="offer"><h3>'+o.name+'</h3><p>'+o.items[0]+' · '+o.dur+'</p><div class="r"><b>'+o.price+' €</b><button type="button" data-book="'+o.name+'">Réserver</button></div></div>';}).join('')+'</div>'+
  '<p style="margin-top:32px"><a class="btn light" href="#visites">Toutes les visites '+ARROW+'</a></p></div></div></div></section>'+

  '<section class="journal"><div class="wrap"><div class="sechead"><div><span class="eyebrow rv">Journal</span><h2 class="h2 rv">Nouvelles <em>du coteau.</em></h2></div><a class="ulink rv" href="#journal">Tous les articles</a></div>'+
  '<div class="posts">'+D.posts.slice(0,3).map(function(p,i){return postCard(p,i===0);}).join('')+'</div></div></section>'+
  newsletter();
};

V.domaine = function(){
  return banner('arbre','Le domaine','Quatre générations <em>sur le même coteau.</em>','Une famille, dix-huit hectares et une façon de travailler qui a peu changé depuis 1952.','<span>Le domaine</span>')+
  '<section class="sec"><div class="wrap split"><div class="prose">'+
  '<span class="eyebrow rv">Notre histoire</span><h2 class="h2 rv">D’une parcelle <em>à un domaine.</em></h2>'+
  '<p class="big rv">Tout commence en 1952, avec trois hectares de vigne achetés par le grand-père de Claire, au-dessus du village.</p>'+
  '<p class="rv">Pendant trente-cinq ans, le raisin part à la coopérative. En 1987, la famille décide de vinifier elle-même et met en bouteille sa première cuvée. Le domaine grandit ensuite au rythme des parcelles voisines qui se libèrent, toujours sur le même coteau.</p>'+
  '<p class="rv">Claire et Antoine ont repris le domaine en 2022. Ils ont gardé l’essentiel : le travail à la main, les vendanges en caisses, la vinification parcelle par parcelle.</p></div>'+
  '<div class="ph rv zoom">'+pic('village','Vignes sur le coteau au-dessus du village','(max-width:960px) 100vw, 45vw')+'</div></div>'+
  '<div class="wrap"><div class="tline">'+
  [['1952','Les premières vignes','Trois hectares plantés au-dessus du village.'],['1987','Première mise en bouteille','La famille quitte la coopérative et vinifie au domaine.'],['2004','Le nouveau chai','Un chai enterré pour garder la fraîcheur sans climatisation.'],['2015','Fin des herbicides','Les sols sont travaillés et enherbés.'],['2022','Une nouvelle génération','Claire et Antoine reprennent le domaine.']].map(function(t){return '<div class="rv"><b>'+t[0]+'</b><h3>'+t[1]+'</h3><p>'+t[2]+'</p></div>';}).join('')+
  '</div></div></section>'+

  '<section class="sec alt"><div class="wrap"><span class="eyebrow rv">Notre façon de travailler</span><h2 class="h2 rv" style="margin-top:20px;max-width:18ch">Peu de règles, <em>mais tenues.</em></h2>'+
  '<div class="vals">'+[['i.','Le sol avant tout','Pas d’herbicides, un rang sur deux enherbé, des engrais verts semés chaque automne.'],['ii.','Tout à la main','Taille, ébourgeonnage et vendanges manuelles, en petites caisses de 15 kg.'],['iii.','Intervenir peu','Levures indigènes, peu de soufre, pas de filtration pour les rouges.']].map(function(v){return '<div class="rv"><span class="n">'+v[0]+'</span><h3>'+v[1]+'</h3><p>'+v[2]+'</p></div>';}).join('')+'</div></div></section>'+

  '<section class="sec"><div class="wrap split rev"><div class="prose">'+
  '<span class="eyebrow rv">Terroir</span><h2 class="h2 rv">Calcaire, vent <em>et soleil du matin.</em></h2>'+
  '<p class="rv">Le coteau s’étage entre 260 et 380 mètres. En bas, des argiles et des galets roulés donnent des vins de fruit. En haut, la roche affleure : les racines s’y enfoncent et donnent nos cuvées les plus profondes.</p>'+
  '<table class="spec rv" style="margin-top:34px"><tr><th>Surface</th><td>18 hectares d’un seul tenant</td></tr><tr><th>Sols</th><td>Argilo-calcaires, galets, roche affleurante</td></tr><tr><th>Exposition</th><td>Sud-est</td></tr><tr><th>Altitude</th><td>260 à 380 m</td></tr><tr><th>Cépages</th><td>Syrah, grenache, cinsault, chardonnay, viognier</td></tr><tr><th>Âge moyen des vignes</th><td>35 ans</td></tr></table></div>'+
  '<div class="ph rv zoom">'+pic('automne','Vignes en automne sur sol caillouteux','(max-width:960px) 100vw, 45vw')+'</div></div></section>'+

  '<section class="sec tight"><div class="wrap"><div class="gal rv">'+
  ['cueillette','chai','vrille','coteau','feuilles'].map(function(k){return '<div class="zoom">'+pic(k,'','(max-width:960px) 50vw, 33vw')+'</div>';}).join('')+'</div></div></section>'+
  seasons()+
  ctaBand('cave','Venir au domaine','Le mieux reste <em>de venir goûter.</em>','Visites et dégustations d’avril à octobre, du mardi au samedi.','#visites','Voir les visites');
};

V.vins = function(){
  return banner('automne','La boutique','Nos <em>vins.</em>','Huit cuvées, toutes issues du coteau. Livraison offerte dès six bouteilles.','<span>Nos vins</span>')+
  '<section class="sec"><div class="wrap"><h2 class="sr">Toutes nos cuvées</h2>'+
  '<div class="toolbar"><div class="tabs" role="group" aria-label="Filtrer par couleur"><button type="button" data-f="all" aria-pressed="true">Tous</button><button type="button" data-f="rouge" aria-pressed="false">Rouges</button><button type="button" data-f="blanc" aria-pressed="false">Blancs</button><button type="button" data-f="rose" aria-pressed="false">Rosés</button></div>'+
  '<div class="right"><span class="cnt" id="cnt" role="status">8 vins</span><label for="sort" style="position:absolute;left:-9999px">Trier</label><select class="sel" id="sort"><option value="">Notre sélection</option><option value="asc">Prix croissant</option><option value="desc">Prix décroissant</option></select></div></div>'+
  '<div class="products cat" id="grid">'+D.wines.map(card).join('')+'</div>'+
  '<div class="perks3" style="margin-top:100px">'+[['Livraison offerte','Dès six bouteilles, partout en France métropolitaine.'],['Emballage protégé','Cartons renforcés, expédition sous 48 h ouvrées.'],['Retrait au domaine','Gratuit, du mardi au samedi.']].map(function(p){return '<div class="rv"><b>'+p[0]+'</b><p>'+p[1]+'</p></div>';}).join('')+'</div>'+
  '</div></section>'+newsletter();
};

V.vin = function(id){
  var w = wine(id); if(!w) return V.nf();
  var rel = D.wines.filter(function(x){return x.id!==w.id;}).sort(function(a,b){return (b.type===w.type)-(a.type===w.type);}).slice(0,4);
  return '<section class="pagetop"><div class="wrap">'+
  '<nav class="crumbs" aria-label="Fil d’Ariane"><a href="#">Accueil</a><span>/</span><a href="#vins">Nos vins</a><span>/</span><span>'+w.name+'</span></nav>'+
  '<div class="pp"><div class="stage">'+(w.badge?'<span class="badge">'+w.badge+'</span>':'')+bottle(w)+'</div><div>'+
  '<span class="eyebrow">'+TYPE[w.type]+' · '+w.year+'</span><h1>'+w.name+'</h1><p class="type">'+w.cep+' · Vin de France · 75 cl</p>'+
  '<p class="price">'+eur(w.price)+'</p><p class="tax">TTC, soit '+eur(w.price/0.75)+' le litre</p>'+
  '<p class="desc">'+w.desc+'</p>'+
  '<div class="buy"><div class="qty"><button type="button" data-pq="-1" aria-label="Retirer une bouteille">−</button><span id="pq">1</span><button type="button" data-pq="1" aria-label="Ajouter une bouteille">+</button></div><button class="btn" type="button" data-addq="'+w.id+'">Ajouter au panier</button></div>'+
  '<div class="perks"><span>Livraison offerte dès 6 bouteilles</span><span>Expédition sous 48 h ouvrées</span><span>Retrait gratuit au domaine</span></div>'+
  '<details class="acc" open><summary>Dégustation</summary><div class="body"><p>'+w.taste+'</p></div></details>'+
  '<details class="acc"><summary>Accords mets et vin</summary><div class="body"><div class="pairs">'+w.pairs.map(function(p){return '<span>'+p+'</span>';}).join('')+'</div></div></details>'+
  '<details class="acc"><summary>Service et garde</summary><div class="body"><p>Servir entre '+w.temp+'. À boire de '+w.garde+'.</p></div></details>'+
  '<details class="acc"><summary>Fiche technique</summary><div class="body"><table class="spec"><tr><th>Cépages</th><td>'+w.cep+'</td></tr><tr><th>Sol</th><td>'+w.sol+'</td></tr><tr><th>Élevage</th><td>'+w.elev+'</td></tr><tr><th>Degré</th><td>'+w.degre+'</td></tr><tr><th>Contenance</th><td>75 cl</td></tr></table></div></details>'+
  '</div></div></div></section>'+
  '<section class="sec"><div class="wrap"><div class="sechead"><div><span class="eyebrow rv">À découvrir aussi</span><h2 class="h2 rv">Vous aimerez <em>aussi.</em></h2></div><a class="ulink rv" href="#vins">Tous nos vins</a></div><div class="products">'+rel.map(card).join('')+'</div></div></section>';
};

V.visites = function(){
  return banner('terrasses','Œnotourisme','Visiter <em>le domaine.</em>','D’avril à octobre, du mardi au samedi, sur réservation. Visites en français et en anglais.','<span>Visites</span>')+
  '<section class="sec"><div class="wrap"><div class="sechead"><div><span class="eyebrow rv">Nos formules</span><h2 class="h2 rv">Trois façons <em>de découvrir le coteau.</em></h2></div></div>'+
  '<div class="formules">'+D.offers.map(function(o){return '<article class="fm rv"><div class="ph zoom">'+pic(o.img,'','(max-width:960px) 100vw, 33vw')+'</div><div class="b"><h3>'+o.name+'</h3><p class="meta">Durée : '+o.dur+'</p><ul>'+o.items.map(function(i){return '<li>'+i+'</li>';}).join('')+'</ul><div class="foot"><div><b>'+o.price+' €</b><small>par personne</small></div><button class="btn" type="button" data-book="'+o.name+'">Réserver</button></div></div></article>';}).join('')+'</div></div></section>'+
  '<section class="sec alt"><div class="wrap"><span class="eyebrow rv">Infos pratiques</span><h2 class="h2 rv" style="margin:20px 0 56px">Avant <em>de venir.</em></h2><div class="infos">'+
  [['Horaires','Du mardi au samedi, de 10 h à 12 h 30 et de 14 h à 18 h. Fermé en novembre et en janvier.'],['Accès','À 15 minutes de la gare la plus proche. Parking gratuit au domaine. Adresse fictive, site de démonstration.'],['Accessibilité','Le chai et la salle de dégustation sont accessibles en fauteuil. La balade dans les vignes ne l’est pas.'],['Groupes','Au-delà de 10 personnes, écrivez-nous pour une visite privée et un tarif adapté.']].map(function(i){return '<div class="rv"><h3>'+i[0]+'</h3><p>'+i[1]+'</p></div>';}).join('')+
  '</div></div></section>'+
  '<section class="sec"><div class="wrap"><span class="eyebrow rv">Questions fréquentes</span><h2 class="h2 rv" style="margin-top:20px">Bon <em>à savoir.</em></h2><div class="faq">'+
  [['Faut-il réserver ?','Oui, toutes les visites se font sur réservation, au moins 48 h à l’avance.'],['Les enfants peuvent-ils venir ?','Oui, la visite est gratuite pour les mineurs. Ils ne participent pas à la dégustation ; nous leur proposons un jus de raisin du domaine.'],['Peut-on acheter du vin sur place ?','Oui, toute la gamme est disponible à la boutique du domaine, avec possibilité d’expédition.'],['Que se passe-t-il en cas de pluie ?','La balade dans les vignes est remplacée par une visite plus longue du chai. Les autres formules ne changent pas.'],['Comment annuler ?','Écrivez-nous au moins 24 h avant : la réservation est annulée sans frais.']].map(function(q,i){return '<details class="acc rv"'+(i===0?' open':'')+'><summary>'+q[0]+'</summary><div class="body"><p>'+q[1]+'</p></div></details>';}).join('')+
  '</div></div></section>'+
  ctaBand('cave','Réservation','Choisissez <em>votre date.</em>','Réponse sous 24 h ouvrées. Sur ce site de démonstration, aucune demande n’est envoyée.','#visites','Réserver une visite').replace('href="#visites">Réserver','href="#visites" data-book="Découverte">Réserver');
};

V.journal = function(){
  var cats = ['Tous'].concat(D.posts.map(function(p){return p.cat;}).filter(function(c,i,a){return a.indexOf(c)===i;}));
  return banner('rangs','Journal','Nouvelles <em>du coteau.</em>','La vie du domaine, au fil des saisons.','<span>Journal</span>')+
  '<section class="sec"><div class="wrap"><h2 class="sr">Tous les articles</h2><div class="chips" role="group" aria-label="Filtrer par thème">'+cats.map(function(c,i){return '<button type="button" data-cat="'+c+'" aria-pressed="'+(i===0)+'">'+c+'</button>';}).join('')+'</div>'+
  '<div class="posts all">'+D.posts.map(function(p){return postCard(p,2);}).join('')+'</div></div></section>'+newsletter();
};

V.article = function(id){
  var p = D.posts.filter(function(x){return x.id===id;})[0]; if(!p) return V.nf();
  var rel = D.posts.filter(function(x){return x.id!==p.id;}).slice(0,3);
  return banner(p.img, p.cat+' · '+p.date, p.title, '', '<a href="#journal">Journal</a><span>/</span><span>'+p.cat+'</span>').replace('<h1>','<h1 style="max-width:20ch;font-size:clamp(38px,5vw,76px)">')+
  '<section class="sec"><div class="wrap"><article class="art"><p class="lede">'+p.lede+'</p>'+
  '<p>'+p.body[0]+'</p><p>'+p.body[1]+'</p>'+
  '<figure><div class="ph">'+pic(p.fig,p.figcap,'(max-width:1100px) 100vw, 1040px')+'</div><figcaption>'+p.figcap+'</figcaption></figure>'+
  '<blockquote>'+p.quote+'</blockquote><p>'+p.body[2]+'</p>'+
  '<div class="share"><span>Claire et Antoine Delmas (personnages fictifs)</span><span class="s"><a class="ulink" href="#journal">Retour au journal</a><button class="ulink" type="button" data-copy style="border:0;background-color:transparent;padding:0 0 2px">Copier le lien</button></span></div></article></div></section>'+
  '<section class="journal"><div class="wrap"><div class="sechead"><div><span class="eyebrow rv">À lire aussi</span><h2 class="h2 rv">Dans <em>le journal.</em></h2></div></div><div class="posts">'+rel.map(function(x,i){return postCard(x,i===0);}).join('')+'</div></div></section>';
};

V.contact = function(){
  return '<section class="pagetop sec" style="padding-top:170px"><div class="wrap"><nav class="crumbs" aria-label="Fil d’Ariane"><a href="#">Accueil</a><span>/</span><span>Contact</span></nav>'+
  '<div class="contact" style="margin-top:30px"><div class="cinfo"><span class="eyebrow">Contact</span><h1>Nous <em>écrire.</em></h1><p class="lead">Une question sur un vin, une commande, une visite de groupe ? Nous répondons sous 48 h ouvrées.</p>'+
  '<h2>Adresse</h2><p>Chemin du Coteau<br>00000 L’Aubrée (adresse fictive)</p>'+
  '<h2>Boutique du domaine</h2><p>Du mardi au samedi, de 10 h à 12 h 30 et de 14 h à 18 h</p>'+
  '<h2>Professionnels et presse</h2><p>Cavistes, restaurateurs, journalistes : précisez-le dans l’objet de votre message.</p>'+
  '<div class="ph zoom">'+pic('village','Le coteau et le village','(max-width:960px) 100vw, 40vw')+'</div></div>'+
  '<form class="form" id="cform" novalidate><h2>Votre message</h2>'+
  '<div class="field"><label for="cSub">Objet</label><select id="cSub"><option>Une question sur un vin</option><option>Une commande</option><option>Une visite de groupe</option><option>Professionnels</option><option>Autre</option></select></div>'+
  '<div class="row2"><div class="field"><label for="cName">Nom</label><input id="cName" type="text" autocomplete="name" required></div><div class="field"><label for="cMail">E-mail</label><input id="cMail" type="email" autocomplete="email" required></div></div>'+
  '<div class="field"><label for="cMsg">Message</label><textarea id="cMsg" required></textarea></div>'+
  '<label class="check"><input type="checkbox" id="cOk"><span>J’accepte que mes données soient utilisées pour répondre à ma demande. Voir la <a href="#mentions">politique de confidentialité</a>.</span></label>'+
  '<button class="btn" type="submit" style="width:100%;justify-content:center">Envoyer</button><p class="err" id="cErr" role="status"></p></form></div></div></section>';
};

function legal(title, eyebrow, sections){
  return '<section class="pagetop sec" style="padding-top:170px"><div class="wrap legal-page"><nav class="crumbs" aria-label="Fil d’Ariane"><a href="#">Accueil</a><span>/</span><span>'+eyebrow+'</span></nav>'+
  '<h1>'+title+'</h1><p class="note">Exemple de structure pour un site de démonstration. Sur un vrai site, ces textes sont rédigés pour le client et validés avant la mise en ligne.</p>'+
  sections.map(function(s){return '<h2>'+s[0]+'</h2>'+s[1];}).join('')+'</div></section>';
}
V.mentions = function(){return legal('Mentions légales et confidentialité','Mentions légales',[
  ['Éditeur du site','<p>Domaine de l’Aubrée, domaine fictif. Raison sociale, forme juridique, capital, numéro SIRET, numéro de TVA intracommunautaire et directeur de la publication à compléter pour un vrai client.</p>'],
  ['Hébergement','<p>Nom, adresse et téléphone de l’hébergeur à compléter.</p>'],
  ['Propriété intellectuelle','<p>Les textes, la mise en page et les éléments graphiques du site sont protégés. Toute reproduction sans autorisation est interdite.</p>'],
  ['Crédits photographiques','<p>Photographies issues du domaine public ou publiées sous licence CC0 : Wikimedia Commons (dont « Paysage et vignoble à Vézelay en novembre 2014 », « Beaune (Côte d’Or) Vignobles », « Autumn vineyards », vignes de Chateaux Luna, Verzenay, vallée du Douro, Moselle) et rawpixel. Les bouteilles sont des illustrations.</p>'],
  ['Données personnelles','<p>Les données saisies dans les formulaires servent uniquement à répondre aux demandes. Elles ne sont ni vendues ni cédées. Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression. Sur ce site de démonstration, aucune donnée n’est envoyée ni conservée.</p>'],
  ['Alcool','<p>La vente d’alcool aux mineurs est interdite (article L3342-1 du Code de la santé publique). L’abus d’alcool est dangereux pour la santé, à consommer avec modération.</p>']]);};
V.cgv = function(){return legal('Conditions générales de vente','CGV',[
  ['Objet','<p>Les présentes conditions régissent les ventes de vins réalisées sur le site du domaine.</p>'],
  ['Vente aux personnes majeures','<p>La vente d’alcool est réservée aux personnes majeures. En passant commande, le client certifie avoir au moins 18 ans. Le domaine peut demander une preuve d’âge à la livraison.</p>'],
  ['Prix','<p>Les prix sont indiqués en euros, toutes taxes comprises, hors frais de livraison. La livraison est offerte dès six bouteilles en France métropolitaine.</p>'],
  ['Commande et paiement','<p>La commande est validée après paiement. Moyens de paiement, sécurisation et confirmation à préciser pour un vrai client.</p>'],
  ['Livraison','<p>Expédition sous 48 h ouvrées en emballage renforcé. Délais et transporteurs à préciser.</p>'],
  ['Droit de rétractation','<p>Le client dispose de 14 jours à compter de la réception pour exercer son droit de rétractation, les bouteilles devant être retournées intactes.</p>']]);};
V.cookies = function(){return legal('Gestion des cookies','Cookies',[
  ['Qu’est-ce qu’un cookie ?','<p>Un petit fichier déposé sur votre appareil lors de la visite d’un site, qui permet par exemple de mémoriser vos choix.</p>'],
  ['Cookies utilisés','<ul><li>Nécessaires : mémorisation de votre panier et de votre réponse au contrôle d’âge. Ils ne peuvent pas être désactivés.</li><li>Mesure d’audience : statistiques de visite anonymes, seulement avec votre accord.</li></ul>'],
  ['Modifier vos choix','<p>Vous pouvez changer d’avis à tout moment.</p><p style="margin-top:20px"><button class="btn ghost" type="button" data-cookies>Gérer mes cookies</button></p>']]);};
V.nf = function(){return '<section class="nf"><div class="wrap"><span class="eyebrow">Erreur 404</span><h1 class="h2">Cette page <em>n’existe pas.</em></h1><a class="btn" href="#">Retour à l’accueil '+ARROW+'</a></div></section>';};

/* ---------- routeur ---------- */
var ROUTES = {
  '':        {v:V.home, t:'Vins de coteau', nav:''},
  domaine:   {v:V.domaine, t:'Le domaine', nav:'domaine'},
  vins:      {v:V.vins, t:'Nos vins', nav:'vins'},
  visites:   {v:V.visites, t:'Visites', nav:'visites'},
  journal:   {v:V.journal, t:'Journal', nav:'journal'},
  contact:   {v:V.contact, t:'Contact', nav:'contact', solid:true},
  mentions:  {v:V.mentions, t:'Mentions légales', solid:true},
  cgv:       {v:V.cgv, t:'Conditions générales de vente', solid:true},
  cookies:   {v:V.cookies, t:'Cookies', solid:true}
};
var view = $('#view'), hdr = $('#hdr'), solidRoute = false, io = null, firstDone = false;
function route(){
  var h = location.hash.replace(/^#/,''), r, arg;
  if(h.indexOf('vin-')===0){ r={v:V.vin,t:(wine(h.slice(4))||{}).name||'Vin',nav:'vins',solid:true}; arg=h.slice(4); }
  else if(h.indexOf('article-')===0){ var p=D.posts.filter(function(x){return x.id===h.slice(8);})[0]; r={v:V.article,t:p?p.title:'Journal',nav:'journal'}; arg=h.slice(8); }
  else r = ROUTES[h] || {v:V.nf,t:'Page introuvable',solid:true};
  bid = 0;
  view.innerHTML = r.v(arg);
  if(firstDone){view.classList.remove('anim'); void view.offsetWidth; view.classList.add('anim');} firstDone=true;
  document.title = r.t+' · Domaine de l’Aubrée (démonstration)';
  solidRoute = !!r.solid;
  $$('[data-nav]').forEach(function(a){a.classList.toggle('active', a.dataset.nav===r.nav && r.nav!=='');});
  setMenu(false); closeAll(true);
  window.scrollTo(0,0);
  bind(); onScroll();
}
addEventListener('hashchange', route);

/* ---------- comportements de page ---------- */
function bind(){
  // apparitions
  if(io) io.disconnect();
  var els = $$('.rv', view);
  if('IntersectionObserver' in window && !reduce){
    io = new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(e){io.observe(e);});
  } else els.forEach(function(e){e.classList.add('in');});
  // carrousel
  var rail = $('#rail', view), prog = $('#prog', view);
  if(rail){
    var prg = function(){var m=rail.scrollWidth-rail.clientWidth, f=m>0?rail.scrollLeft/m:0, vis=Math.max(.15,rail.clientWidth/rail.scrollWidth);prog.style.width=(vis*100)+'%';prog.style.transform='translateX('+(f*(1/vis-1)*100)+'%)';};
    rail.addEventListener('scroll', prg, {passive:true}); prg();
  }
  // filtres et tri boutique
  var grid = $('#grid', view);
  if(grid){
    var apply = function(){
      var f = ($('.tabs [aria-pressed=true]', view)||{}).dataset.f, s = $('#sort', view).value;
      var cards = $$('.prod', grid);
      if(s){cards.sort(function(a,b){return s==='asc'?a.dataset.price-b.dataset.price:b.dataset.price-a.dataset.price;});}
      else cards.sort(function(a,b){return D.wines.indexOf(wine(idOf(a)))-D.wines.indexOf(wine(idOf(b)));});
      cards.forEach(function(c){grid.appendChild(c);c.classList.toggle('hide', f!=='all' && c.dataset.type!==f);});
      var n = cards.filter(function(c){return !c.classList.contains('hide');}).length;
      $('#cnt', view).textContent = n+' vin'+(n>1?'s':'');
    };
    var idOf = function(c){return c.querySelector('[data-add]').dataset.add;};
    $$('.tabs button', view).forEach(function(b){b.addEventListener('click',function(){$$('.tabs button',view).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});apply();});});
    $('#sort', view).addEventListener('change', apply);
  }
  // filtres journal
  $$('.chips button', view).forEach(function(b){b.addEventListener('click',function(){
    $$('.chips button',view).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});
    $$('.posts.all .post',view).forEach(function(p){p.classList.toggle('hide', b.dataset.cat!=='Tous' && p.dataset.cat!==b.dataset.cat);});
  });});
  // lettre d'information
  $$('.nform', view).forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
    var v=f.querySelector('input').value.trim(), m=f.parentNode.querySelector('.msg');
    m.textContent=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?'Merci. Sur un vrai site, vous recevriez un e-mail de confirmation. Ici, rien n’est envoyé.':'Vérifiez votre adresse e-mail.';});});
  // contact
  var cf = $('#cform', view);
  if(cf) cf.addEventListener('submit', function(e){e.preventDefault();
    var bad=[], n=$('#cName'), m=$('#cMail'), t=$('#cMsg');
    [n,m,t].forEach(function(x){x.setAttribute('aria-invalid','false');});
    if(!n.value.trim()){bad.push('votre nom');n.setAttribute('aria-invalid','true');}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim())){bad.push('une adresse e-mail valide');m.setAttribute('aria-invalid','true');}
    if(!t.value.trim()){bad.push('votre message');t.setAttribute('aria-invalid','true');}
    if(!$('#cOk').checked) bad.push('votre accord pour le traitement des données');
    $('#cErr').style.color = bad.length?'#A3242F':'var(--sage)';
    $('#cErr').textContent = bad.length?'Merci d’indiquer : '+bad.join(', ')+'.':'Message prêt à partir. Sur ce site de démonstration, rien n’est envoyé.';
  });
}

/* ---------- panier ---------- */
var cart = {}, FREE = 6;
try{cart = JSON.parse(localStorage.getItem('aubree-cart')||'{}')||{};}catch(e){cart={};}
function save(){try{localStorage.setItem('aubree-cart',JSON.stringify(cart));}catch(e){}}
function renderCart(){
  var ids = Object.keys(cart).filter(wine), n=0, t=0;
  ids.forEach(function(id){n+=cart[id];t+=cart[id]*wine(id).price;});
  var c = $('#count'); c.textContent=n; c.classList.toggle('on', n>0);
  $('#total').textContent = eur(t);
  var left = Math.max(0, FREE-n);
  $('#ship').innerHTML = (left?'Plus que <b>'+left+' bouteille'+(left>1?'s':'')+'</b> pour la livraison offerte.':'<b>Livraison offerte</b> sur votre commande.')+'<div class="bar"><i style="width:'+Math.min(100,n/FREE*100)+'%"></i></div>';
  $('#items').innerHTML = ids.length ? ids.map(function(id){var w=wine(id);
    return '<div class="item"><div class="th">'+bottle(w)+'</div><div><h3>'+w.name+'</h3><small>'+TYPE[w.type]+' '+w.year+'</small><div class="qty"><button type="button" data-q="-1" data-id="'+id+'" aria-label="Retirer une bouteille">−</button><span>'+cart[id]+'</span><button type="button" data-q="1" data-id="'+id+'" aria-label="Ajouter une bouteille">+</button></div></div><span class="p">'+eur(w.price*cart[id])+'</span></div>';
  }).join('') : '<p class="empty">Votre panier est vide.<br><a class="ulink" href="#vins" data-close>Découvrir nos vins</a></p>';
  save();
}
var lastFocus = null;
function open(el){lastFocus=document.activeElement;el.classList.add('on');el.inert=false;$('#scrim').classList.add('on');var f=el.querySelector('button,select,input');if(f)setTimeout(function(){f.focus();},60);}
function closeAll(silent){['#drawer','#book'].forEach(function(s){$(s).classList.remove('on');$(s).inert=true;});$('#scrim').classList.remove('on');if(lastFocus&&!silent)lastFocus.focus();}
function add(id,q){cart[id]=(cart[id]||0)+q;renderCart();open($('#drawer'));}

document.addEventListener('click', function(e){
  var t = e.target;
  var a = t.closest('[data-add]'); if(a){add(a.dataset.add,1);return;}
  var aq = t.closest('[data-addq]'); if(aq){add(aq.dataset.addq, +$('#pq').textContent);return;}
  var pq = t.closest('[data-pq]'); if(pq){var s=$('#pq');s.textContent=Math.max(1,Math.min(36,+s.textContent+ +pq.dataset.pq));return;}
  var q = t.closest('[data-q]'); if(q){var k=q.dataset.id;cart[k]+= +q.dataset.q;if(cart[k]<=0)delete cart[k];renderCart();return;}
  var bk = t.closest('[data-book]'); if(bk){e.preventDefault();$('#bOffer').value=bk.dataset.book;$('#bookDone').style.display='none';open($('#book'));return;}
  var rl = t.closest('[data-rail]'); if(rl){var r=$('#rail'),s1=r.querySelector('.season');r.scrollBy({left:(+rl.dataset.rail)*(s1?s1.getBoundingClientRect().width+28:400),behavior:reduce?'auto':'smooth'});return;}
  if(t.closest('[data-cookies]')){showCookies(true);return;}
  if(t.closest('[data-copy]')){try{navigator.clipboard.writeText(location.href).then(function(){toast('Lien copié.');},function(){toast('Copie impossible ici.');});}catch(err){toast('Copie impossible ici.');}return;}
  if(t.closest('[data-close]')||t===$('#scrim')||t===$('#book')){closeAll();return;}
  var ts = t.closest('[data-toast]'); if(ts) toast(ts.dataset.toast);
});
document.addEventListener('keydown', function(e){if(e.key==='Escape'){closeAll();setMenu(false);}});
$('#cartBtn').addEventListener('click', function(){open($('#drawer'));});
var tt; function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on');},3200);}

/* réservation */
var d = new Date(); d.setDate(d.getDate()+7); $('#bDate').value = d.toISOString().slice(0,10);
$('#bookForm').addEventListener('submit', function(e){e.preventDefault();$('#bookDone').style.display='block';});

/* contrôle d'âge */
var ok=false; try{ok=sessionStorage.getItem('aubree-age')==='1';}catch(e){}
if(ok) $('#age').remove();
else{document.body.style.overflow='hidden';
  $('#ageYes').addEventListener('click',function(){try{sessionStorage.setItem('aubree-age','1');}catch(e){}$('#age').remove();document.body.style.overflow='';showCookies(false);});
  $('#ageNo').addEventListener('click',function(){$('#ageMsg').textContent='Ce site n’est pas accessible aux personnes mineures.';});}

/* cookies */
var ck=null; try{ck=localStorage.getItem('aubree-cookies');}catch(e){}
function showCookies(force){ if(force||!ck){var c=$('#cookies');c.classList.add('on');if(force)c.classList.add('more');} }
function setCk(v){ck=v;try{localStorage.setItem('aubree-cookies',v);}catch(e){}$('#cookies').classList.remove('on','more');toast(v==='refused'?'Cookies de mesure d’audience refusés.':'Préférences enregistrées.');}
$('#ckYes').addEventListener('click',function(){setCk('accepted');});
$('#ckNo').addEventListener('click',function(){setCk('refused');});
$('#ckMore').addEventListener('click',function(){$('#cookies').classList.toggle('more');});
$('#ckSave').addEventListener('click',function(){setCk($('#ckStats').checked?'accepted':'refused');});
if(ok) setTimeout(function(){showCookies(false);},800);

/* menu mobile */
function setMenu(on){$('#mmenu').classList.toggle('on',on);$('#mmenu').inert=!on;$('#burger').setAttribute('aria-expanded',on?'true':'false');$('#burger').setAttribute('aria-label',on?'Fermer le menu':'Ouvrir le menu');onScroll();}
$('#burger').addEventListener('click',function(){setMenu(!$('#mmenu').classList.contains('on'));});

/* en-tête et parallaxe */
var ticking=false;
function onScroll(){
  hdr.classList.toggle('solid', solidRoute || scrollY>40 || $('#mmenu').classList.contains('on'));
  var par = $('[data-parallax]', view);
  if(!reduce && par){var sec=par.parentNode, r=sec.getBoundingClientRect(); if(r.bottom>0&&r.top<innerHeight){var p=(r.top+r.height/2-innerHeight/2)/innerHeight; par.style.transform='translate3d(0,'+(p*-10)+'%,0)';}}
  ticking=false;
}
addEventListener('scroll', function(){if(!ticking){requestAnimationFrame(onScroll);ticking=true;}}, {passive:true});

renderCart();
route();
})();
