async function authArtist(req , res , next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message : "Unauthorized"})
        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        if(decoded.role!='artist'){
            return res.status(403).json({message : "You Dont have Access"})
        }
        req.user = decoded;
        next();
    } catch (error) {
        
    }
}

module.exports = authArtist;