const db = require('../db'),
    lang = require('../lang')

module.exports = (ctx, _join = null) => {
    let dbuser = db.collection('users'),
        dbroom = db.collection('rooms'),
        user
    dbuser.find({ userid: ctx.chat.id }).toArray((err, ruser) => {
        user = ruser[0]
        dbuser.find({ room: user.room, userid: { $ne: user.userid } }).toArray((er, userinroom) => {
            if (!er) {
                dbroom.updateOne({ room: user.room }, { $set: { member: userinroom.length } }, () => {
                    dbuser.updateOne({ userid: user.userid }, { $set: { room: '' } }, () => {
                        if (_join != null) {
                            _join(ctx, user)
                        }
                    })
                })
                userinroom.forEach((v, i) => {
                    ctx.telegram.sendMessage(
                        v.userid,
                        `${lang(v.lang, user.ava || 'Botak').other_left} ${lang(v.lang, userinroom.length).people}`
                    ).then(() => true).catch(() => false)
                })
            }
        })
        ctx.telegram.sendMessage(
            ctx.chat.id,
            lang(user.lang).left
        ).then(() => true).catch(() => false)
    })

}