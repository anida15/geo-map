const format =(data)=>{
  console.log(data)
     const structured_data =  data.map(item=>{
            const _data ={
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [item?.latitude, item?.longitude],
                },
                "properties": {
                  "orgunit": {
                    "id": item?.id,
                    "name": item?.name,
                    "code": item?.code,
                    "org_id": item?.org_id,
                    "parent_id": item?.parent_id,
                    "level_id": item?.level_id,
                    "supervisor":item?.supervisor
                  }
                }
              }
              return _data
        })
console.log(structured_data)
        return structured_data

}

export default format