if (self.CavalryLogger) { CavalryLogger.start_js(["Qyban"]); }

__d("XInstagramLoginSyncUpdateController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/instagram/login_sync/update/",{})}),null);
__d("InstagramLoginSync",["Event","XAsyncRequest","XInstagramLoginSyncUpdateController"],(function(a,b,c,d,e,f){"use strict";__p&&__p();var g="https://www.instagram.com",h={ready:"ig_iframe_ready",success:"ig_iframe_success",error:"ig_iframe_error"};a={init:function(){__p&&__p();window.parent.postMessage({eventName:h.ready},g+"/'"),b("Event").listen(window,"message",function(a){__p&&__p();if(a.origin!==g)return;var c=b("XInstagramLoginSyncUpdateController").getURIBuilder().getURI(),d=a.data.data;if(d!=null){var e=function(a,b,c){b=b.errorDescription;c={eventName:h[c],errorDescription:b};a.source.postMessage(c,a.origin)};new(b("XAsyncRequest"))().setURI(c).setMethod("POST").setData({encrypted_data:d}).setHandler(function(b){return e(a,b,"success")}).setErrorHandler(function(b){return e(a,b,"error")}).send()}})}};e.exports=a}),null);
__d("BanzaiConsts",[],(function(a,b,c,d,e,f){a={SEND:"Banzai:SEND",OK:"Banzai:OK",ERROR:"Banzai:ERROR",SHUTDOWN:"Banzai:SHUTDOWN",VITAL_WAIT:1e3,BASIC_WAIT:6e4,EXPIRY:30*6e4,LAST_STORAGE_FLUSH:"banzai:last_storage_flush",STORAGE_FLUSH_INTERVAL:12*60*6e4};e.exports=a}),null);
__d("BanzaiAdapter",["Arbiter","BanzaiConsts","CurrentUser","QueryString","Run","SiteData","URI","UserAgent","ZeroRewrites","getAsyncParams","BanzaiConfig","requireCond","cr:695720"],(function(a,b,c,d,e,f){__p&&__p();var g=[],h=new(b("Arbiter"))(),i="/ajax/bz",j="POST",k={config:b("BanzaiConfig"),endpoint:i,useBeacon:!0,getUserID:function(){return b("CurrentUser").getID()},inform:function(a){h.inform(a)},subscribe:function(a,b){return h.subscribe(a,b)},cleanup:function(){var a=g;g=[];a.forEach(function(a){a.readyState<4&&a.abort()})},readyToSend:function(){return b("UserAgent").isBrowser("IE <= 8")||navigator.onLine},send:function(a,c,d,e){__p&&__p();var f=b("ZeroRewrites").rewriteURI(new(b("URI"))(i)),h=b("ZeroRewrites").getTransportBuilderForURI(f)();h.open(j,f.toString(),!0);h.setRequestHeader("Content-Type","application/x-www-form-urlencoded");h.onreadystatechange=function(){if(h.readyState>=4){var a=g.indexOf(h);a>=0&&g.splice(a,1);try{a=h.status}catch(b){a=0}a==200?(c&&c(),e||k.inform(b("BanzaiConsts").OK)):(d&&d(a),e||k.inform(b("BanzaiConsts").ERROR))}};g.push(h);h.send(k.prepForTransit(a))},addRequestAuthData:function(a){return a},prepForTransit:function(a){var c=b("getAsyncParams")(j);c.q=JSON.stringify(a);c.ts=Date.now();c.ph=b("SiteData").push_phase;return b("QueryString").encode(c)},prepWadForTransit:function(a){if(a.snappy==null||a.snappy===!0){var c=Date.now(),d=JSON.stringify(a.posts),e=b("cr:695720").compressStringToSnappy(d);e!=null&&e.length<d.length?(a.posts=e,a.snappy_ms=Date.now()-c):delete a.snappy}},setHooks:function(a){},setUnloadHook:function(a){b("BanzaiConfig").gks&&b("BanzaiConfig").gks.beforeunload_hook?b("Run").onBeforeUnload(a._unload):b("Run").onAfterUnload(a._unload)},onUnload:function(a){b("Run").onAfterUnload(a)},isOkToSendViaBeacon:function(){return!0}};e.exports=k}),null);
__d("SetIdleTimeoutAcrossTransitions",["NavigationMetrics","cancelIdleCallback","clearTimeout","nullthrows","requestIdleCallbackAcrossTransitions","setTimeoutAcrossTransitions"],(function(a,b,c,d,e,f){"use strict";__p&&__p();var g=!1,h=new Map();c={start:function(a,c){if(g){var d=b("setTimeoutAcrossTransitions")(function(){var c=b("requestIdleCallbackAcrossTransitions")(function(){a(),h["delete"](c)});h.set(d,c)},c);return d}else return b("setTimeoutAcrossTransitions")(a,c)},clear:function(a){b("clearTimeout")(a),h.has(a)&&(b("cancelIdleCallback")(b("nullthrows")(h.get(a))),h["delete"](a))}};b("NavigationMetrics").addRetroactiveListener(b("NavigationMetrics").Events.EVENT_OCCURRED,function(b,c){c.event==="all_pagelets_loaded"&&(g=!!a.requestIdleCallback)});e.exports=c}),null);
__d("BanzaiOld",["BanzaiAdapter","NavigationMetrics","BanzaiConsts","BanzaiLazyQueue","BanzaiStreamPayloads","CurrentUser","ErrorUtils","ExecutionEnvironment","FBJSON","FBLogger","SetIdleTimeoutAcrossTransitions","TimeSlice","Visibility","WebStorage","emptyFunction","isInIframe","lowerFacebookDomain","onAfterDisplay","pageID","performanceAbsoluteNow","WebStorageMutex"],(function(a,b,c,d,e,f){__p&&__p();var g=6e4,h=1e3,i=b("BanzaiAdapter"),j=b("isInIframe")(),k="bz:",l="ods:banzai",m="send_via_beacon_failure",n=0,o=1,p=2,q=null,r,s,t=[],u=null,v=[];function w(a){return a[2]>=b("performanceAbsoluteNow")()-(i.config.EXPIRY||K.EXPIRY)}function x(a,b){var c=a.__meta;c.status=n;a[3]=(a[3]||0)+1;c.retry===!1&&b>=400&&b<600&&t.push(a)}function y(a,c,d,e){a=[a,c,d,0];a.__meta={retry:e===!0,pageID:b("pageID"),userID:b("CurrentUser").getID(),status:n};return a}function z(){__p&&__p();var a=[];v.forEach(function(c){var d=c.cb();d.forEach(function(d){var e=c.route;if(e!=null||e!=""){e=y(e,d,b("performanceAbsoluteNow")());e.__meta.onSuccess=c.onSuccess;e.__meta.onFailure=c.onFailure;a.push(e)}})});v=[];var c=[],d=[];E(c,d,!0,a);if(c.length>0){c[0].send_method="beacon";c.map(i.prepWadForTransit);c=new Blob([i.addRequestAuthData(i.prepForTransit(c))],{type:"application/x-www-form-urlencoded"});c=navigator.sendBeacon(K.adapter.endpoint,c);c?d.forEach(function(a){a=a.__meta;a!=null&&a.onSuccess!=null&&a.onSuccess()}):d.forEach(function(a){a=a.__meta;a!=null&&a.onFailure!=null&&a.onFailure()})}}function A(a){__p&&__p();var c=b("performanceAbsoluteNow")()+a;if(s==null||c<s){s=c;b("SetIdleTimeoutAcrossTransitions").clear(r);c=function(){r=b("SetIdleTimeoutAcrossTransitions").start(B,a)};c();return!0}return!1}var B=b("TimeSlice").guard(function(){C(null,null)},"Banzai.send",{propagationType:b("TimeSlice").PropagationType.ORPHAN});function C(a,c){__p&&__p();s=null;A(K.BASIC.delay);if(!i.readyToSend()){c&&c();return}(K.isEnabled("flush_storage_periodically")||K.isEnabled("error_impact_test"))&&(J(),b("ErrorUtils").applyWithGuard(F.flush,F));i.inform(K.SEND);var d=[],e=[];t=E(d,e,!0,t);if(d.length<=0){i.inform(K.OK);a&&a();return}d[0].trigger=u;u=null;d[0].send_method="ajax";d.map(i.prepWadForTransit);i.send(d,function(){e.forEach(function(a){a=a.__meta;a.status=p;a.callback!=null&&a.callback()}),a&&a()},function(a){e.forEach(function(b){x(b,a)}),c&&c()})}function D(){__p&&__p();if(!(navigator&&navigator.sendBeacon&&i.isOkToSendViaBeacon()))return!1;var a=[],c=[];t=E(a,c,!1,t);if(a.length<=0)return!1;a[0].send_method="beacon";a.map(i.prepWadForTransit);a=new Blob([i.addRequestAuthData(i.prepForTransit(a))],{type:"application/x-www-form-urlencoded"});a=navigator.sendBeacon(K.adapter.endpoint,a);if(!a){c.forEach(function(a){t.push(a)});t.push(y(l,(a={},a[m]=[1],a),b("performanceAbsoluteNow")()));return!1}return!0}function E(a,b,c,d){__p&&__p();var e={};return d.filter(function(d){__p&&__p();var f=d.__meta;if(f.status>=p||!w(d))return!1;if(f.status>=o)return!0;var g=f.compress!=null?f.compress:!0,h=f.pageID+f.userID+(g?"compress":""),i=e[h];i||(i={user:f.userID,page_id:f.pageID,posts:[],snappy:g},e[h]=i,a.push(i));f.status=o;i.posts.push(d);b.push(d);return c&&!!f.retry})}var F,G,H=!1;function I(){H||(H=!0,G=b("WebStorage").getLocalStorage());return G}function J(){__p&&__p();F||(!j?F={store:function(){var a=I();if(a==null||t.length<=0)return;var c=t.map(function(a){return[a[0],a[1],a[2],a[3]||0,a.__meta]});t=[];b("WebStorage").setItemGuarded(a,k+b("pageID")+"."+b("performanceAbsoluteNow")(),b("FBJSON").stringify(c))},restore:function(){__p&&__p();var a=I();if(!a)return;var c=b("WebStorageMutex");new c("banzai").lock(function(c){__p&&__p();var d=[];for(var e=0;e<a.length;e++){var f=a.key(e);if(f==null||f==="")continue;f.indexOf(k)===0&&f.indexOf("bz:__")!==0&&d.push(f)}d.forEach(function(c){__p&&__p();var d=a.getItem(c);a.removeItem(c);if(d==null)return;c=b("FBJSON").parse(d);c.forEach(function(a){if(!a)return;var c=a.__meta=a.pop(),d=w(a);if(!d)return;d=b("CurrentUser").getID();(c.userID===d||d==="0")&&(c.status=n,t.push(a))})});c.unlock()})},flush:function(){var a=I();if(a){q===null&&(q=parseInt(a.getItem(b("BanzaiConsts").LAST_STORAGE_FLUSH),10));var c=q&&b("performanceAbsoluteNow")()-q>=b("BanzaiConsts").STORAGE_FLUSH_INTERVAL;c&&K._restore(!1);(c||!q)&&(q=b("performanceAbsoluteNow")(),b("WebStorage").setItemGuarded(a,b("BanzaiConsts").LAST_STORAGE_FLUSH,q.toString()))}}}:F={store:b("emptyFunction"),restore:b("emptyFunction"),flush:b("emptyFunction")})}var K={adapter:i,SEND:"Banzai:SEND",OK:"Banzai:OK",ERROR:"Banzai:ERROR",SHUTDOWN:"Banzai:SHUTDOWN",VITAL_WAIT:h,BASIC_WAIT:g,EXPIRY:30*6e4,VITAL:{delay:b("BanzaiAdapter").config.MIN_WAIT||h},BASIC:{delay:b("BanzaiAdapter").config.MAX_WAIT||g},isEnabled:function(a){return i.config.gks&&i.config.gks[a]},post:function(c,d,e){__p&&__p();var f;(c==null||c==="")&&b("FBLogger")("banzai").mustfix("Banzai.post called without specifying a route");var h=e==null?void 0:e.retry;if(i.config.disabled)return;if(!b("ExecutionEnvironment").canUseDOM)return;var k=i.config.blacklist;if(k&&(k.indexOf&&(typeof k.indexOf==="function"&&k.indexOf(c)!=-1)))return;if(j&&b("lowerFacebookDomain").isValidDocumentDomain()){var l;try{l=a.top.require("Banzai")}catch(a){l=null}if(l){l.post.apply(l,arguments);return}}var m=y(c,d,b("performanceAbsoluteNow")(),h),n=m.__meta;e!=null&&e.callback!=null&&(n.callback=e.callback);e!=null&&e.compress!=null&&(n.compress=e.compress);if(e!=null&&e.signal!=null){n.status=o;var q=[{user:b("CurrentUser").getID(),page_id:b("pageID"),posts:[m],trigger:c}];i.send(q,function(){n.status=p,n.callback&&n.callback()},function(a){x(m,a)},!0);if(h==null)return}t.push(m);var r=(f=e==null?void 0:e.delay)!=null?f:g;(A(r)||u==null||u==="")&&(u=c);var s=b("BanzaiLazyQueue").flushQueue();s.forEach(function(a){return K.post.apply(K,a)})},registerToSendWithBeacon:function(a,c,d,e){if(!(navigator&&navigator.sendBeacon&&i.isOkToSendViaBeacon()))return!1;if(!a){b("FBLogger")("banzai").mustfix("Banzai.registerToSendWithBeacon called without specifying a route");return!1}v.push({cb:c,route:a,onSuccess:d,onFailure:e});return!0},flush:function(a,c){b("SetIdleTimeoutAcrossTransitions").clear(r),C(a,c)},subscribe:i.subscribe,canUseNavigatorBeacon:function(){return navigator&&navigator.sendBeacon?i.isOkToSendViaBeacon():!1},_schedule:A,_store:function(a){J(),b("ErrorUtils").applyWithGuard(F.store,F)},_restore:function(a){J(),b("ErrorUtils").applyWithGuard(F.restore,F),A(i.config.RESTORE_WAIT||h)},_testState:function(){return{postBuffer:t,triggerRoute:u}},_unload:function(){b("BanzaiStreamPayloads").unload(K.post),navigator&&navigator.sendBeacon&&i.isOkToSendViaBeacon()&&z(),i.cleanup(),i.inform(K.SHUTDOWN),t.length>0&&((!i.useBeacon||!D())&&(J(),b("ErrorUtils").applyWithGuard(F.store,F)))},_initialize:function(){b("ExecutionEnvironment").canUseDOM&&(i.useBeacon&&b("Visibility").isSupported()?(b("Visibility").addListener(b("Visibility").HIDDEN,function(){t.length>0&&(D()||(J(),b("ErrorUtils").applyWithGuard(F.store,F)))}),(K.isEnabled("enable_client_logging_clear_on_visible")||K.isEnabled("error_impact_test"))&&b("Visibility").addListener(b("Visibility").VISIBLE,function(){D()||b("ErrorUtils").applyWithGuard(F.restore,F)})):i.setHooks(K),i.setUnloadHook(K),b("NavigationMetrics").addListener(b("NavigationMetrics").Events.NAVIGATION_DONE,function(a,c){if(c.pageType!=="normal")return;K._restore();b("NavigationMetrics").removeCurrentListener()}))}};K._initialize();e.exports=K}),null);
__d("timeString",["fbt","DateConsts"],(function(a,b,c,d,e,f,g){__p&&__p();var h=b("DateConsts").SEC_PER_MIN,i=b("DateConsts").SEC_PER_HOUR,j=b("DateConsts").SEC_PER_DAY,k=b("DateConsts").SEC_PER_YEAR,l=b("DateConsts").MS_PER_SEC;function m(a){var b,c;a<10?b=g._("adesso"):a<h?b=g._("pochi secondi fa"):a<h*2?b=g._("Circa un minuto fa"):a<i?(c=Math.floor(a/h),b=g._("{number} minuti fa",[g._param("number",c)])):a<i*2?b=g._("Circa un'ora fa"):a<j?(c=Math.floor(a/i),b=g._("{number} ore fa",[g._param("number",c)])):a<j*2?b=g._("circa un giorno fa"):a<j*30?(c=Math.floor(a/j),b=g._("{number} giorni fa",[g._param("number",c)])):a<j*30*2?b=g._("Circa un mese fa"):a<k?(c=Math.floor(a/j/30),b=g._("{number} mesi fa",[g._param("number",c)])):a<k*2?b=g._("pi\u00f9 di un anno fa"):(c=Math.floor(a/k),b=g._("{number} anni fa",[g._param("number",c)]));return b}function n(a){var b,c;a=Math.abs(a);a<10?b=g._("adesso"):a<h?b=g._("fra pochi secondi"):a<h*2?b=g._("fra circa un minuto"):a<i?(c=Math.floor(a/h),b=g._("fra {number} minuti",[g._param("number",c)])):a<i*2?b=g._("fra circa un'ora"):a<j?(c=Math.floor(a/i),b=g._("fra {number} ore",[g._param("number",c)])):a<j*2?b=g._("fra circa un giorno"):a<j*30?(c=Math.floor(a/j),b=g._("fra {number} giorni",[g._param("number",c)])):a<j*30*2?b=g._("fra circa un minuto"):a<k?(c=Math.floor(a/j/30),b=g._("fra {number} mesi",[g._param("number",c)])):a<k*2?b=g._("fra pi\u00f9 di un anno"):(c=Math.floor(a/k),b=g._("fra {number} anni",[g._param("number",c)]));return b}function a(a,b){b=b||Date.now();b=Math.floor((b-a)/l);if(b>=0)return m(b);else return n(b)}e.exports=a}),null);