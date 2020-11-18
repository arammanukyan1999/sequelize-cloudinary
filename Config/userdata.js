const Sequelize = require('sequelize');
const mysql2 = require('mysql2');


const sequelize = new Sequelize('login', 'root', '12345678', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  dialectModule: mysql2,
  storage: './database.mysql',
  sync: { force: true },

});

const UserData = sequelize.define('userdata', {
  userid: {
    type: Sequelize.STRING(64),
  },
  img: {
    type: Sequelize.STRING,
  },
}
);

module.exports = UserData;