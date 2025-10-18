import { Entity, Column, PrimaryGeneratedColumn, OneToOne,} from "typeorm";
import { Cliente } from "src/cliente/entities/cliente.entity";
import { Arquitecto } from "src/arquitecto/entities/arquitecto.entity";

//Esto lo hizo Leo Holguin
  export enum Rol {
    CLIENTE = 'cliente',
    ARQUITECTO = 'arquitecto',
    MODERADOR = 'moderador'
  }

  export enum Estado {
    ACTIVO = 'activo',
    SUSPENDIDO = 'suspendido'
  }

  // Entidad Usuario adaptada para coincidir con la interfaz IUsuario
  @Entity()
  export class Usuario {
    @PrimaryGeneratedColumn("uuid")
    id_usuario: string;

    @Column()
    nombre: string;

    @Column({ unique: true })
    email: string;

    @Column()
    rol: Rol;

    @Column()
    estado: Estado;

    @Column()
    password: string;

    @Column()
    fechaRegistro: string;

    @Column({ nullable: true })
    foto_perfil?: string;

    @Column({ nullable: true })
    ubicacion?: string;

    @Column({ default: false })
    verificado: boolean;

    @Column({ default: 0 })
    vistas_perfil: number;
    
    //derlis aporto aqui :D

    @OneToOne(() => Cliente, cliente => cliente.usuario)
    cliente: Cliente;
    
    @OneToOne(() => Arquitecto, arquitecto => arquitecto.usuario)
    arquitecto: Arquitecto;
  }
   
    

