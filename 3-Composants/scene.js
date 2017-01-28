define([
  'sceneObject',
], (
  SceneObject
) => {
  'use strict';

  // # Classe *Scene*
  // La classe *Scene* représente la hiérarchie d'objets contenus
  // simultanément dans la logique du jeu.
  class Scene {
    // ## Fonction statique *create*
    // La fonction *create* permet de créer une nouvelle instance
    // de la classe *Scene*, contenant tous les objets instanciés
    // et configurés. Le paramètre `description` comprend la
    // description de la hiérarchie et ses paramètres. La fonction
    // retourne une promesse résolue lorsque l'ensemble de la
    // hiérarchie est configurée correctement.

    static create(description) {
      const scene = new Scene(description);
      scene.objects = [];

      var promiseses = [];

      for(var i in description) {
        var sceneObject = SceneObject.create(i, description[i], scene);
        promiseses.push(sceneObject.promise);
        scene.objects.push(sceneObject);
      }

      /*for(var i in scene.objects) {
        scene.objects[i].setup();
      }*/

      return Promise.all(promiseses);
    }

    // ## Méthode *display*
    // Cette méthode appelle les méthodes *display* de tous les
    // objets de la scène.
    display(dT) {
      throw new Error('Not implemented');
    }

    // ## Méthode *update*
    // Cette méthode appelle les méthodes *update* de tous les
    // objets de la scène.
    update(dT) {
      throw new Error('Not implemented');
    }

    // ## Fonction *findObject*
    // La fonction *findObject* retourne l'objet de la scène
    // portant le nom spécifié.
    findObject(objectName) {
      for(var i in this.objects) {
        if(this.objects[i].name == objectName) return this.objects[i];
      }
      return null;
    }
  }

  return Scene;
});
