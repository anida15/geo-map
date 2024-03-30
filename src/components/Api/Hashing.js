class GeoHashService {

    static encode({ longitude, latitude, precision = 12 }) {
        const BITS = [16, 8, 4, 2, 1];
        const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
        let isEven = true;
        let bit = 0;
        let ch = 0;
        let precisionResult = '';

        let minLat = -90,
            maxLat = 90;
        let minLon = -180,
            maxLon = 180;
        let mid;
        while (precision > 0) {
            if (isEven) {
                mid = (minLon + maxLon) / 2;
                if (longitude > mid) {
                    ch |= BITS[bit];
                    minLon = mid;
                } else {
                    maxLon = mid;
                }
            } else {
                mid = (minLat + maxLat) / 2;
                if (latitude > mid) {
                    ch |= BITS[bit];
                    minLat = mid;
                } else {
                    maxLat = mid;
                }
            }

            isEven = !isEven;
            if (bit < 4) {
                bit++;
            } else {
                precision--;
                bit = 0;
                precisionResult += BASE32[ch];
                ch = 0;
            }
        }

   
        return precisionResult;
    }

    static refineInterval(min, max, bit, lowFunc, highFunc) {
        if (bit) {
            lowFunc((min + max) / 2);
        } else {
            highFunc((min + max) / 2);
        }
    }

    static decode({ geohash }) {
        const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
        const BITS = [16, 8, 4, 2, 1];
        const BASE = BASE32.length;
        let isEven = true;
        let latMin = -90,
            latMax = 90;
        let lonMin = -180,
            lonMax = 180;

        for (let i = 0; i < geohash.length; i++) {
            const char = geohash[i];
            const idx = BASE32.indexOf(char);
            for (let j = 0; j < 5; j++) {
                const bit = BITS[j];
                if (isEven) {
                    this.refineInterval(lonMin, lonMax, idx & bit, function(lon) { lonMin = lon; }, function(lon) { lonMax = lon; });
                } else {
                    this.refineInterval(latMin, latMax, idx & bit, function(lat) { latMin = lat; }, function(lat) { latMax = lat; });
                }
                isEven = !isEven;
            }
        }

        const latitude = (latMin + latMax) / 2;
        const longitude = (lonMin + lonMax) / 2;

        return {
            latitude: latitude,
            longitude: longitude
        };
    }

    static getBoundingBox({ latitude, longitude, radius }) {//radius in km
        const EARTH_RADIUS = 6371.01;
        const lat = latitude;
        const lon = longitude;
        const radDist = radius / EARTH_RADIUS;
        let minLat = lat - radDist;
        let maxLat = lat + radDist;
        let minLon;
        let maxLon;

        if (minLat > -90 && maxLat < 90) {
            const deltaLon = Math.asin(Math.sin(radDist) / Math.cos(lat));
            minLon = lon - deltaLon;
            if (minLon < -180) {
                minLon += 360;
            }
            maxLon = lon + deltaLon;
            if (maxLon > 180) {
                maxLon -= 360;
            }
        } else {
            minLat = Math.max(minLat, -90);
            maxLat = Math.min(maxLat, 90);
            minLon = -180;
            maxLon = 180;
        }

        return {
            minLat: minLat,
            maxLat: maxLat,
            minLon: minLon,
            maxLon: maxLon
        };
    }
    static level12({ latitude, longitude }) {
        return this.encode({ latitude, longitude, precision: 12 });
    }
    static  level12Coordinates({ geohash }) {
        return this.decode({ geohash });
    }
}
export default GeoHashService;


//usage
// import GeoHashService from './GeoHashService';
// const geohash = GeoHashService.encode({ latitude: 37.421542, longitude: -122.085589, precision: 12 });
// console.log(geohash);
// const coordinates = GeoHashService.decode({ geohash: geohash });
//const lat = coordinates.latitude;
//const lon = coordinates.longitude;
