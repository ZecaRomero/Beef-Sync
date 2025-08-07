"use strict";exports.id=2807,exports.ids=[2807],exports.modules={2807:(e,t,a)=>{a.d(t,{X:()=>i});let i={invites:[],async getInvites(e){await this.delay(500);let t=localStorage.getItem("beef_sync_invites");return t&&(this.invites=JSON.parse(t)),this.invites.filter(t=>t.invitedBy===e)},async sendInvite(e){await this.delay(1e3);let t={id:Date.now(),...e,status:"pending",createdAt:new Date().toISOString(),inviteLink:this.generateInviteLink(),whatsappMessage:this.generateWhatsAppMessage(e)};this.invites.push(t),localStorage.setItem("beef_sync_invites",JSON.stringify(this.invites));try{await this.sendWhatsAppInvite(t)}catch(e){console.warn("Envio via WhatsApp n\xe3o configurado:",e.message)}return t},async revokeInvite(e){await this.delay(300);let t=this.invites.find(t=>t.id===e);return t&&(t.status="revoked",t.revokedAt=new Date().toISOString()),t},async acceptInvite(e){await this.delay(500);let t=this.invites.find(t=>t.inviteLink.includes(e));if(t&&"pending"===t.status)return t.status="accepted",t.acceptedAt=new Date().toISOString(),t.lastSeen=new Date().toISOString(),t;throw Error("Convite inv\xe1lido ou expirado")},generateInviteLink(){let e=Math.random().toString(36).substring(2,15);return`${window.location.origin}/invite/${e}`},generateWhatsAppMessage(e){let t=`🐄 *Beef Sync - Convite Especial*

Ol\xe1 ${e.name}! 👋

Voc\xea foi convidado para acompanhar em tempo real as vendas de gado e resultados do mercado!

🎯 *O que voc\xea pode fazer:*
${e.permissions.includes("view_sales")?"\uD83D\uDCB0 Ver vendas em tempo real\n":""}${e.permissions.includes("view_rankings")?"\uD83C\uDFC6 Acompanhar rankings e compara\xe7\xf5es\n":""}${e.permissions.includes("view_analytics")?"\uD83D\uDCCA Ver an\xe1lises e relat\xf3rios\n":""}${e.permissions.includes("receive_alerts")?"\uD83D\uDD14 Receber alertas de oportunidades\n":""}

📱 *Acesse agora:*
${this.generateInviteLink()}

⏰ Este convite expira em 7 dias.

*Beef Sync* - Gest\xe3o Bovina Inteligente 🚀`;return encodeURIComponent(t)},async sendWhatsAppInvite(e){let t=`https://wa.me/${e.phone.replace(/\D/g,"")}?text=${e.whatsappMessage}`;console.log("\uD83D\uDCF1 Link do WhatsApp gerado:",t)},async getPublicDashboard(e){await this.delay(800);try{return{farmName:"Sua Fazenda",owner:"Propriet\xe1rio",totalAnimals:0,recentSales:[],rankings:{bestPerformers:[],byCategory:{}},marketComparison:{aboveMarket:0,atMarket:0,belowMarket:0,avgPremium:0},liveUpdates:[]}}catch(e){throw Error("Erro ao carregar dados do dashboard")}},delay:e=>new Promise(t=>setTimeout(t,e))}}};