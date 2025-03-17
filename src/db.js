const path = require('path');
const fs = require('fs');

const getUsers = () => {
  const content = fs.readFileSync(path.join(path.join(__dirname, './users.json')), 'utf-8');
  const users = JSON.parse(content);

  return users;
}

module.exports.getUsers = getUsers;