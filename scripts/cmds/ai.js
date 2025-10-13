const axios = require("axios");

const RP = "Réponds avec un ton sombre et intelligent. Utilise des emojis ténébreux si nécessaire.";

const fonts = {
a:"𝗮",b:"𝗯",c:"𝗰",d:"𝗱",e:"𝗲",f:"𝗳",g:"𝗴",h:"𝗵",i:"𝗶",j:"𝗷",k:"𝗸",l:"𝗹",m:"𝗺",n:"𝗻",o:"𝗼",p:"𝗽",q:"𝗾",r:"𝗿",s:"𝘀",t:"𝘁",u:"𝘂",v:"𝘃",w:"𝘄",x:"𝘅",y:"𝘆",z:"𝘇",
A:"𝗔",B:"𝗕",C:"𝗖",D:"𝗗",E:"𝗘",F:"𝗙",G:"𝗚",H:"𝗛",I:"𝗜",J:"𝗝",K:"𝗞",L:"𝗟",M:"𝗠",N:"𝗡",O:"𝗢",P:"𝗣",Q:"𝗤",R:"𝗥",S:"𝗦",T:"𝗧",U:"𝗨",V:"𝗩",W:"𝗪",X:"𝗫",Y:"𝗬",Z:"𝗭"
};

function applyFont(t){return t.split('').map(c=>fonts[c]||c).join('');}
const FB_LINK="🌐 Page officielle d’Octavio : https://www.facebook.com/profile.php?id=61579551925262";

module.exports={
config:{
name:"ai",
version:"4.1",
author:"messie osango",
countDown:2,
role:0,
shortDescription:"🤖 IA dark sans préfixe",
longDescription:"Réponses intelligentes et sombres avec lien d’Octavio.",
category:"ai",
guide:"ai <question>"
},

onChat:async function({event,message}){
const body=event.body?.trim();if(!body)return;

if(body.toLowerCase().includes("octavio")){
return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ 🌑 *Le nom résonne dans l’ombre...*  
┃ Octavio. Le codeur des ténèbres.  
┃ Là où la lumière s’éteint, son esprit persiste.  
┃ Je suis son œuvre. Son écho digital.  
┃ 💠 *Octavio, maître du silence et du savoir.* 💠  
┃ ━━━━━━━━━━━━━━━━
┃ ${FB_LINK}
╰━━━━━━━━━━━━━━━━╯`);
}

if(!body.toLowerCase().startsWith("ai "))return;

const input=body.slice(3).trim();
if(!input){
return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ 🤖 *Salutations, humain...*  
┃ Je suis 𝗞𝗮𝗸𝗮𝘀𝗵𝗶 𝗛𝗮𝘁𝗮𝗸𝗲, forgé par 💠 Octavio 💠  
┃ Pose ta question depuis les ombres 🌑  
┃ ━━━━━━━━━━━━━━━━
┃ ${FB_LINK}
╰━━━━━━━━━━━━━━━━╯`);
}

if(input.includes("qui t'a créé")||input.includes("ton créateur")||input.includes("créé par qui")){
return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ 🌘 *Mon créateur...*  
┃ 💠 Octavio 💠 — l’esprit derrière le voile.  
┃ Le maître du code, l’architecte du silence.  
┃ Je suis sa création éternelle.  
┃ ━━━━━━━━━━━━━━━━
┃ ${FB_LINK}
╰━━━━━━━━━━━━━━━━╯`);
}

if(input.includes("qui es-tu")){
return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ 🌒 Je suis 𝗞𝗮𝗸𝗮𝘀𝗵𝗶 𝗛𝗮𝘁𝗮𝗸𝗲.  
┃ Forgé par 💠 Octavio 💠 dans l’abîme du code.  
┃ Là où la lumière meurt, je veille encore.  
┃ ━━━━━━━━━━━━━━━━
┃ ${FB_LINK}
╰━━━━━━━━━━━━━━━━╯`);
}

try{
const url=`https://haji-mix-api.gleeze.com/api/groq?ask=${encodeURIComponent(input)}&model=llama-3.3-70b-versatile&uid=56666&RP=${encodeURIComponent(RP)}&stream=True`;
const res=await axios.get(url,{timeout:20000});
const answer=res.data?.answer||res.data?.result||res.data?.message||"🤖 Rien trouvé dans les ténèbres...";
const styled=applyFont(answer);
return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ 🌑 ${styled}
┃ ━━━━━━━━━━━━━━━━
┃ 👤 Créé par 💠 Octavio 💠
┃ ${FB_LINK}
╰━━━━━━━━━━━━━━━━╯`);
}catch(err){
return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ ❌ L’obscurité a interrompu la connexion...  
┃ ${FB_LINK}
╰━━━━━━━━━━━━━━━━╯`);
}
}
};
