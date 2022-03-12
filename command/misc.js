const db = require('../db'),
    lang = require('../lang')

module.exports = {
    rooms: (ctx) => {
        let dbroom = db.collection('rooms')
        let room_list = ''
        let dbuser = db.collection('users')
        dbuser.find({ userid: ctx.chat.id }).toArray((err, row) => {
            let user = row[0]
            dbroom.find({ lang: user.lang, private: false }).toArray((err0, rroom) => {
                rroom.forEach((v, i) => {
                    room_list += `${v.room} ${v.room == user.room ? '(🏠)' : ''}\n`
                })
                ctx.telegram.sendMessage(
                    ctx.chat.id,
                    `${lang(user.lang, room_list).rooms}`
                ).then(() => true).catch(() => false)
            })
        })
    },
    list: (ctx) => {
        let people_list = ''
        let dbuser = db.collection('users')
        dbuser.find({ userid: ctx.chat.id }).toArray((err, row) => {
            let user = row[0]
            if (user.room) {
                dbuser.find({ room: user.room }).toArray((err0, rpeople) => {
                    rpeople.forEach((v, i) => {
                        people_list += `${v.ava || '👤'}, `
                    })
                    people_list = people_list.substring(0, people_list.length - 2)
                    ctx.telegram.sendMessage(
                        ctx.chat.id,
                        `${lang(user.lang, people_list).list}`
                    ).then(() => true).catch(() => false)
                })
            } else {
                ctx.telegram.sendMessage(
                    ctx.chat.id,
                    `${lang(user.lang).not_in_room}`
                ).then(() => true).catch(() => false)
            }
        })
    },
    donate: (ctx) => {
        let dbuser = db.collection('users')
        dbuser.find({ userid: ctx.chat.id }).toArray((err, row) => {
            let user = row[0]
            ctx.telegram.sendMessage(
                ctx.chat.id,
                `${lang(user.lang, `https://anontalkid.my.to/donasi/new.php?id=${ctx.chat.id}`).donate}`
            ).then(() => true).catch(() => false)
        })
    }
}