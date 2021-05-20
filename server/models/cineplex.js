module.exports = (sequelize, DataTypes) => {
  const Cineplex = sequelize.define(
    'Cineplex',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );

  Cineplex.associate = function (models) {
    Cineplex.hasMany(models.Cinema, { foreignKey: 'cineplex_id' });
  };

  return Cineplex;
};
