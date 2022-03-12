const mongo = require('mongodb').MongoClient,
    cfg = require('./config')

let _client = null
let dbuser = null,
    dbroom = null,
    dblang = null

function init(callback) {
    mongo.connect(cfg.DB_URL, { useUnifiedTopology: true }, (err, client) => {
        if (err) {
            console.log(err)
            process.exit(1)
        } else {
            console.log('Connected to database.')
        }
        _client = client
        dbroom = _client.db().collection('rooms')
        dblang = _client.db().collection('langs')

        //firsttime
        dbroom.find().toArray((err,row)=>{
            if(row.length==0){
                let private=false
                let member=0
                dbroom.insertMany([
                    {
                        room: String(uniqueID()),
                        lang: 'Indonesia',
                        member,
                        private
                    },{
                        room: String(uniqueID()),
                        lang: 'Indonesia',
                        member,
                        private
                    },{
                        room: String(uniqueID()),
                        lang: 'Indonesia',
                        member,
                        private
                    },{
                        room: String(uniqueID()),
                        lang: 'English',
                        member,
                        private
                    },{
                        room: String(uniqueID()),
                        lang: 'English',
                        member,
                        private
                    },{
                        room: String(uniqueID()),
                        lang: 'English',
                        member,
                        private
                    }
                ])
            }
        })
        dblang.find().toArray((err,row)=>{
            if(row.length==0){
                dblang.insertMany([
                    {
                        lang: 'Indonesia'
                    },
                    {
                        lang: 'English'
                    }
                ])
            }
        })
        callback()
    })
}

function close() {
    return _client.close()
}

function isConnected() {
    return _client.isConnected()
}

function collection(_collection) {
    return _client.db().collection(_collection)
}

const uniqueID = () => Date.now() + Math.floor(Math.random() * 100)

module.exports = {
    collection,
    init,
    close,
    isConnected,
}