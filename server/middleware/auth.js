const jwt=require('jsonwebtoken')

const auth=(req,res,next)=>{
    try{
       const token=req.header("Authorization")
       if(!token) return res.status(400).json({msg:"Invalid Authorization 1"})

        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err) return res.status(400).json({msg:"Invalid Authorization"})
                req.user=user
                next()
                
        })

    }catch(err){
        return res.status(500).json({msg:err.message})

    }
}
module.exports=auth

// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//     try {
//         const token = req.header("Authorization");
//         if (!token) return res.status(400).json({ msg: "Invalid Authentication: No Token Provided" });

//         // const splitToken = token.split(" ");
//         // if (splitToken[0] !== 'Bearer' || splitToken.length !== 2) {
//         //     return res.status(400).json({ msg: "Invalid Authentication: Incorrect Token Format" });
//         // }/

//         // const actualToken = splitToken[1];
//         jwt.verify(actualToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//             if (err) return res.status(400).json({ msg: "Invalid Authentication: Token Verification Failed" });

//             req.user = user;
//             next();
//         });
//     } catch (err) {
//         return res.status(500).json({ msg: "Server Error: " + err.message });
//     }
// };

// module.exports = auth;
