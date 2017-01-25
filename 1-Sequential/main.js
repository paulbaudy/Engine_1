define([
  'utils',
  'graphicsAPI',
  'inputAPI',
], (
  Utils,
  GraphicsAPI,
  InputAPI
) => {
  'use strict';

  // # Variables globales

  // ## Constantes et méthode *setupConstants*
  // Ces valeurs font office de constantes dans ce fichier. Les
  // valeurs nulles sont configurées dans la méthode `setupConstants`
  // et sont définies ici afin qu'elles aient une portée globale à
  // ce fichier.
  let AreaWidth = undefined;
  let AreaHeight = undefined;
  const ScoreY = 64;
  let ScoreP1X = undefined;
  let ScoreP2X = undefined;
  const BallSpeed = 500;
  const PaddleSpeed = 500;
  let PalP1X = undefined;
  let PalP2X = undefined;
  let BallRadius = undefined;
  let PaddleHeight = undefined;
  const MaxScore = 9;

  let CenterX = undefined;
  let CenterY = undefined;

  let PlayAreaMinX = undefined;
  let PlayAreaMaxX = undefined;
  let PlayAreaMinY = undefined;
  let PlayAreaMaxY = undefined;

  function setupConstants(canvas) {
    AreaWidth = canvas.width;
    AreaHeight = canvas.height;
    ScoreP1X = AreaWidth / 4;
    ScoreP2X = AreaWidth * 3 / 4;
    PalP1X = images.paddle.width / 2;
    PalP2X = AreaWidth - images.paddle.width / 2;
    BallRadius = images.ball.width / 2;
    PaddleHeight = images.paddle.height;

    CenterX = AreaWidth / 2;
    CenterY = AreaHeight / 2;

    PlayAreaMinX = PalP1X + BallRadius;
    PlayAreaMaxX = PalP2X - BallRadius;
    PlayAreaMinY = ScoreY + BallRadius;
    PlayAreaMaxY = AreaHeight - BallRadius;
  }

  // ## Variables de jeu
  // Ces variables représentent l'état actuel du jeu et sont
  // initialisées par la méthode `init` au lancement de la partie.
  let scoreP1 = null;
  let scoreP2 = null;
  let ballX = null;
  let ballY = null;
  let p1Y = null;
  let p2Y = null;
  let dirX = null;
  let dirY = null;
  let dyP1 = null;
  let dyP2 = null;

  // # Fonctions et méthodes

  // ## Fonction *loadImages*
  // Cette fonction retourne une [promesse](http://bluebirdjs.com/docs/why-promises.html)
  // qui charge toutes les images demandées de façon asynchrone
  // et qui assigne ensuite ces images au tableau associatif
  // global `images`, par leur nom.
  const images = {};

  function loadImages() {
    const imgNames = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'background', 'ball', 'paddle'];
    const promises = [];

    imgNames.forEach((name) => {
      const p = GraphicsAPI.loadImage(name)
        .then((img) => {
          images[name] = img;
        });
      promises.push(p);
    });

    return Promise.all(promises);
  }

  // ## Fonction *setupSystem*
  // Cette fonction commence par charger les images du jeu et
  // configure ensuite les constantes qui dépendent de celles-ci.
  function setupSystem() {
    return loadImages()
      .then(() => {
        return setupConstants(GraphicsAPI.canvas);
      });
  }

  // ## Méthode *init*
  // Cette méthode initialise les variables de jeu.
  function init() {
    scoreP1 = 0;
    scoreP2 = 0;
    ballX = CenterX;
    ballY = CenterY;
    p1Y = CenterY;
    p2Y = CenterY;
    dirX = 1;
    dirY = 1;
  }

  // ## Méthode *updateInput*
  // Cette méthode de la boucle de jeu récupère les entrées
  // pertinentes au jeu, soient les axes verticaux des joueurs
  // et le temps écoulé réel depuis la dernière itération.
  function updateInput() {
    dyP1 = InputAPI.getAxisY(0);
    dyP2 = InputAPI.getAxisY(1);
  }

  // ## Méthode *updateLogic*
  // Cette méthode de la boucle de jeu effectue les calculs
  // et fait la mise à jour de l'état du jeu.
  function updateLogic(dT) {
    // On commence par la mise à jour de la position des joueurs,
    // en s'assurant qu'ils ne dépassent pas l'aire de jeu

    p1Y += dyP1 * dT * PaddleSpeed;
    p2Y += dyP2 * dT * PaddleSpeed;

    p1Y = Utils.clamp(p1Y, PlayAreaMinY + PaddleHeight / 2, PlayAreaMaxY - PaddleHeight / 2);
    p2Y = Utils.clamp(p2Y, PlayAreaMinY + PaddleHeight / 2, PlayAreaMaxY - PaddleHeight / 2);

    // On fait également la mise à jour de la position de la balle.
    ballX += dirX * BallSpeed * dT;
    ballY += dirY * BallSpeed * dT;

    // Si la balle touche à la partie supérieure ou inférieure de
    // l'aire de jeu, on inverse sa direction verticale.
    if ((ballY < PlayAreaMinY) || (ballY > PlayAreaMaxY)) {
      dirY *= -1;
    }

    // Si la balle est dans la zone contrôlée par le joueur de gauche,
    if (ballX < PlayAreaMinX) {
      // on vérifie si la balle touche à la palette du joueur, dans
      // lequel cas on inverse la direction horizontale de la balle
      if (Utils.inRange(ballY, p1Y - PaddleHeight / 2, p1Y + PaddleHeight / 2)) {
        dirX *= -1;
      }

      // le cas échéant, on incrémente le score de l'adversaire et on
      // remet la balle au centre.
      else {
        scoreP2++;
        ballX = CenterX;
        ballY = CenterY;
      }
    }

    // On fait de même pour le joueur de droite.
    else if (ballX > PlayAreaMaxX) {
      if (Utils.inRange(ballY, p2Y - PaddleHeight / 2, p2Y + PaddleHeight / 2)) {
        dirX *= -1;
      } else {
        scoreP1++;
        ballX = CenterX;
        ballY = CenterY;
      }
    }

    // Si un joueur atteint le score maximal, on affiche un
    // message et on remet les scores à zéro.
    if ((scoreP1 > MaxScore) || (scoreP2 > MaxScore)) {
      alert('Partie terminée');
      scoreP1 = 0;
      scoreP2 = 0;
    }
  }


  // ## Méthode *updateOutput*
  // Cette méthode de la boucle de jeu affiche les éléments
  // à l'écran.
  function updateOutput() {
    GraphicsAPI.drawCenter(images.background, AreaWidth / 2, AreaHeight / 2);
    GraphicsAPI.drawCenter(images[scoreP1], ScoreP1X, ScoreY);
    GraphicsAPI.drawCenter(images[scoreP2], ScoreP2X, ScoreY);
    GraphicsAPI.drawCenter(images.ball, ballX, ballY);
    GraphicsAPI.drawCenter(images.paddle, PalP1X, p1Y);
    GraphicsAPI.drawCenter(images.paddle, PalP2X, p2Y);
    GraphicsAPI.renderFrame();

    return Promise.resolve();
  }

  // ## Méthode *launchGame*
  // Cette méthode initialise les valeurs du jeu et lance
  // la boucle de jeu à une fréquence de 60 images par seconde.
  function launchGame() {
    init();
    return Utils.loop([updateInput, updateLogic, updateOutput]);
  }

  // ## Méthode *run*
  // Cette méthode instancie les différents systèmes nécessaires
  // et démarre l'exécution complète du jeu.
  function run(canvasId) {
    GraphicsAPI.init(canvasId);

    return setupSystem()
      .then(launchGame);
  }

  // ## Méthode globale *requestFullScreen*
  // Cette méthode appelle la méthode correspondante du module
  // *graphicsAPI*. Elle est appelée par le bouton de la
  // page HTML. On l'assigne à l'objet `document`, ce qui permet
  // d'exister dans le contexte global et donc d'être accessible
  // depuis la page Web.
  document.requestFullScreen = function() {
    GraphicsAPI.requestFullScreen();
  };

  // Méthodes exportées du module `main`
  return {
    run: run,
  };
});
