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

                if(idSelect === '0') continue

                const { nombre, lat, long } = lugares.find(l => l.id === idSelect)
                // Agrega ciudad
                busquedas.agregarHistorial(nombre)
                // Clima
                const { desc, temp, min, max } = await busquedas.climaLugar(lat,long)
                // Mostrar resultados
                console.clear()
                c('\nInformacion del clima\n'.green)
                c(`Lugar: ${nombre}`)
                c(`Latitud: ${lat}`)
                c(`Longitud: ${long}`)
                c(`Descripcion: ${desc}`)
                c(`Temperatura: ${temp}`)
                c(`Minima: ${min}`)
                c(`Maxima: ${max}`)
                break
            case 2:
                busquedas.historial.forEach((l,i) => {
                    const idx = `${i + 1}.`.green
                    c(`${idx} ${l}`)
                })
                break
        }

        if(opt !== 0) await pausa()
    }while(opt !== 0)
}

main()