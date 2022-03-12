const db = require('../db'),
    lang = require('../lang')

module.exports = (ctx) => {
    let dbuser = db.collection('users')
    dbuser.find({ userid: ctx.chat.id }).toArray((err, row) => {
        let user = row[0]
        if(user.lang!=''){
            ctx.telegram.sendMessage(ctx.chat.id, lang(user.lang).registered).then(() => true).catch(() => false)
        }
    })
}