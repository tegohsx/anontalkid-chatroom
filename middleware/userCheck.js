const db = require('../db'),
    settings = require('../command/settings'),
    lang = require('../lang')

module.exports = (ctx, callback) => {
    let dbuser = db.collection('users')
    let now = new Date()
    dbuser.find({ userid: ctx.chat.id }).toArray((err, row) => {
        if (row.length == 0) {
            let user_info = {
                userid: ctx.chat.id,
                username: ctx.chat.username || '',
                first_name: ctx.chat.first_name,
                last_name: ctx.chat.last_name || '',
                ava: '',
                lang: '',
                last_update: now,
                session: 'lang',
                room: '',
                vip: 0,
                end_vip: now,
                nickname: '',
                joined_at: now
            }
            dbuser.insertOne(user_info)
            ctx.telegram.sendMessage(ctx.chat.id, lang('en').welcome).then(() => true).catch(() => false)
            settings.setLang(ctx)
        } else if (row[0].lang == '') {
            if (!ctx.message.text.startsWith('/')) {
                settings.saveLang(ctx, row[0])
            } else
                settings.setLang(ctx)
        } else {
            dbuser.updateOne({ userid: ctx.chat.id }, { $set: { last_update: now, username: ctx.chat.username || '' } })
            callback()
        }
    })
}
