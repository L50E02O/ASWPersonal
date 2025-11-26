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
exports.Agenda = void 0;
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./Usuario");
const Conferencia_1 = require("./Conferencia");
let Agenda = class Agenda {
};
exports.Agenda = Agenda;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Agenda.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime" }),
    __metadata("design:type", Date)
], Agenda.prototype, "fechaAgendada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 200, nullable: true }),
    __metadata("design:type", String)
], Agenda.prototype, "notas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "pendiente" }),
    __metadata("design:type", String)
], Agenda.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Agenda.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, (usuario) => usuario.agendas),
    (0, typeorm_1.JoinColumn)({ name: "usuarioId" }),
    __metadata("design:type", Usuario_1.Usuario)
], Agenda.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 36 }),
    __metadata("design:type", String)
], Agenda.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Conferencia_1.Conferencia, (conferencia) => conferencia.agendas),
    (0, typeorm_1.JoinColumn)({ name: "conferenciaId" }),
    __metadata("design:type", Conferencia_1.Conferencia)
], Agenda.prototype, "conferencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 36 }),
    __metadata("design:type", String)
], Agenda.prototype, "conferenciaId", void 0);
exports.Agenda = Agenda = __decorate([
    (0, typeorm_1.Entity)("agendas")
], Agenda);
//# sourceMappingURL=Agenda.js.map