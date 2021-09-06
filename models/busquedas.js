const fs = require('fs')
const path = require('path')

const axios = require('axios')

class Busquedas {
    historial = []

    constructor(){
        // TODO: leer si BBDD existe
        this.mapBoxUrl = process.env.MAPBOX_URL
        this.mapBoxToken = process.env.MAPBOX_KEY
        this.openWURL = process.env.OPENWEATHER_URL
        this.openWKEY = process.env.OPENWEATHER_KEY
    }

    get paramsMapBox(){
        return {
            'access_token': this.mapBoxToken,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather(){
        return {
            'appid': this.openWKEY,
            'lang': 'es',
            'units': 'metric'
        }
    }

    async lugares(lugar=''){
        try{
            const instance = axios.create({
                baseURL: `${this.mapBoxUrl}/${lugar}.json`,
                params: this.paramsMapBox
            })
            const { data } = await instance.get()
            return data.features.map(place => ({
                id: place.id,
                nombre: place.place_name,
                long: place.center[0],
                lat: place.center[1]
            }))
        }catch(err){
            console.error(err)
        }
    }

    async climaLugar(lat,lon){
        try{
            const instance = axios.create({
                baseURL: this.openWURL,
                params: { ...this.paramsOpenWeather, lat, lon }
            })
            const { data: { weather, main } } = await instance.get()
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        }catch(err){
            console.error(err)
        }
    }

    agregarHistorial(lugar=''){
        // Solo 5 items
        if(this.historial.length > 5){
            this.historial = this.historial.slice(0,5)
        }
        // Filtra los diferente a lugar
        this.historial = this.historial.filter(name => name !== lugar)
        // Agrega de primero el lugar
        this.historial.unshift(lugar)
        // Guarda en arvhico json
        this.guardaFile()
    }

    guardaFile(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(path.join(__dirname,'../db/database.json'),JSON.stringify(payload))
    }
}

module.exports = new Busquedas()