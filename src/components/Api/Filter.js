// function findMatchingNames(data, nameToFind) {
//     let matchingNames = [];

//     // Iterate through each object in the array
//     data.forEach(obj => {
//         // Iterate through each array within the object
//         Object.values(obj).forEach(array => {
//             // Check if the array contains objects with the given name
//             if (Array.isArray(array)) {
//                 array.forEach(item => {
//                     if (item.name === nameToFind) {
//                         matchingNames.push(item);
//                     }
//                 });
//             }
//         });
//     });

//     return matchingNames;
// }
// function getAllInstancesOfKey(data, key) {
//     console.log("Hit fun")
//     console.log(data)
//     let instances = [];

//     // Iterate through each object in the array
//     data.forEach(obj => {
//         // Check if the object has the specified key
//         if (obj.hasOwnProperty(key)) {
//             instances.push(obj[key]);
//         }
//     });
//     console.log(instances)
//     return instances;
// }

// const funcs ={
//     getAllInstancesOfKey,
//     findMatchingNames
// }

// export default funcs;

