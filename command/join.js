const uniqueID = () => Date.now() + Math.floor(Math.random() * 100)
const db = require('../db'),
    lang = require('../lang'),
    roomExit = require('./exit')

let max_member = 50 + (Math.floor(Math.random() * 5))
let max_join = 20
let dbuser,
    user,
    dbroom

module.exports = (ctx) => {
    dbuser = db.collection('users')
    dbuser.find({ userid: ctx.chat.id }).toArray((err, ruser) => {
        user = ruser[0]
        if (user.room != '') {
            roomExit(ctx, let_join)
        } else {
            let_join(ctx, user)
        }
    })
}

const let_join = (ctx, user) => {
    let gotRoom = String(uniqueID())
    let gotRoomInfo = {}
    let foundRoom = false
    let sroom
    let dest_room = ctx.message.text.substr(6)
    dbroom = db.collection('rooms')
    if (dest_room == '') {
        dbroom.find({ lang: user.lang, private: false }).toArray((err0, rroom) => {
            if (rroom.length > 0) {
                sroom = rroom
                shuffle(sroom)
                gotRoom = sroom[0].room
                gotRoomInfo = sroom[0]
                foundRoom = true
                if (sroom[0].member > max_member) {
                    shuffle(sroom)
                    gotRoom = sroom[0].room
                    gotRoomInfo = sroom[0]
                    foundRoom = true
                }
                if (sroom[0].member > max_member) {
                    shuffle(sroom)
                    gotRoom = sroom[0].room
                    gotRoomInfo = sroom[0]
                    foundRoom = true
                }
                if (sroom[0].member > max_member) {
                    gotRoom = String(uniqueID())
                    foundRoom = false
                }
            }

            if (foundRoom == true) {
                dbuser.updateOne({ userid: user.userid }, { $set: { room: gotRoom } })
                dbroom.updateOne({ room: gotRoom }, { $set: { member: gotRoomInfo.member + 1 } })
                dbuser.find({ room: gotRoom, userid: { $ne: user.userid } }).toArray((er, userinroom) => {
                    userinroom.forEach((v, i) => {
                        ctx.telegram.sendMessage(
                            v.userid,
                            `${lang(v.lang, user.ava || 'Botak', ctx.message.text).other_join}  ${lang(v.lang, gotRoomInfo.member + 1).people}`
                        ).then(() => true).catch(() => false)
                    })
                    ctx.telegram.sendMessage(
                        ctx.chat.id,
                        `${lang(user.lang).join} ${lang(user.lang, gotRoomInfo.member).other_people}`
                    ).then(() => true).catch(() => false)
                })
            } else {
                dbuser.updateOne({ userid: user.userid }, { $set: { room: gotRoom } })
                dbroom.insertOne({ room: gotRoom, member: 1, lang: user.lang, private: false })
                ctx.telegram.sendMessage(
                    ctx.chat.id,
                    `${lang(user.lang).join} ${lang(user.lang, 0).other_people}`
                ).then(() => true).catch(() => false)
            }
        })
    } else {
        dbroom.find({ lang: user.lang, room: dest_room, private: false }).toArray((err0, rroom) => {
            if (rroom.length == 0 || rroom[0].member >= max_join) {
                ctx.telegram.sendMessage(
                    ctx.chat.id,
                    `${lang(user.lang, dest_room).room_full}`
                ).then(() => true).catch(() => false)
            } else {
                dbuser.updateOne({ userid: user.userid }, { $set: { room: dest_room } })
                dbroom.updateOne({ room: dest_room }, { $set: { member: rroom[0].member + 1 } })
                dbuser.find({ room: dest_room, userid: { $ne: user.userid } }).toArray((er, userinroom) => {
                    userinroom.forEach((v, i) => {
                        ctx.telegram.sendMessage(
                            v.userid,
                            `${lang(v.lang, user.ava || 'Botak').other_join}  ${lang(v.lang, rroom[0].member + 1).people}`
                        ).then(() => true).catch(() => false)
                    })
                    ctx.telegram.sendMessage(
                        ctx.chat.id,
                        `${lang(user.lang).join} ${lang(user.lang, rroom[0].member).other_people}`
                    ).then(() => true).catch(() => false)
                })
            }
        })
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}