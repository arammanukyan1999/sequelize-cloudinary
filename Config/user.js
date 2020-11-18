const mysql2 = require('mysql2');
const Sequelize = require('sequelize');
const UserData = require("./userdata");


const sequelize =  new Sequelize('login','root','12345678',{
    host:'localhost',
    port: 3306,
    dialect:'mysql',
    dialectModule: mysql2, 
    storage: './database.mysql',
    });

 sequelize 
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

 const User =  sequelize.define('loginreg', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
      },
      password: {
        type: Sequelize.STRING(64),
        is: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/i
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        lowercase: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      
      isAdmin:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
  }, 
  

  )

  
 
   User.hasMany(UserData,{ foreignKey: 'userid' });
   UserData.belongsTo(User, {foreignKey: 'id'})

  // User.sync({force:true})
  
  module.exports = User ;
  

  

