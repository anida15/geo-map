<template>
    <div></div>    </template>
  
  <style scoped>
          .card {
            width: 300px;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: #fff;
            margin: 20px auto;
        }

        .label {
            display: inline-block;
            width: 100px;
            font-weight: bold;
            color: #333;
        }

        .value {
            display: inline-block;
            color: #666;
        }

        .item {
            margin-bottom: 10px;
        }

  @keyframes moveWord {
            0% {
                transform: translateX(-100%);  
            }
            100% {
                transform: translateX(100%); 
            }
        }

        .moving-word {
            position: absolute;  
            top: 70%;  
            left: 0;  
            animation: moveWord 5s linear infinite;  
        }
.search-icon{
  cursor: pointer;

}
 
  .menu-icon {
    
  cursor: pointer;
}#floating-bar {
    position: fixed;
    top: 10px;  
    left: 10px;  
    z-index: 1000;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    max-width: 430;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}


  #map {
    position: fixed;
   
    width: 100%;
    height: 100%;
}
 
.village-form {
  margin-top: 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.4); 
  padding: 10px;
}
.village-form input[type="text"] {
  width: 220px;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}
.error-message p {
  widows: 10px;
  text-align: center;
  color: red;
}
.village-form button {
  width: 150px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.village-form button:hover {
  background-color: #0056b3;
}

  .register-button{
    width: 170px;
 
    padding: 10px 20px;
    margin-right: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    z-index: 1000;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

  }

  .register-button:hover {
    transform: scale(1.1);
  }
  .distribution-button {
    padding: 10px 20px;
    width: 170px;
    margin-right: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    z-index: 1000;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }
  
  .distribution-button:hover {
    transform: scale(1.1);
  }
  
  #search-bar {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
  }
  
  #search-bar input {
    width: 200px;
    padding: 5px;
    margin-right: 5px;
  }

  
  #search-bar button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
  }
  
  .search-results {
    margin-top: 5px;  
  }
  </style>
  