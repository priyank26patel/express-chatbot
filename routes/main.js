var router = require('express').Router()
var Gambits = require('../models/admin')
const PORT = process.env.PORT || 5000;

router.get('/admin', function(req, res, next) {
    res.render('admin',{port:PORT,title:"chatbot"})
})


router.post("/admin", (req, res, next) => {
  console.log("req.body == ",req.body)
//   let myData = new Gambits(req.body);
//   console.log("myData == ",myData)

//   var gambits = new Gambits()

  // gambits.category = req.body.category_name
  // gambits.name = req.body.product_name
  // gambits.price = req.body.product_price

  // gambits.save(function(err) {
  //     if (err) throw err
  //     res.send("Date saved to chatbot");
  //     // res.redirect('/admin')
  // })
});

module.exports = router