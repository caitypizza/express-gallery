module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
    }
  });
  return User;
};