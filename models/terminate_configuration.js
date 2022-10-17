const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const terminate_configuration = sequelize.define(
    "terminate_configuration",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Timer: DataTypes.INTEGER,
      order: DataTypes.INTEGER,
      Message: DataTypes.TEXT,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "answer",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return terminate_configuration;
};
