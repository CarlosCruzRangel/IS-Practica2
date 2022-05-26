import App from './App.js';

const root = document.getElementById('app');
const app = new App(root);

let optionsButtons = document.querySelectorAll('.option-button');
let advancedOptionButton = document.querySelectorAll('.adv-option-button');
let fontName = document.getElementById('fontName');
let fontSizeRef = document.getElementById('fontSize');
let writingArea = document.getElementById('text-input');
let linkButton = document.getElementById('createLink');
let alignButtons = document.querySelectorAll('.align');
let spacingButtons = document.querySelectorAll('.spacing');
let formatButtons = document.querySelectorAll('.format');
let scriptButtons = document.querySelectorAll('.script');

//Lista de FontList
let fontList = ['Arial', 'Verdana', 'Times New Roman', 'Garamond', 'Georgia', 'Courier New', 'cursive'];

//Ajustes iniciales
const initializer = () => {
  //Llamas de la función para resaltar los botones
  //No hay aspectos destacados para Link, Unlink, Lists, Deshacer, Rehacer ya que son operaciones únicas
  highlighter(alignButtons, true);
  highlighter(spacingButtons, true);
  highlighter(formatButtons, false);
  highlighter(scriptButtons, true);

  //crear opciones para nombres de fuentes
  fontList.map((value) => {
    let option = document.createElement('option');
    option.value = value;
    option.innerHTML = value;
    fontName.appendChild(option);
  });

  //FontSize permite solo hasta las 7
  for (let i = 1; i <= 7; i++) {
    let option = document.createElement('option');
    option.value = i;
    option.innerHTML = i;
    fontSizeRef.appendChild(option);
  }

  //tamaño predeterminado
  fontSizeRef.value = 3;
};

//lógica principal
const modifyText = (command, defaultUi, value) => {
  // ExecCommand Ejecutes comando en el texto seleccionado
  document.execCommand(command, defaultUi, value);
};

//Para operaciones básicas que no necesitan el parámetro de valor
optionsButtons.forEach((button) => {
  button.addEventListener('click', () => {
    modifyText(button.id, false, null);
  });
});

//Opciones que requieren un parámetro de valor (por ejemplo, colores, fuentes)
advancedOptionButton.forEach((button) => {
  button.addEventListener('change', () => {
    modifyText(button.id, false, button.value);
  });
});

//Enlace
linkButton.addEventListener('click', () => {
  let userLink = prompt('Enter a URL');
  //Si el enlace tiene http, pase directamente a los demás agregue https
  if (/http/i.test(userLink)) {
    modifyText(linkButton.id, false, userLink);
  } else {
    userLink = 'http://' + userLink;
    modifyText(linkButton.id, false, userLink);
  }
});

//Resaltar el botón hecho clic
const highlighter = (className, needsRemoval) => {
  className.forEach((button) => {
    button.addEventListener('click', () => {
      //necesidades de necesidades = verdadero significa que solo se debe resaltar un botón y otro sería normal
      if (needsRemoval) {
        let alreadyActive = false;

        //Si el botón actualmente se hace clic ya está activo
        if (button.classList.contains('active')) {
          alreadyActive = true;
        }

        //Eliminar resaltado de otros botones
        highlighterRemover(className);
        if (!alreadyActive) {
          //highlight clicked button
          button.classList.add('active');
        }
      } else {
        //Si se pueden resaltar otros botones
        button.classList.toggle('active');
      }
    });
  });
};

const highlighterRemover = (className) => {
  className.forEach((button) => {
    button.classList.remove('active');
  });
};

window.onload = initializer();
