const { Scenes, Telegraf, session, Markup } = require('telegraf');
require('dotenv').config()
const { enter, leave } = Scenes.Stage;
// SCENES

const admunacc = new Scenes.BaseScene("admunacc");

admunacc.enter(async ctx => {
    try {
        await ctx.replyWithHTML('Введите причину отказа:')
    }catch(e) { 
        console.error(e);
    }
})

let admunaccmsg;
let admmsg;
admunacc.on('message', async ctx => {
    try {
        admmsg = ctx.message.text
        admunaccmsg = await ctx.replyWithHTML(`Вы уверены что хотите отправить следующую причину?:\n<i>${ctx.message.text}</i>`, Markup.inlineKeyboard([
            [Markup.button.callback('Изменить текст причины', 'rewrite'), Markup.button.callback('Отмена', 'cancel')],
            [Markup.button.callback('Отправить', 'send')]
        ]))
        // await ctx.tg.sendMessage(anontrueid.anonchat, 'Ваше сообщение не прошло проверку по причине:\n');
    }catch(e) {
        console.error(e);
    }
}) 

admunacc.action('cancel', async ctx => {
    try {
        await ctx.tg.deleteMessage(ctx.chat.id, admunaccmsg.message_id)
        await ctx.answerCbQuery('Окей...')
        await ctx.scene.leave('admunacc')
    }catch(e) {
        console.error(e);
    }
})
admunacc.action('send', async ctx => {
    try {
        await ctx.tg.deleteMessage(ctx.chat.id, admunaccmsg.message_id);
        let anoncounun = await collection.findOne({_id: ObjectId('63612b27b24e538f644ad357')});
        let rs = await anoncounun.anonim_message_count - 1;
        await collection.findOneAndUpdate({_id: ObjectId('63612b27b24e538f644ad357')}, {$set: {anonim_message_count: rs}});
        await collection.deleteOne({anonId: anontrueid.anonId});
        await ctx.tg.deleteMessage(ctx.chat.id, admquiz.message_id);
        await ctx.answerCbQuery('Отправляю...');
        await ctx.tg.sendMessage(anontrueid.anonchat, `Ваше сообщение не прошло проверку по причине:\n<b>${admmsg}</b>`, {parse_mode: "HTML"});
        await ctx.scene.leave("admunacc")
    }catch(e) {
        console.error(e);
    }
})
admunacc.action('rewrite', async ctx => {
    try {
        await ctx.tg.deleteMessage(ctx.chat.id, admunaccmsg.message_id)
        await ctx.answerCbQuery('Окей...')
        ctx.scene.enter('admunacc')
    }catch(e) {
        console.error(e);
    }
})
    

// SCENES

const bot = new Telegraf(process.env.BOT_TOKEN);
const { MongoClient, ObjectId } = require('mongodb');
const url = process.env.DB;
const client = new MongoClient(url);
client.connect();
const db = client.db('bot');
const collection = db.collection('anonim_messages');
const stage = new Scenes.Stage([admunacc]);  
bot.use(session()); 
bot.use(stage.middleware()); 

bot.start((ctx) => ctx.replyWithHTML('Здравствуй Аноним!\nВ данном боте ты можешь отправить в <a href="https://t.me/cicanonymous">канал</a> свое анонимное сообщения признания или послания и никто об этом не узнает 🥴\nПросто отправь свое желаемое сообщение и я отправлю твое сообщение в <a href="https://t.me/cicanonymous">канал</a> <b>анонимно</b>!', {disable_web_page_preview: true}));
bot.help((ctx) => ctx.replyWithHTML('Просто отправь свое желаемое сообщение и я отправлю твое сообщение в <a href="https://t.me/cicanonymous">канал</a> <b>анонимно</b>!', {disable_web_page_preview: true}));
bot.launch({dropPendingUpdates: true});

// 933981477

