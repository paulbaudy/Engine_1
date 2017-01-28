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

    static create(name, description, owner) {
        const sceneObj = new SceneObject();
        sceneObj.name = name;
        sceneObj.components = [];
        sceneObj.children = [];
        sceneObj.owner = owner;
        sceneObj.description = description;
        return sceneObj;
    }

    setup(resolve) {
      var currentObj = this;
      var action = function(resolve) {
        for(var i in currentObj.description['components']) {
           var comp = {type : i, descr : currentObj.description['components'][i]}
           currentObj.addComponent(comp);
        }

        for(var i in currentObj.description['children']) {
          currentObj.addChild(i, currentObj.description['children'][i]);
        }
      }



    }

    addComponent(comp) {
      const newComponent = ComponentFactory.create(comp.type, this);
      newComponent.setup(comp.descr);
      this.components.push({type : comp.type, obj : newComponent});
    }

    // ## Fonction *getComponent*
    // Cette fonction retourne un composant existant du type spécifié
    // associé à l'objet.
    getComponent(type) {
      for(var i in this.components) {
        if(this.components[i].type == type) return this.components[i].obj;
      }
      return null;
    }

    // ## Méthode *addChild*
    // La méthode *addChild* ajoute à l'objet courant un objet
    // enfant.
    addChild(objectName, child) {
      this.children.push(SceneObject.create(objectName, child));
    }

    // ## Fonction *getChild*
    // La fonction *getChild* retourne un objet existant portant le
    // nom spécifié, dont l'objet courant est le parent.
    getChild(objectName) {
      for(var i in this.children) {
        if(this.children[i].name == objectName) return this.children[i];
      }
      return null;
    }

    // ## Fonction *fingObjectInScene*
    // Cette fonction retourne un objet de la scène portant le
    // nom spécifié. Cet objet n'est pas nécessairement en lien
    // avec l'objet courant. Voir la méthode `findObject` de la
    // classe *Scene*.
    findObjectInScene(objectName) {
      this.owner.findObject(objectName);
    }

    // ## Méthode *display*
    // Cette méthode appelle la méthode *display* des composants
    // de l'objet.
    display(dT) {
      for(var i in this.components) {
        this.components[i].display();
      }
      for(var i in this.children) {
        this.children[i].display();
      }
    }

    // ## Méthode *update*
    // Cette méthode appelle la méthode *update* des composants
    // de l'objet.
    update(dT) {
      for(var i in this.components) {
        this.components[i].update();
      }
      for(var i in this.children) {
        this.children[i].update();
      }
    }
  }

  return SceneObject;
});
