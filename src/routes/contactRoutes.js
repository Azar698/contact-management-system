import express from 'express';
import Contact from "../models/Contact.js";
import Joi  from 'joi'


const contactSchema = Joi.object({
    name : Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().allow(''),
})

const router = express.Router();

router.get('/',async(req,res)=>{
    try{
        const contacts = await Contact.find();
        res.status(200).json(contacts)
    }catch(err){
        res.status(500).json({message :'Error in fetching contacts:', err})
    }
})

router.post('/',async(req,res)=>{
    const {error}= contactSchema.validate(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message})
    } 
    try{
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json(newContact);
    }catch (error) {
        res.status(500).json({ message: 'Error creating contact', error });
    }
})

router.put('/:id',async(req,res)=>{
    const {error} = contactSchema.validate(req.body);
    if(error){
      return res.status(400).json({message:error.details[0].message})
    }

    try{
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        if(!updatedContact){
            return res.status(404).json({message:'Contact not found'});
        }
        res.status(200).json(updatedContact)
    }catch(error){
        console.log(error)
        res.status(500).json({message:'Error in updating contact',error})
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if(!deletedContact){
            return res.status(404).json({message:'Contact not  found'})
        }
        res.status(200).json({message:'Contact has been deleted successfully'})
    }catch(err){
        res.status(500).json({message:'Encounterd an error',err})
    }
})

router.get('/:id',async(req,res)=>{
    try{
        const contact = await Contact.findById(req.params.id);
        if(!contact){
            return res.status(404).json({message:"contact not found"})
        }
        res.status(200).json(contact)
    }catch(err){
        res.status(500).json({message:'Error in fetching the contact',err})
    }
})

router.get('/search', async (req, res) => {
    const { name, email } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
  
    try {
      const contacts = await Contact.find(filter);
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ message: 'Error searching contacts', error });
    }
  });

export default router