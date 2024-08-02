const bcrypt = require('bcryptjs');

// Fonction de hashage de mot de passe
async function hashPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

// Fonction de vérification de mot de passe
async function verifyPassword(password, hashedPassword) {
    if(typeof password !== "string") {
        return false;
    }
    else {
        return await bcrypt.compare(password, hashedPassword);
    }
}


module.exports = { hashPassword, verifyPassword };