const { Markup } = require('telegraf')
const db = require('../db'),
    lang = require('../lang')

module.exports = (ctx, user) => {
    let dbuser = db.collection('users')
    dbuser.updateOne({ userid: ctx.chat.id }, { $set: { lang: ctx.message.text, session: '' } })
    ctx.telegram.sendMessage(ctx.chat.id,
        lang(user.lang, ctx.message.text).change_lang,
        Markup.removeKeyboard()).then(() => true).catch((err) => false)
}