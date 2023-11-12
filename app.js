const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
// const path = require('path')
// const bootstrap = require('bootstrap')

const TWO_HOURS = 1000 * 60 * 60 * 2

const {
    PORT = 3000,
    NODE_ENV = 'development',

    SESS_NAME = 'sid',
    SESS_SECRET = 'hd.thanhtri',
    SESS_LIFETIME = TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production'

const users = [
    { id: 1, name: 'Tri', email: 'tri@gmail.com', password: '123456' },
    { id: 2, name: 'Trung', email: 'trung@gmail.com', password: '123456' },
    { id: 3, name: 'Toan', email: 'toan@gmail.com', password: '123456' }
]

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(__dirname + '/public'))

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}))

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}

const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/profile')
    } else {
        next()
    }
}

// Call user to share for others function, which mean global variable.
app.use((req, res, next) => {
    const { userId } = req.session
    if (userId) {
        res.locals.user = users.find(user => user.id === userId)
    }
    next()
})


// Middleware to share the same html
const sharedHTML = (content) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
        ${content}
    </body>
    </html>`

app.get('/', (req, res) => {
    const { userId } = req.session

    const content = `
        <h1>Welcome!</h1>
        ${userId ? `
            <a href='/home'>Home</a>
            <form method='post' action='/logout'>
                <button>Logout</button>
            </form>
        ` : `
        <a href='/login'>Login</a>
        <a href='/register'>Register</a>
        `}`
    // Sử dụng middleware để chia sẻ phần HTML chung
    res.send(sharedHTML(content));
})

app.get('/profile', redirectLogin, (req, res) => {
    const { user } = res.locals

    // res.sendFile(path.join(__dirname, '/profile.html'))

    const content = `
        <div class="navbar">
            <form method='post' action='/logout'>
                <button>Logout</button>
            </form>
        </div>
        <h1>Xin chào ${user.name}</h1>
        <p>Email: ${user.email}</p>`

    res.send(sharedHTML(content))
})

app.get('/login', redirectHome, (req, res) => {
    // res.sendFile(path.join(__dirname, '/login.html'))
    const content = `
        <div class="wrapper">
            <form action="/login" method='post'>
                <h1>Đăng nhập</h1>
                <div class="alter-text">Chưa có tài khoản?<a href="/register"> Đăng ký</a></div>
                <div class="input-box">
                    <label class="form-label">Email:</label>
                    <input type="text" name='email' placeholder="Nhập vào email" required></input>
                </div>
                <div class="input-box">
                    <label class="form-label">Mật khẩu:</label>
                    <input type="password" name='password' placeholder="Nhập vào mật khẩu" required></input>
                </div>
                <button class="lg-button" type="submit">Đăng nhập</button>
            </form>
        </div>
    `
    res.send(sharedHTML(content))
})

app.get('/register', (req, res) => {
    // res.sendFile(path.join(__dirname, '/register.html'))
    const content = `
        <div class="wrapper">
            <form action="/register" method='post'>
                <h1>Đăng Ký</h1>
                <div class="alter-text">Đã có tài khoản?<a href="/login"> Đăng nhập</a></div>
                <div class="input-box">
                    <label class="form-label">Tên</label>
                    <input type="text" name='name' placeholder="Tên của bạn" required></input>
                </div>
                <div class="input-box">
                    <label class="form-label">Email:</label>
                    <input type="text" name='email' placeholder="Nhập vào email" required></input>
                </div>
                <div class="input-box">
                    <label class="form-label">Mật khẩu:</label>
                    <input type="password" name='password' placeholder="Nhập vào mật khẩu" required></input>
                </div>
                <button class="lg-button" type="submit">Đăng ký</button>
            </form>
        </div>
    `
    res.send(sharedHTML(content))
})

app.post('/login', redirectHome, (req, res) => {
    const { email, password } = req.body

    if (email && password) {
        const user = users.find(user => user.email === email && user.password === password) // TODO: hash

        if (user) {
            req.session.userId = user.id
            return res.redirect('/profile')
        } else {
            return res.redirect('/login')
        }
    }
})

app.post('/register', redirectHome, (req, res) => {
    const { name, email, password } = req.body

    if (name && email && password) {    //TODO: validation
        const existed = users.some(user => user.email === email)

        if (!existed) {
            const user = {
                id: users.length + 1,
                name,
                email,
                password, // TODO: hash
            }
            users.push(user)

            req.session.userId = user.id

            return res.redirect('/profile')
        }
    }
    res.redirect('/register')   //TODO: error message
})

app.post('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/profile')
        }

        res.clearCookie(SESS_NAME)
        res.redirect('/login')
    })
})


app.listen(PORT, () => console.log(
    `http://localhost:${PORT}`
))