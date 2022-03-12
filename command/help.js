const db = require('../db'),
    lang = require('../lang')

module.exports = (ctx) => {
    let user
    db.collection('users').find({ userid: ctx.chat.id }).toArray((err, ruser) => {
        user = ruser[0]
        ctx.telegram.sendMessage(ctx.chat.id, lang(user.lang).help).then(() => true).catch(() => false)
    })
}