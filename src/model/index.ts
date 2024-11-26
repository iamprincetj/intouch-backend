import Organization from './organizations';
import User from './users';

User.belongsTo(Organization);
Organization.hasMany(User);

// Role.belongsToMany(Organization, { through: User });
// Organization.belongsToMany(Role, { through: User });

export { User, Organization };
