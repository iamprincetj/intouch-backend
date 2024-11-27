"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleType = exports.OrganizationType = void 0;
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["School"] = "school";
    OrganizationType["Office"] = "office";
    OrganizationType["Others"] = "others";
})(OrganizationType || (exports.OrganizationType = OrganizationType = {}));
var RoleType;
(function (RoleType) {
    RoleType["Leader"] = "leader";
    RoleType["Admin"] = "admin";
    RoleType["User"] = "user";
})(RoleType || (exports.RoleType = RoleType = {}));
