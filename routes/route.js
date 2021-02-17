const router = require('express').Router()
const passport = require('passport')
const request = require('request');

const UserAuthController = require('../controller/UserAuthController')
const HaveReadController = require('../controller/BooksCollection/HaveReadController')
const NowReadingController = require('../controller/BooksCollection/NowReadingController')
const WantToReadController = require('../controller/BooksCollection/WantToReadController')
const MyFavouritesController = require('../controller/BooksCollection/MyFavouritesController')

const AuthMiddleware = require('../middleware/AuthMiddleware');


router.get('/', (req, res)=>{
     const {error} = req.cookies
     res.render("index", {error})
})

router.get('/signin', (req,res)=>{
  res.redirect("/")
})

router.get('/signup', (req,res)=>{
  const {error} = req.cookies
  res.render("signup", {error})
})

router.post('/signup',AuthMiddleware.validateSignup, UserAuthController.create)

router.get('/profile', AuthMiddleware.authCheck , (req, res)=>{ res.render('profile', {user: req.user})})

// local Auth
router.post('/signin', AuthMiddleware.validateSignin , passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/'}));

// Google auth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/return', passport.authenticate('google', {successRedirect: '/profile', failureRedirect: '/' }));

// facebook auth
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/return', passport.authenticate('facebook', { successRedirect: '/profile', failureRedirect: '/' }));

// logout
router.get('/logout', (req,res)=>{req.logout(); res.redirect('/')})

router.get('/newBook', AuthMiddleware.authCheck, (req,res)=>{
  res.render('newBook', {user: req.user})
})
router.get('/search', (req,res)=>{
  const query = req.query.query
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`
    request(url, (err, response)=>{
      const book = JSON.parse(response.body).items[0]
      res.redirect(`book/${book.id}`)
    })
})

router.get('/book/:GBID', AuthMiddleware.authCheck, (req,res)=>{
  const url = `https://www.googleapis.com/books/v1/volumes/${req.params.GBID}?fields=id,volumeInfo`
  request(url, (err, response)=>{
    const bookData = JSON.parse(response.body).volumeInfo
    const GBID = JSON.parse(response.body).id
    const book = {
      GBID: GBID || undefined,
      title: bookData.title || "unKnown title",
      authors: bookData.authors || "by unKnown",
      published: bookData.publishedDate || "unKnown",
      description: (bookData.description)?bookData.description.substring(0,160)+'...':"No description found",
      isbn:( bookData.industryIdentifiers)? bookData.industryIdentifiers[0].identifier:"unKnown",
      categories: bookData.categories || "unKnown",
      rating: bookData.averageRating || "unKnown",
      thumbnail: bookData.imageLinks.thumbnail || ""
    }
    res.render('book', {book, user: req.user})
    // res.send(book)
  })

})

// booksCollection

router.post('/collection/haveRead', HaveReadController.create)
router.post('/collection/nowReading', NowReadingController.create)
router.post('/collection/wantToRead', WantToReadController.create)
router.post('/collection/myFavourites', MyFavouritesController.create)


module.exports = router