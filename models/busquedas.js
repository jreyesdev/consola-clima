const axios = require('axios')

class Busquedas {
    historial = ['Tegucipalga','Madrid','Barcelona']

    constructor(){
        // TODO: leer si BBDD existe
        this.mapBoxUrl = process.env.MAPBOX_URL
        this.mapBoxToken = process.env.MAPBOX_KEY
    }

    get paramsMapBox(){
        return {
            'access_token': this.mapBoxToken,
            'limit': 5,
            'language': 'es'
        }
    }

    async lugares(lugar=''){
        try{
            const instance = axios.create({
                baseURL: `${this.mapBoxUrl}/${lugar}.json`,
                params: this.paramsMapBox
            });
            const { data } = await instance.get();
            return data.features.map(place => ({
                id: place.id,
                nombre: place.place_name,
                long: place.center[0],
                lat: place.center[1]
            }))
        }catch(err){
            console.error(err)
            return []
        }
    }
}

module.exports = new Busquedas()