const axios = require('axios')

class Busquedas {
    historial = ['Tegucipalga','Madrid','Barcelona']

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
}

module.exports = new Busquedas()