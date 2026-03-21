exports.getEvents = async (req,res)=>{
    try{
     const events = await Event.find().sort({date:1});
     res.json(events);
    }
    catch(err){
     res.status(500).json({message:err.message});
    }
   }