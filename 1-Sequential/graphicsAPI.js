define(() => {
  'use strict';

  // # Fonctions d'affichage
  // Méthodes nécessaires pour charger et afficher
  // des images à l'écran.

  // ## Variable *canvas*
  // Représente l'élément HTML où est rendu le jeu
  let canvas = undefined;

  // ## Variable *ctx*
  // Représente le contexte de rendu, où s'exécutent
  // les commandes pour contrôller l'affichage
  let ctx = undefined;

  // ## Variable *drawCommands*
  // Cet variable comprend une liste des instructions
  // de rendu demandés pendant l'itération courante. Une
  // instruction de rendu comprend l'image à afficher et sa position.
  const drawCommands = [];

  // ## Méthode *init*
  // La méthode d'initialisation prend en paramètre le nom d'un objet de
  // type *canvas* de la page web où dessiner. On y extrait
  // et conserve alors une référence vers le contexte de rendu 2D.
  function init(canvasId) {
    module.canvas = canvas = document.getElementById(canvasId);
    ctx = canvas.getContext('2d');
  }

  // ## Méthode *loadImage*
  // Cette méthode instancie dynamiquement un objet du navigateur
  // afin qu'il la charge. Ce chargement se faisant de façon
  // asynchrone, on crée une [promesse](http://bluebirdjs.com/docs/why-promises.html)
  // qui sera [résolue](http://bluebirdjs.com/docs/api/new-promise.html)
  // lorsque l'image sera chargée.
  function loadImage(name) {
    return new Promise((resolve) => {
      const imgDownload = new Image();
      imgDownload.onload = () => {
        resolve(imgDownload);
      };
      imgDownload.src = `../img/${name}.png`;
    });
  }

  // ## Méthode *drawCenter*
  // Cette méthode ajoute à la liste des commandes de rendu une
  // image centrée aux coordonnées spécifiées.
  function drawCenter(img, x, y) {
    drawCommands.push({
      image: img,
      x: x,
      y: y,
    });
  }

  // ## Méthode *renderFrame*
  // Cette méthode exécute les commandes de rendu en attente.
  function renderFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCommands.forEach((c) => {
      ctx.drawImage(c.image, c.x - (c.image.width / 2), c.y - (c.image.height / 2));
    });
    drawCommands.length = 0;
  }

  // ## Méthode *requestFullScreen*
  // Méthode utilitaire pour mettre le canvas en plein écran.
  // Il existe plusieurs méthodes selon le navigateur, donc on
  // se doit de vérifier l'existence de celles-ci avant de les
  // appeler.
  //
  // À noter qu'un script ne peut appeler le basculement en plein
  // écran que sur une action explicite du joueur.
  function requestFullScreen() {
    const method = canvas.requestFullScreen || canvas.webkitRequestFullScreen || canvas.mozRequestFullScreen || function() {};
    method.apply(canvas);
  }

  // Méthodes exportées du module `graphicsAPI`.
  // On la met dans une variable car on désire y ajouter
  // la propriété `canvas` lors de l'appel de la méthode
  // d'initialisation.
  const module = {
    init: init,
    loadImage: loadImage,
    drawCenter: drawCenter,
    renderFrame: renderFrame,
    requestFullScreen: requestFullScreen,
  };

  return module;
});
