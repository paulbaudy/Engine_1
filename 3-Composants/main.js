define([
  'utils',
  'graphicsAPI',
  'inputAPI',
  'scene',
], (
  Utils,
  GraphicsAPI,
  InputAPI,
  Scene
) => {
  'use strict';

  // ## Méthode *run*
  // Cette méthode initialise les différents systèmes nécessaires
  // et démarre l'exécution complète du jeu.
  function run(canvasId) {
    setupSystem(canvasId);
    return launchGame();
  }

  // ## Méthode *launchGame*
  // Cette méthode initialise la scène du jeu et lance la
  // boucle de jeu.
  function launchGame() {
    return Utils.loadJSON('scenes/scene.json')
      .then((sceneDescription) => {
        return Scene.create(sceneDescription);
      })
      .then((scene) => {
        console.log(scene);
        const displayFn = scene.display.bind(scene);
        const updateFn = scene.update.bind(scene);

        return Utils.loop([
          displayFn,
          GraphicsAPI.renderFrame,
          updateFn,
        ]);
      });
  }

  // ## Méthode *setupSystem*
  // Cette méthode initialise les différents systèmes nécessaires.
  function setupSystem(canvasId) {
    GraphicsAPI.init(canvasId);
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
