import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db';

class Organization extends Model {}

Organization.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    organizationName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    organizationType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'organization',
  }
);

export default Organization;
