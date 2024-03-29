const express = require('express')
const UserModel = require('../models/userSchema')
const authMiddleware = require('../middleware/authMiddleware')
// * Create a Router

const router = express.Router()

// Get all users
router.get('/',authMiddleware,async (req,res) => {
 
       try {
            const users = await UserModel.find()
            res.status(200).json(users)
        } catch (error) {
            console.log(error)
    }
    
    
})

//GET User BY ID
router.get('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id

    try {
        const user = await UserModel.findById(id)
        res.status(200).json(user)
    } catch (error) {
        console.error(error)
        res.status(400).json({
            msg: 'Id not found'
        })
    }
})



//* UPDATE USER BY ID
router.put('/:id',authMiddleware ,async (req, res) => {
    const id = req.params.id
    const newUserData = req.body
     try {

        const usertoUpdate = await UserModel.findById(id) 
         
        if (usertoUpdate._id.toString() !==  req.user.id ) {
            return res.status(400).json({msg: 'Not Authorized ! '})   // check to see if user logged in is the owner of the account
        }

        //* find the user by the id
         const user = await UserModel.findByIdAndUpdate(id, newUserData, {new: true})
         res.status(202).json(user)
     } catch (error) {
         console.log(error)
         res.status(400).json({
            msg: 'Id not found'
        })
     }
})

//! DELETE A USER
router.delete('/:id', authMiddleware,async (req, res) => {
    const id = req.params.id

    try {
        
        const usertoDelete = await UserModel.findById(id) 
         
        if (usertoDelete._id.toString() !==  req.user.id ) {
            return res.status(400).json({msg: 'Not Authorized ! '})   // check to see if user logged in is the owner of the account
        } 

        const user= await UserModel.findByIdAndDelete(id)
        res.status(200).json( {msg: `User # ${id} was deleted`})
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Id not found'
        })
    }
})



module.exports = router