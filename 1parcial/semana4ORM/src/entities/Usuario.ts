import { Entity, Column, PrimaryGeneratedColumn, OneToOne,} from "typeorm";
import { Cliente } from "./Cliente";
import { Arquitecto } from "./Arquitecto";

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

    @Column({
      type: 'enum',
      enum: Rol,
      default: Rol.CLIENTE
    })
    rol: Rol;

    @Column({
      type: 'enum',
      enum: Estado,
      default: Estado.ACTIVO
    })
    estado: Estado;

    @Column()
    password: string;

    @Column({ type: 'timestamp' })
    fechaRegistro: Date;

    @Column({ nullable: true })
    foto_perfil?: string;

    @Column("simple-array", { nullable: true })
    especialidades?: string[];

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
   
    

