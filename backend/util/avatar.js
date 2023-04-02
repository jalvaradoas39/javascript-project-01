const md5 = require('md5');

const getAvatarImg = (userEmail) => {
    return `https://gravatar.com/avatar/${md5(userEmail)}?s=128`;
}

module.exports = {
    getAvatarImg
}