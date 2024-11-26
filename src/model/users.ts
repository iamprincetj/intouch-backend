import { sequelize } from '../utils/db';
import { Model, DataTypes } from 'sequelize';

class User extends Model {}

User.init(
  {
    // Users model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'organization', key: 'id' },
    },
  },
  {
    sequelize,
    modelName: 'user',
    timestamps: true,
    underscored: true,
  }
);

export default User;
