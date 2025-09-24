import {CRUDServicio} from "./service/servicio";
import { DtoCrearServicio } from "./dto/crearUsuario.dto";

const crudServicio = new CRUDServicio();
const servicio1: DtoCrearServicio = {nombre: "Corte de pelo", precio: 5000, descripcion: "Corte de pelo para perros y gatos"};
const servicio2: DtoCrearServicio = {nombre: "Baño", precio: 3000, descripcion: "Baño para perros y gatos"};
crudServicio.createServicio(servicio1);
crudServicio.createServicio(servicio2);
console.log(crudServicio.readServicio());