const db = require('../db'),
    settings = require('../command/settings'),
    lang = require('../lang'),
    room = require('./room')

module.exports = (ctx) => {
    let dbuser = db.collection('users')
    let user
    dbuser.find({userid: ctx.chat.id}).toArray((err,ruser)=>{
        user=ruser[0]
        if(user.session=='ava'){
            if(ctx.message.text){
                settings.saveAva(ctx,user)
            }
        } else if(user.session=='lang'){
            if(ctx.message.text){
                settings.saveLang(ctx,user)
            }
        } else if(user.room!=''){
            room(ctx,user)
        } else {
            ctx.telegram.sendMessage(ctx.chat.id,lang(user.lang).invalid_command)
        }
    })
}