const { Markup } = require('telegraf')
const db = require('../db'),
    lang = require('../lang')

module.exports = (ctx, user) => {
    let dbuser = db.collection('users')
    let userava = user.ava || '👤'
    dbuser.find({ room: user.room, userid: { $ne: user.userid } }).toArray((er, userinroom) => {
        if (ctx.message.text) {
            userinroom.forEach((v, i) => {
                ctx.telegram.sendMessage(
                    v.userid,
                    `${userava}: ${ctx.message.text}`
                ).then(() => true).catch(() => false)
            })
        }
        else if (ctx.message.sticker) {
            userinroom.forEach((v, i) => {
                ctx.telegram.sendSticker(
                    v.userid,
                    ctx.message.sticker.file_id
                ).then(() => true).catch(() => false)
            })
        }
        else if (ctx.message.photo) {
            userinroom.forEach((v, i) => {
                ctx.telegram.sendPhoto(
                    v.userid,
                    ctx.message.photo[ctx.message.photo.length - 1].file_id,
                    {
                        caption: `${userava}: ${ctx.message.caption || ''}`
                    }
                ).then(() => true).catch(() => false)
            })
        }
        else if (ctx.message.audio) {
            userinroom.forEach((v, i) => {
                ctx.telegram.sendAudio(
                    v.userid,
                    ctx.message.audio.file_id,
                    {
                        caption: `${userava}: ${ctx.message.caption || ''}`
                    }
                ).then(() => true).catch(() => false)
            })
        }
        else if (ctx.message.video) {
            userinroom.forEach((v, i) => {
                ctx.telegram.sendVideo(
                    v.userid,
                    ctx.message.video.file_id,
                    {
                        caption: `${userava}: ${ctx.message.caption || ''}`
                    }
                ).then(() => true).catch(() => false)
            })
        }
        else if (ctx.message.video_note) {
            userinroom.forEach((v, i) => {
                ctx.telegram.sendVideoNote(
                    v.userid,
                    ctx.message.video_note.file_id,
                    {
                        caption: `${userava}: ${ctx.message.caption || ''}`
                    }
                ).then(() => true).catch(() => false)
            })
        }
        else if (ctx.message.voice) {
            userinroom.forEach((v, i) => {
                ctx.telegram.sendVoice(
                    v.userid,
                    ctx.message.voice.file_id,
                    {
                        caption: `${userava}: ${ctx.message.caption || ''}`
                    }
                ).then(() => true).catch(() => false)
            })
        }
        else if (ctx.message.animation) {
            userinroom.forEach((v, i) => {
                ctx.telegram.sendAnimation(
                    v.userid,
                    ctx.message.animation.file_id,
                    {
                        caption: `${userava}: ${ctx.message.caption || ''}`
                    }
                ).then(() => true).catch(() => false)
            })
        } else if (ctx.message.document) {
            userinroom.forEach((v, i) => {
                ctx.telegram.sendDocument(
                    v.userid,
                    ctx.message.document.file_id,
                    {
                        caption: `${userava}: ${ctx.message.caption || ''}`
                    }
                ).then(() => true).catch(() => false)
            })
        }
    })
}