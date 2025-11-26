"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conferencia = void 0;
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./Usuario");
const Agenda_1 = require("./Agenda");
let Conferencia = class Conferencia {
};
exports.Conferencia = Conferencia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Conferencia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 200 }),
    __metadata("design:type", String)
], Conferencia.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Conferencia.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime" }),
    __metadata("design:type", Date)
], Conferencia.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime" }),
    __metadata("design:type", Date)
], Conferencia.prototype, "fechaFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 200 }),
    __metadata("design:type", String)
], Conferencia.prototype, "ubicacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Conferencia.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Conferencia.prototype, "capacidadMaxima", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Conferencia.prototype, "inscritos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "activa" }),
    __metadata("design:type", String)
], Conferencia.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, (usuario) => usuario.conferencias),
    (0, typeorm_1.JoinColumn)({ name: "organizadorId" }),
    __metadata("design:type", Usuario_1.Usuario)
], Conferencia.prototype, "organizador", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 36 }),
    __metadata("design:type", String)
], Conferencia.prototype, "organizadorId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Agenda_1.Agenda, (agenda) => agenda.conferencia),
    __metadata("design:type", Array)
], Conferencia.prototype, "agendas", void 0);
exports.Conferencia = Conferencia = __decorate([
    (0, typeorm_1.Entity)("conferencias")
], Conferencia);
//# sourceMappingURL=Conferencia.js.map