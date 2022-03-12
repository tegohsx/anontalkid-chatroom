const db = require('../db'),
    lang = require('../lang')
const { Markup } = require('telegraf')

module.exports = (ctx) => {
    let dbuser = db.collection('users')
    dbuser.find({ userid: ctx.chat.id }).toArray((err, row) => {
        let user = row[0]
        if (user.session != '') {
            dbuser.updateOne({ userid: ctx.chat.id }, { $set: { session: '' } })
            ctx.telegram.sendMessage(ctx.chat.id, lang(user.lang).cancel, Markup.removeKeyboard()).then(() => true).catch(() => false)
        } else {
            ctx.telegram.sendMessage(ctx.chat.id, lang(user.lang).invalid_cancel, Markup.removeKeyboard()).then(() => true).catch(() => false)
        }
    })
}