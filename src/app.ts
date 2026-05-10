import path from 'path'
import express from 'express'
import { engine } from 'express-handlebars'
import userRouter from './routes/user.routes'
/* Initialize Express app */
const app = express()
/* Definir ruta de views con "path" (__dirname es el directorio actual) */
const viewsPath = path.join(__dirname, 'views')

app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(viewsPath, 'layouts')
}))
app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.urlencoded({ extended: true }))

app.get('/', (_req, res) => {
  res.render('home')
})

app.use('/users', userRouter)

export default app