let admquiz;
let anontrueid;
bot.on("text", async ctx => {
    try {
        if(ctx.chat.id == '933981477') {
            /* '5103314362' */
            let anonid = await collection.findOne({anonId: ctx.message.text});
            if(anonid == null) {
                await ctx.reply(`Я не нашел в базе данное ID: ${ctx.message.text}`)
            }else {
                admquiz = await ctx.replyWithHTML(`По id: <i>${ctx.message.text}</i> найдено:\n${anonid.user_anonmsg}`, Markup.inlineKeyboard(
                    [
                        [Markup.button.callback('Одобрить', 'acc'), Markup.button.callback('Отказать', 'unacc')],
                        [Markup.button.callback('Данные Анонима', 'watch')]
                    ]
                ))
                anontrueid = await collection.findOne({anonId: ctx.message.text});
            }
        }else {
            let request = await collection.findOne({user_id: ctx.message.from.id});
            if(request == null) {
                let count = await collection.findOne({_id: ObjectId('63612b27b24e538f644ad357')})
                let result = await count.anonim_message_count + 1;
                let quat = await ctx.replyWithHTML(`Вы уверены что хотите отправить анонимное сообщение:\n<i>${ctx.message.text}</i>`, Markup.inlineKeyboard(
                    [
                        [Markup.button.callback('Да, уверен', 'yes'), Markup.button.callback('Нет, отменить', 'no')]
                    ]
                ))
                await collection.insertOne(
                    {
                        user_id: ctx.message.from.id,
                        user_name: ctx.message.from.username,
                        user_firstname: ctx.message.from.first_name,
                        user_anonmsg: ctx.message.text,
                        quiz_markup: `${quat.message_id}`,
                        anonId: `#${result}`,
                        anonchat: ctx.chat.id
                    }
                )   
                await collection.findOneAndUpdate({_id: ObjectId('63612b27b24e538f644ad357')}, {$set: {anonim_message_count: result}});
            }else {
                await ctx.reply('Ожидайте в нашем канале, вы уже отправляли свое сообщение!')
            }
        }
    }catch(e) {
        console.error(e);
    }   
    // -1001514376747
})


bot.action("watch", async ctx => {
    try {
        await ctx.replyWithHTML(`Данные Анонима:\n\nFirst Name: <a href="tg://user?id=${anontrueid.user_id}">${anontrueid.user_firstname}</a>\nUser Name: @${anontrueid.user_name}`)
        await ctx.answerCbQuery('Не забудьте очистить следы..');
    }catch(e){
        console.error(e);
    }  
})

bot.action('acc', async ctx => {  
    try {
        await ctx.tg.deleteMessage(ctx.chat.id, admquiz.message_id);  
        let anoncouna = await collection.findOne({_id: ObjectId('6363c74b38cbdb91eef0e1d4')})
        let restot = await anoncouna.anonim_message_countres + 1;
        await collection.findOneAndUpdate({_id: ObjectId('6363c74b38cbdb91eef0e1d4')}, {$set: {anonim_message_countres: restot}})
        await ctx.tg.sendMessage(-1001514376747, `👤 Новое анонимное сообщение #${restot}:\n\n${anontrueid.user_anonmsg}`);
        await ctx.tg.sendMessage(anontrueid.anonchat, 'Ваше сообщение успешно прошло проверку!');
        await collection.findOneAndDelete({user_id: anontrueid.user_id})
        await ctx.answerCbQuery('Отправлено');
    }catch(e){
        console.error(e);
    }
})


bot.action('unacc', async ctx => {
    try {
        await ctx.answerCbQuery('Выполнено', {show_alert: false})
        await ctx.scene.enter('admunacc')
    }catch(e){
        console.error(e);
    }
})
  



bot.action('yes', async ctx => {
    try {
        let anonserch = await collection.findOne({user_id: ctx.callbackQuery.from.id});
        await ctx.tg.sendMessage(933981477, `Новое анонимное сообщение ${anonserch.anonId}\n\nДля проверки анонимного сообщения напишите ID сообщения(#00000)`);
        await ctx.tg.deleteMessage(ctx.chat.id, anonserch.quiz_markup);
        await ctx.answerCbQuery('Ваше сообщение отправлено', {show_alert: false})
    }catch(e){
        console.error(e);
    }
})


bot.action('no', async ctx => {
    try {
        let anonserchn = await collection.findOne({user_id: ctx.callbackQuery.from.id});
        await ctx.tg.deleteMessage(ctx.chat.id, anonserchn.quiz_markup);
        let anoncoun = await collection.findOne({_id: ObjectId('63612b27b24e538f644ad357')});
        let res = await anoncoun.anonim_message_count - 1 ;
        await collection.deleteOne({user_id: ctx.callbackQuery.from.id});
        await collection.findOneAndUpdate({_id: ObjectId('63612b27b24e538f644ad357')}, {$set: {anonim_message_count: res}});
        await ctx.answerCbQuery('Отменено')
    }catch(e){
        console.error(e);
    }
})




// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));