import ICliente from "../domain/ICliente";
import { registroClientes } from "./registrosClientes";

// Hecho por Neysser Delgado
export class ClienteRepository {
    // registroClientes es una lista que contiene los 10 registros de Clientes
    private clientes: Array<ICliente> = registroClientes;

    // create con Callbacks
    create(cliente: ICliente, callback: CallableFunction): void{
        // validación de datos
        // Verificar si el cliente ya existe
        const clienteExiste = this.clientes.find((c)=>c.id_cliente === cliente.id_cliente);
        if(clienteExiste){
            return callback(new Error("Ya existe un cliente con ese id"), null); // si sale man
        }

        setTimeout(()=>{ // simulacion de latencia de red
            try{
                this.clientes.push(cliente);
                callback(null, cliente); // si sale bien
            }catch(error){
                callback(new Error("Error al incertar cliente"), null) // si sale mal
            }
        }, 1500);
    }

    // update con promise
    update(id: string, datos: ICliente): Promise<ICliente>{
        return new Promise((resolve, reject)=>{
            // simulacion de latencia
            setTimeout(()=>{
                // Validar que si exista ese cliente 
                const clienteIndex = this.clientes.findIndex((c)=>c.id_cliente===id);
                if(clienteIndex===-1){
                    return reject(new Error("Cliente no encontrado"));
                }
                
                // Cliente actual en memoria
                const clienteActual = this.clientes[clienteIndex];
                if(!clienteActual){
                    return reject(new Error("Cliente no encontrado"));
                }

                // Actualizar de forma parcial
                this.clientes[clienteIndex] = {
                    ...clienteActual,            // datos anteriores del cliente
                    ...datos,                    // datos nuevos a nivel de cliente
                    usuario: {
                    ...clienteActual.usuario,  // datos anteriores del usuario
                    ...(datos.usuario || {}),  // datos nuevos a nivel de usuario
                    },
                };
                resolve(this.clientes[clienteIndex]);
            }, 1500);
        });
    }

    // read con Async/Await
    async read(): Promise<ICliente[]>{
        try{
            // esto es para simular una operación de asincronia
            await new Promise(resolve => setTimeout(resolve, 1500));
            return this.clientes;
        }catch(error){
            throw error;
        }
    }

    async readById(id: string): Promise<ICliente>{
        try{
            await new Promise(resolve => setTimeout(resolve, 1500));
            const cliente = this.clientes.find((c)=>c.id_cliente===id);
            if(!cliente){
                throw new Error("Usuario no encontrado");
            }
            return cliente;
        }catch(error){
            throw error;
        }
    }

    // delete con Async/Await
    async delete(id: string): Promise<boolean>{
        try{
            // simular latencia
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const clienteIndex = this.clientes.findIndex((c)=>c.id_cliente === id);
            if(clienteIndex === -1){
                console.error("Cliente no fue encontrado");
                return false; // esto es para en caso de no encontrar el cliente
            }

            this.clientes.splice(clienteIndex, 1); // esto es una eliminacion fisica
            console.log("Cliente eliminado");
            return true; // true para cuando si encuentra y elimina
        }catch(error){
            console.error("Error al eliminar cliente: ", (error as Error).message);
            return false; // en caso de salir mal
        }
    }
}