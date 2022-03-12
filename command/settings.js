const { Markup } = require('telegraf')
const db = require('../db'),
    saveLang = require('../session/lang'),
    saveAva = require('../session/ava'),
    lang = require('../lang')

const setLang = (ctx) => {
    let dblang = db.collection('langs')
    let dbuser = db.collection('users')

    let keyboard = []
    let rkeyboard = []
    let user
    dbuser.updateOne({ userid: ctx.chat.id }, { $set: { session: 'lang' } })
    dbuser.find({ userid: ctx.chat.id }).toArray((err, ruser) => {
        user = ruser[0]
        dblang.find().toArray((err, rlang) => {
            rlang.forEach((v, i) => {
                rkeyboard.push(v.lang)
                if (i % 2 == 0) {
                    keyboard.push(rkeyboard)
                }
            })
            ctx.telegram.sendMessage(ctx.chat.id, lang(user.lang, user.lang).current_lang,
                Markup
                    .keyboard(keyboard)
                    .resize(true).oneTime(true)).then(() => true).catch((err) => false)
        })
    })
}

const setAva = (ctx) => {
    let dbuser = db.collection('users')
    let user
    dbuser.updateOne({ userid: ctx.chat.id }, { $set: { session: 'ava' } })
    dbuser.find({ userid: ctx.chat.id }).toArray((err, ruser) => {
        user = ruser[0]
        ctx.telegram.sendMessage(ctx.chat.id, lang(user.lang, user.ava).current_ava).then(() => true).catch((err) => false)
    })
}

module.exports = {
    setLang,
    setAva,
    saveAva,
    saveLang
}