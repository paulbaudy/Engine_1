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

    static create(name, description, owner) {
        const sceneObj = new SceneObject();
        sceneObj.name = name;
        sceneObj.owner = owner;
        sceneObj.description = description;
        return sceneObj;
    }

    setup() {
      var currentObj = this;
      var action = function(resolve) {
        for(var i in currentObj.description['components']) {
           //var comp = {type : i, descr : currentObj.description['components'][i]}
           currentObj.addComponent(i);
        }

        for(var i in currentObj.description['children']) {

          currentObj.addChild(i, currentObj.description['children'][i]);
        }
        /* return Promise.all(currentObj.children.map(function(sceneObj) {
             return sceneObj.setup();
        })).then(function() {
             resolve(currentObj.owner);
        });*/
        resolve(currentObj.owner);
      }

      return new Promise(action);
    }

    addComponent(type) {
      const newComponent = ComponentFactory.create(type, this);
      if(this.description) {
        for(var i in this.description['components']) {
             if(type == i) {
               console.log("setup");
                newComponent.setup(this.description['components'][i]);
                break;
             }
        }
      }

      this.components.push({type : type, obj : newComponent});
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
      var myChild = SceneObject.create(objectName, child, this.owner);
      myChild.setup();
      this.children.push(myChild);

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
      return this.owner.findObject(objectName);
    }

    findObjectInChildren(objectName) {
        if(this.name == objectName) return this;
        if(this.children.length > 0) {
          for(var i in this.children) {
             if(this.children[i].name == objectName) return this.children[i];
             else {
                 var res = this.children[i].findObjectInChildren(objectName);
                 if(res) return res;
             }
          }
        }
        return null;
    }

    // ## Méthode *display*
    // Cette méthode appelle la méthode *display* des composants
    // de l'objet.
    display(dT) {
      for(var i in this.components) {
        this.components[i].obj.display(dT);
      }
      for(var i in this.children) {
        this.children[i].display(dT);
      }
    }

    // ## Méthode *update*
    // Cette méthode appelle la méthode *update* des composants
    // de l'objet.
    update(dT) {
      for(var i in this.components) {
        this.components[i].obj.update(dT);
      }
      for(var i in this.children) {
        this.children[i].update(dT);
      }
    }
  }

  return SceneObject;
});
