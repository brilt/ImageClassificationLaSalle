//Desplegar imagen subida por el usuario
function display(event) {
  let input_image = document.getElementById("input_image");
  input_image.src = URL.createObjectURL(event.target.files[0]);

  console.log(input_image.src);
  let d = document.querySelector(".path");
  d.textContent += input_image.src;
}

//Mostrar a que animal(clase) pertenece la imagen subida
// https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/async_function

async function predict_animal() {
  //Declaración del arreglo con las clases de nuestro modelo
  animals = [
    "caballitoDeMar",
    "ciempies",
    "escorpion",
    "jirafa",
    "lemur",
    "libelula",
    "luciernagas",
    "mariposa",
    "rata",
    "tortuga",
  ];
  // Réinitialiser la couleur de fond et la couleur du texte de tous les éléments HTML correspondant à la liste des animaux

  animals.forEach((animal) => {
	document.getElementById(animal).removeAttribute('style');
  });
  
  let input = document.getElementById("input_image");
  // Apoyo: Repetir el preprocesamiento realizado en el cuaderno
  // https://js.tensorflow.org/api/latest/#image.resizeNearestNeighbor
  let imageproc = tf.browser
    .fromPixels(input)
    .resizeNearestNeighbor([224, 224])
    .expandDims(0)
    .div(255.0);
  console.log("Finalización del preprocesamiento de la imagen");

  const model = await tf.loadLayersModel("./tensorflowjs-model/model.json");
  pred = model.predict(imageproc);
  pred.print();
  console.log("Finalización de predicción");

  //Determinar cúal elemento del arreglo tiene mayor valor para asignarle a esa clase la salida final
  pred.data().then((data) => {
    console.log(data);
    output = document.getElementById("output_text");
    output.innerHTML = "";
    max_val = -1;
    max_val_index = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i] > max_val) {
        max_val = data[i];
        max_val_index = i;
      }
    }
    ANIMAL_DETECTADO = animals[max_val_index];
    document.getElementById("output_text").innerHTML =
      "<p>El animal detectado y su probabilidad corresponden a</p><p>Animal detectado: " +
      ANIMAL_DETECTADO +
      " ( " +
      (max_val * 100).toFixed(2) +
      "% probabilidad )</p>";
    document.getElementById(ANIMAL_DETECTADO).style.backgroundColor = "#F4D9E5";
    document.getElementById(ANIMAL_DETECTADO).style.color = "#5E4C5A";
  });
}
