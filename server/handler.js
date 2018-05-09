let db = require('../db/index')
let helper = require('../helper/uitilty')
let bcrypt = require('bcrypt')
let session = require('express-session');
let saltRounds = 10

exports.Signup = function (req, res) {
  console.log('data is here', req.body)
  var username = req.body.username
  var password = req.body.password
  var email = req.body.email
  db.userDonater.find({ // searching for the username in the schema
    username: username
  }, function (err, data) {
    if (err) {
      res.sendStatus(404)
    } else {
      if (data.length > 0) { // if the username found in the schema, then send error, if not save his/her name and hash his/her password
        res.sendStatus(404)
      } else {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          if (err) {
            throw err
          }
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
              throw err
            }
            var user = new db.userDonater({
              username: username,
              email: email,
              password: hash
            })
            user.save(function (err, data) {
              if (err) {
                throw err
              }
              helper.createSession(req, res, data.username)
            })
          })
        })
      }
    }
  })
}

exports.SignupCompany = function (req, res) {
  console.log('data is here', req.body)
  var username = req.body.username
  var password = req.body.password
  var email = req.body.email
  db.userCompany.find({ // searching for the username in the schema
    username: username
  }, function (err, data) {
    if (err) {
      res.sendStatus(404)
    } else {
      if (data.length > 0) { // if the username found in the schema, then send error, if not save his/her name and hash his/her password
        res.sendStatus(404)
      } else {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          if (err) {
            throw err
          }
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
              throw err
            }
            var user = new db.userCompany({
              username: username,
              email: email,
              password: hash
            })
            user.save(function (err, data) {

              if (err) {
                throw err
              }
              helper.createSession(req, res, data.username)
            })
          })
        })
      }
    }
  })
}

exports.logout = function (req, res) { // logout and destroy session
  req.session.destroy(function () {
    console.log('out')
    res.sendStatus(200)
  })
}

exports.LoginCompany = function (req, res) {
  var username = req.body.userName
  var password = req.body.password
  db.userCompany.findOne({ // searching for the username in the schema
    username: username
  }, function (err, data) {
    console.log('CompanySchema', data)
    if (err) {
      throw err
    } else {
            if (!data) { // if he does not exist, then send error, if he exsist compare the password if it right, create session for him/her
              res.sendStatus(404)
            } else {
              bcrypt.compare(password, data.password, function (err, found) {
                if (found) {
                  helper.createSession(req, res, data.username)
                } else {
                  res.sendStatus(404)
                }
              })
            }
          }
        })
}

exports.uploadImage = function(req,res){ // add a personal photo for the user
  console.log('mais mais ' , req.body.image)
var image = req.body.image
var save = new db.userCompany({
  image:image
})
save.save(function(err,data){
  if(err){
    throw err
  }else {
    console.log("'here's the data", data)
  }
})

db.userCompany.update({username: req.session.user}, { $set: { image: image }},function(err,data){
 if(err){
   throw err
 }else{
   res.send(data)
 }
})

}

exports.getImage = function(req,res){
  console.log('image uploaded', req.body)
  db.userCompany.findOne({username: req.session.user},function(err,data){
    if(err){
      throw err
    }else {
      res.send(data)
    }
  })
}

exports.LoginDonater = function (req, res) {

  var username = req.body.userName
  var password = req.body.password
  db.userDonater.findOne({ // searching for the username in the schema
    username: username
  }, function (err, data) {
    console.log('DonaterSchema', data)
    if (err) {
      throw err
    } else {
            if (!data) { // if he does not exist, then send error, if he exsist compare the password if it right, create session for him/her
              res.sendStatus(404)
            } else {
              bcrypt.compare(password, data.password, function (err, found) {
                if (found) {
                  helper.createSession(req, res, data.username)
                } else {
                  res.sendStatus(404)
                }
              })
            }
          }
        })
}

exports.addProfileCompany = function (req, res) {
console.log(req.body,'hhhhhhhhhhh')
console.log('check the session ', req.session.user )
var name=req.body.name
var contactNum=req.body.contactNum
var description=req.body.description
var address=req.body.address

db.userCompany.findOne({username:req.session.user},function(err,data){
  console.log('mais',data)
if(err){
  throw err
}else{
  var info = new db.userCompany({
    name:name,
    contactNum:contactNum,
    description:description,
    address:address
  })
  info.save(function(err,information){
    if(err){
      throw err
    }else{
      res.send(information)
    }
  })

}

})

}

exports.sendMessage = function(req , res){
  var reciever = req.body.user
  var text = req.body.text 

  db.userCompany.findOne({username : reciever} , function (err , data ) {
    console.log("The Messsage ", data)
    if(err){
      throw err 
      
    }else{
      if(!data){
        res.sendStatus(401);
      }
      else{
        db.userDonater.findOne({username : reciever} , function (err , data ) {
          if(err){throw err}
            else {
              if(!data){
                res.sendStatus(402);
              }
              else{
                // console.log("fff" , req.session  )
                var message = new db.MessageSchema ({
                  sender:req.session.user , 
                  reciver:reciever , 
                  message:text
                })
              }
            }
            message.save(function(err,data){
              if(err){
                throw err
              }else{
                res.send(data)
              }

            })
          }) 
      }
    }

  })
}

exports.reciveMessag = function (req , res) {
  console.log("bushra ")
  db.MessageSchema.find({} , function (err , data) {
    if(err ){throw err}
      console.log("daaattaa" , data)
    res.send(data)
  })
}
