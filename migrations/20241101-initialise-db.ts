import { DataTypes, QueryInterface } from 'sequelize';
export interface Context {
  context: QueryInterface;
}

module.exports = {
  up: async ({ context: queryInterface }: Context) => {
    await queryInterface.createTable('organizations', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organization_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      organization_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      organization_password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      organization_location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
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
      organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'id' },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async ({ context: queryInterface }: Context) => {
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('organizations');
  },
};
