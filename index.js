const dotenv = require('dotenv').config()

if(dotenv.error) throw dotenv.error

const { leerInput, inquirerMenu, pausa, listadoLugares } = require("./helpers/inquirer")
const busquedas = require("./models/busquedas")

const c = (msg) => console.log(msg)

const main = async () => {
    let opt
    do{
        opt = await inquirerMenu()

        switch(opt){
            case 1:
                // Mostrar mensaje
                const lugar = await leerInput('Ciudad: ')
                // Buscar lugares
                const lugares = await busquedas.lugares(lugar)
                // Seleccionar el lugar
                const idSelect = await listadoLugares(lugares)
                const lugarSelect = lugares.find(l => l.id === idSelect)
                // Clima
                
                // Mostrar resultados
                c('\nInformacion del clima\n'.green)
                c(`Lugar: ${lugarSelect.nombre}`)
                c(`Latitud: ${lugarSelect.lat}`)
                c(`Longitud: ${lugarSelect.long}`)
                c(`Temperatura: `)
                c(`Minima: `)
                c(`Maxima: `)
                break
            case 2:
                break
            default:
                break
        }

        if(opt !== 0) await pausa()
    }while(opt !== 0)
}

main()