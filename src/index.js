import express from 'express'
import chrono from 'chrono-node'
import strftime from 'strftime'

const port = process.env.PORT || '8080'
const host = process.env.HOST || '0.0.0.0'
const app = express()

app.set('view engine', 'jade')
app.set('views', __dirname + '/views')

//main page
app.get('/', (req, res) => {
    res.render('index', {
        host: 'https://' + host
    })
})

//api call
app.get('*', (req, res) => {
    let input = req.path.substring(1)
    let natural = null
    let unixTime = null

    //is natural date?
    if (!Number(input)) {
        try {
            natural = chrono.parse(input)[0].start.date()
            unixTime = Math.round(natural.getTime() / 1000)
        } catch (e) {
            natural = null
            unixTime = null
        }
    } else {
        unixTime = Number(input)
    }

    if (unixTime) {
        natural = strftime('%B %d, %Y', new Date(unixTime * 1000))
    }

    res.json({
        "unix": unixTime,
        "natural": natural
    })
})

app.listen(port, host)

console.log('Server running %s:%d...', host, port)
