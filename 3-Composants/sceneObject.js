define([
  'components',
], (
  ComponentFactory
) => {
  'use strict';

  // # Classe *SceneObject*
  // La classe *SceneObject* représente un objet de la scène qui
  // peut contenir des enfants et des composants.
  class SceneObject {
    // ## Méthode *addComponent*
    // Cette méthode prend en paramètre le type d'un composant et
    // instancie un nouveau composant.
    constructor() {
      this.components = [];
      this.children = [];
    }

    addComponent(type) {
      const newComponent = ComponentFactory.create(type, this);
      this.components[type] = newComponent;
      return newComponent;
    }

    // ## Fonction *getComponent*
    // Cette fonction retourne un composant existant du type spécifié
    // associé à l'objet.
    getComponent(type) {
      return this.components[type];
    }

    // ## Méthode *addChild*
    // La méthode *addChild* ajoute à l'objet courant un objet
    // enfant.
    addChild(objectName, child) {
      this.children[objectName]=child;
    }

    // ## Fonction *getChild*
    // La fonction *getChild* retourne un objet existant portant le
    // nom spécifié, dont l'objet courant est le parent.
    getChild(objectName) {
      return this.children[objectName];
    }

    // ## Fonction *fingObjectInScene*
    // Cette fonction retourne un objet de la scène portant le
    // nom spécifié. Cet objet n'est pas nécessairement en lien
    // avec l'objet courant. Voir la méthode `findObject` de la
    // classe *Scene*.
    findObjectInScene(objectName) {
      return window.scene.findObject(objectName);
    }


    // ## Méthode *display*
    // Cette méthode appelle la méthode *display* des composants
    // de l'objet.
    display(dT) {
      for(var i in this.components) {
        this.components[i].display(dT);
      }
    }

    // ## Méthode *update*
    // Cette méthode appelle la méthode *update* des composants
    // de l'objet.
    update(dT) {
      for(var i in this.components) {
        this.components[i].update(dT);
      }
    }
  }

  return SceneObject;
});
