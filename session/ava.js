const { Markup } = require('telegraf')
const db = require('../db'),
    lang = require('../lang')

module.exports = (ctx, user) => {
    let dbuser = db.collection('users')
    if (ctx.message.text.length <= 2) {
        dbuser.updateOne({ userid: ctx.chat.id }, { $set: { ava: ctx.message.text, session: '' } })
        ctx.telegram.sendMessage(ctx.chat.id,
            lang(user.lang, ctx.message.text).change_ava,
            Markup.removeKeyboard()).then(() => true).catch((err) => false)

        if (user.room != '') {
            dbuser.find({ room: user.room, userid: { $ne: user.userid } }).toArray((er, userinroom) => {
                userinroom.forEach((v, i) => {
                    ctx.telegram.sendMessage(
                        v.userid,
                        lang(v.lang, user.ava || 'Botak', ctx.message.text).other_change_ava
                    ).then(() => true).catch(() => false)
                })

            })
        }

    } else if (ctx.message.text == '/drop') {
        dbuser.updateOne({ userid: ctx.chat.id }, { $set: { ava: '', session: '' } })
        ctx.telegram.sendMessage(ctx.chat.id,
            lang(user.lang, ctx.message.text).to_botak,
            Markup.removeKeyboard()).then(() => true).catch((err) => false)

        if (user.room != '') {
            dbuser.find({ room: user.room, userid: { $ne: user.userid } }).toArray((er, userinroom) => {
                userinroom.forEach((v, i) => {
                    ctx.telegram.sendMessage(
                        v.userid,
                        lang(v.lang, user.ava || 'Botak').other_to_botak
                    ).then(() => true).catch(() => false)
                })

            })
        }

    } else {
        ctx.telegram.sendMessage(
            ctx.chat.id,
            lang(user.lang, ctx.message.text).invalid_ava,
            Markup.removeKeyboard()
        ).then(() => true).catch((err) => false)
    }
}