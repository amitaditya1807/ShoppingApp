const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand')
    .then(() => {
        console.log("Connection Open !!!");
    })
    .catch(err => {
        console.log("Oh no error !!!")
        console.log(err);
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('products/home')
})

app.get('/products',async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', { products })
})

app.get('/products/new', (req, res) => {
    res.render('products/new')
})

app.get('/products/:id/edit',async (req, res) => {
    const {id} = req.params
    const product =await Product.findById(id)
    console.log(id)
    res.render('products/edit', {product})
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body)
    await newProduct.save()
    res.redirect('/products')
})

app.get('/products/:id', async (req, res) => {
    const {id} = req.params
    const productInfo = await Product.findById(id)
    res.render('products/show', {productInfo})
})
app.delete('/products/:id',async (req, res) => {
    const {id} = req.params
    await Product.findByIdAndDelete(id)
    res.redirect('/products')
})

app.put('/products/:id', async (req, res) => {
    const {id} = req.params
    console.log(req.body)
    // const updatedproduct =await new Product(req.body)
    await Product.findByIdAndUpdate(id, req.body, {runValidators: true})
    // console.log(updatedproduct)
    res.redirect(`/products/${id}`)
})

app.listen(3000, () => {
    console.log("App listning on port 3000!")
})