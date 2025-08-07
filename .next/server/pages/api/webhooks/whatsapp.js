"use strict";(()=>{var e={};e.id=2408,e.ids=[2408],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},7202:e=>{e.exports=require("twilio")},7955:(e,a,s)=>{s.r(a),s.d(a,{config:()=>l,default:()=>c,routeModule:()=>d});var t={};s.r(t),s.d(t,{default:()=>handler});var o=s(1802),r=s(7153),i=s(6249);let n={providers:{twilio:{accountSid:process.env.TWILIO_ACCOUNT_SID,authToken:process.env.TWILIO_AUTH_TOKEN,whatsappNumber:process.env.TWILIO_WHATSAPP_NUMBER,apiUrl:"https://api.twilio.com/2010-04-01"},whatsappBusiness:{accessToken:process.env.WHATSAPP_ACCESS_TOKEN,phoneNumberId:process.env.WHATSAPP_PHONE_NUMBER_ID,apiUrl:"https://graph.facebook.com/v18.0"},chatapi:{token:process.env.CHATAPI_TOKEN,instanceId:process.env.CHATAPI_INSTANCE_ID,apiUrl:"https://api.chat-api.com/instance"}},activeProvider:process.env.WHATSAPP_PROVIDER||"twilio",async sendViaTwilio(e,a,t=null){let{accountSid:o,authToken:r,whatsappNumber:i}=this.providers.twilio;if(!o||!r)throw Error("Credenciais do Twilio n\xe3o configuradas");let n=s(7202)(o,r);try{let s={from:i,to:`whatsapp:${e}`,body:a};t&&(s.mediaUrl=[t]);let o=await n.messages.create(s);return{success:!0,messageId:o.sid,status:o.status,provider:"twilio"}}catch(e){throw console.error("Erro ao enviar via Twilio:",e),Error(`Falha no envio via Twilio: ${e.message}`)}},async sendViaWhatsAppBusiness(e,a,s=null){let{accessToken:t,phoneNumberId:o}=this.providers.whatsappBusiness;if(!t||!o)throw Error("Credenciais do WhatsApp Business n\xe3o configuradas");try{let r;let i=`${this.providers.whatsappBusiness.apiUrl}/${o}/messages`;r=s?{messaging_product:"whatsapp",to:e.replace("+",""),type:"template",template:{name:s,language:{code:"pt_BR"},components:[{type:"body",parameters:[{type:"text",text:a}]}]}}:{messaging_product:"whatsapp",to:e.replace("+",""),type:"text",text:{body:a}};let n=await fetch(i,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify(r)}),c=await n.json();if(!n.ok)throw Error(c.error?.message||"Erro na API do WhatsApp");return{success:!0,messageId:c.messages[0].id,status:"sent",provider:"whatsapp_business"}}catch(e){throw console.error("Erro ao enviar via WhatsApp Business:",e),Error(`Falha no envio via WhatsApp Business: ${e.message}`)}},async sendViaChatAPI(e,a){let{token:s,instanceId:t}=this.providers.chatapi;if(!s||!t)throw Error("Credenciais do Chat-API n\xe3o configuradas");try{let o=`${this.providers.chatapi.apiUrl}${t}/sendMessage?token=${s}`,r={phone:e.replace("+",""),body:a},i=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}),n=await i.json();if(!n.sent)throw Error(n.message||"Erro no envio");return{success:!0,messageId:n.id,status:"sent",provider:"chatapi"}}catch(e){throw console.error("Erro ao enviar via Chat-API:",e),Error(`Falha no envio via Chat-API: ${e.message}`)}},async sendInvite(e){let{phone:a,name:s,inviteLink:t,permissions:o}=e,r=this.generateInviteMessage(s,t,o);try{let e;switch(this.activeProvider){case"twilio":e=await this.sendViaTwilio(a,r);break;case"whatsapp_business":e=await this.sendViaWhatsAppBusiness(a,r);break;case"chatapi":e=await this.sendViaChatAPI(a,r);break;default:throw Error(`Provedor n\xe3o suportado: ${this.activeProvider}`)}return console.log(`✅ Convite enviado para ${s} (${a}) via ${e.provider}`),e}catch(s){console.warn(`❌ Falha com ${this.activeProvider}, tentando fallback...`);let e=Object.keys(this.providers).filter(e=>e!==this.activeProvider);for(let s of e)try{let e;switch(s){case"twilio":e=await this.sendViaTwilio(a,r);break;case"whatsapp_business":e=await this.sendViaWhatsAppBusiness(a,r);break;case"chatapi":e=await this.sendViaChatAPI(a,r)}return console.log(`✅ Convite enviado via fallback ${s}`),e}catch(e){console.warn(`❌ Fallback ${s} tamb\xe9m falhou:`,e.message);continue}throw Error(`Falha em todos os provedores de WhatsApp: ${s.message}`)}},generateInviteMessage(e,a,s){let t={view_sales:"\uD83D\uDCB0 Ver vendas em tempo real",view_rankings:"\uD83C\uDFC6 Acompanhar rankings e compara\xe7\xf5es",view_analytics:"\uD83D\uDCCA Ver an\xe1lises e relat\xf3rios",receive_alerts:"\uD83D\uDD14 Receber alertas de oportunidades"},o=s.map(e=>t[e]).filter(Boolean).join("\n");return`🐄 *Beef Sync - Convite Especial*

Ol\xe1 ${e}! 👋

Voc\xea foi convidado para acompanhar em tempo real as vendas de gado e resultados do mercado!

🎯 *O que voc\xea pode fazer:*
${o}

📱 *Acesse agora:*
${a}

⏰ Este convite expira em 7 dias.

*Beef Sync* - Gest\xe3o Bovina Inteligente 🚀`},async checkDeliveryStatus(e,a){try{switch(a){case"twilio":return await this.checkTwilioStatus(e);case"whatsapp_business":return await this.checkWhatsAppBusinessStatus(e);case"chatapi":return await this.checkChatAPIStatus(e);default:return{status:"unknown",provider:a}}}catch(e){return console.error("Erro ao verificar status:",e),{status:"error",error:e.message,provider:a}}},async checkTwilioStatus(e){let{accountSid:a,authToken:t}=this.providers.twilio,o=s(7202)(a,t),r=await o.messages(e).fetch();return{status:r.status,errorCode:r.errorCode,errorMessage:r.errorMessage,provider:"twilio"}},checkWhatsAppBusinessStatus:async e=>({status:"sent",provider:"whatsapp_business"}),async checkChatAPIStatus(e){let{token:a,instanceId:s}=this.providers.chatapi,t=`${this.providers.chatapi.apiUrl}${s}/getMessage?token=${a}&id=${e}`,o=await fetch(t),r=await o.json();return{status:r.status,provider:"chatapi"}},setupWebhook:(e,a)=>({webhook_url:e,verify_token:a,events:["messages","message_deliveries","message_reads"]}),processWebhook(e){if(e.entry){for(let a of e.entry)if(a.changes){for(let e of a.changes)if("messages"===e.field){let a=e.value.statuses||[];for(let e of a)console.log(`Status da mensagem ${e.id}: ${e.status}`)}}}}};async function handler(e,a){let{method:s,query:t,body:o}=e;if("GET"===s){let e=t["hub.mode"],s=t["hub.verify_token"],o=t["hub.challenge"];return"subscribe"===e&&s===process.env.WEBHOOK_VERIFY_TOKEN?(console.log("✅ Webhook verificado com sucesso"),a.status(200).send(o)):(console.log("❌ Falha na verifica\xe7\xe3o do webhook"),a.status(403).json({error:"Token de verifica\xe7\xe3o inv\xe1lido"}))}if("POST"===s)try{if(console.log("\uD83D\uDCE8 Webhook recebido:",JSON.stringify(o,null,2)),o.entry){for(let e of o.entry)if(e.changes)for(let a of e.changes)"messages"===a.field&&await processMessageEvent(a.value)}return a.status(200).json({success:!0})}catch(e){return console.error("❌ Erro ao processar webhook:",e),a.status(500).json({error:"Erro interno do servidor"})}return a.status(405).json({error:"M\xe9todo n\xe3o permitido"})}async function processMessageEvent(e){if(e.statuses)for(let a of e.statuses)await updateMessageStatus(a);if(e.messages)for(let a of e.messages)await processIncomingMessage(a)}async function updateMessageStatus(e){let{id:a,status:s,timestamp:t,recipient_id:o}=e;console.log(`📊 Status da mensagem ${a}: ${s}`);try{console.log(`✅ Status atualizado: ${a} -> ${s}`),"read"===s&&await notifyOwnerMessageRead(a,o)}catch(e){console.error("❌ Erro ao atualizar status da mensagem:",e)}}async function processIncomingMessage(e){let{from:a,text:s,timestamp:t}=e;if(!s||!s.body)return;let o=s.body.toLowerCase();console.log(`💬 Mensagem recebida de ${a}: ${o}`),o.includes("parar")||o.includes("stop")?await handleUnsubscribe(a):o.includes("ajuda")||o.includes("help")?await sendHelpMessage(a):(o.includes("status")||o.includes("vendas"))&&await sendQuickStatus(a)}async function handleUnsubscribe(e){try{let a=`✅ Voc\xea foi removido da lista de notifica\xe7\xf5es do Beef Sync.

Para voltar a receber atualiza\xe7\xf5es, pe\xe7a um novo convite ao propriet\xe1rio.

Obrigado por usar o Beef Sync! 🐄`;await n.sendViaTwilio(e,a),console.log(`🚫 Usu\xe1rio ${e} removido das notifica\xe7\xf5es`)}catch(e){console.error("❌ Erro ao processar cancelamento:",e)}}async function sendHelpMessage(e){let a=`🐄 *Beef Sync - Comandos Dispon\xedveis*

📱 *Comandos que voc\xea pode usar:*

🔍 *"status"* ou *"vendas"*
   → Ver resumo r\xe1pido das \xfaltimas vendas

📊 *"ranking"*
   → Ver top 3 animais com melhor performance

📈 *"mercado"*
   → Ver pre\xe7os atuais do mercado

🚫 *"parar"* ou *"stop"*
   → Parar de receber notifica\xe7\xf5es

❓ *"ajuda"* ou *"help"*
   → Ver esta mensagem

🌐 *Link completo:*
Para ver todas as informa\xe7\xf5es detalhadas, acesse: [SEU_LINK_AQUI]

*Beef Sync* - Gest\xe3o Bovina Inteligente 🚀`;try{await n.sendViaTwilio(e,a),console.log(`ℹ️ Mensagem de ajuda enviada para ${e}`)}catch(e){console.error("❌ Erro ao enviar ajuda:",e)}}async function sendQuickStatus(e){try{let a=await getQuickStats(e),s=`📊 *Beef Sync - Status R\xe1pido*

💰 *Vendas Hoje:* ${a.salesToday} animais
💵 *Valor Total:* R$ ${a.totalValue.toLocaleString("pt-BR")}
📈 *vs Ontem:* ${a.changePercent>0?"+":""}${a.changePercent}%

🏆 *Melhor Venda:*
${a.bestSale.animal} - R$ ${a.bestSale.price.toLocaleString("pt-BR")}

📱 *Ver mais detalhes:*
${a.dashboardLink}

*Atualizado em:* ${new Date().toLocaleTimeString("pt-BR")}`;await n.sendViaTwilio(e,s),console.log(`📊 Status r\xe1pido enviado para ${e}`)}catch(e){console.error("❌ Erro ao enviar status:",e)}}async function getQuickStats(e){return{salesToday:3,totalValue:25400,changePercent:12.5,bestSale:{animal:"Boi Nelore #1234",price:8500},dashboardLink:"https://beef-sync.com/invite/abc123"}}async function notifyOwnerMessageRead(e,a){try{console.log(`👀 Convite lido por ${a}`)}catch(e){console.error("❌ Erro ao notificar propriet\xe1rio:",e)}}let c=(0,i.l)(t,"default"),l=(0,i.l)(t,"config"),d=new o.PagesAPIRouteModule({definition:{kind:r.x.PAGES_API,page:"/api/webhooks/whatsapp",pathname:"/api/webhooks/whatsapp",bundlePath:"",filename:""},userland:t})}};var a=require("../../../webpack-api-runtime.js");a.C(e);var __webpack_exec__=e=>a(a.s=e),s=a.X(0,[4222],()=>__webpack_exec__(7955));module.exports=s})();