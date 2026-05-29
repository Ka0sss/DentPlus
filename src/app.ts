import path from 'path'
import express from 'express'
import { engine } from 'express-handlebars'
import session from 'express-session'
import loginRouter from './routes/login.routes.js'
import affiliateRouter from './routes/affiliate.routes.js'
import { logout } from './controllers/login.controller.js'
import { requireAuth } from './middleware/requireAuth.js'

/* Initialize Express app */
const app = express()

/* Definir ruta de views con "path" */
const viewsPath = path.join(process.cwd(), 'src', 'views')

app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(viewsPath, 'layouts')
}))
app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: process.env.SESSION_SECRET ?? 'dev-secret',
  resave: false,
  saveUninitialized: false
}))

app.use((req, _res, next) => {
  _res.locals.session = req.session
  next()
})

app.get('/', (_req, res) => {
  res.render('home')
})

app.use('/login', loginRouter)
app.use('/logout', logout)
app.use('/users', (_req, res) => res.redirect('/affiliates'))
app.use('/affiliates', requireAuth, affiliateRouter)

export default app
