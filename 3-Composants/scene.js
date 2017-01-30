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
      this.scene = new Scene(description);
        window.scene = this.scene; //TODO voir pour autrement
      this.scene.objects = [];
      var objComponents = [];
      var promises = [];

        for(var i in description) {
            var objName = i;
            var sceneObject = new SceneObject(description);
            if(this.scene.objects[objName])
                objName = i+"bis";

            this.scene.objects[objName] = sceneObject;

            for(var childName in description[i].children){
                var name = childName;
                var child = new SceneObject(description[i].children[childName]);
                if(this.scene.objects[name])
                    name = name+"bis";
                sceneObject.addChild(childName, child);
                this.scene.objects[name] = child;
                for(var type in description[i].children[childName].components){
                    objComponents.push({obj : child.addComponent(type), descr : description[i].children[childName].components[type]});
                }
            }
            for(var type in description[i].components){
                objComponents.push({obj : this.scene.objects[objName].addComponent(type), descr : description[i].components[type]});
            }
        }

        console.log(objComponents);
        for(var comp in objComponents)
            promises.push(objComponents[comp].obj.setup(objComponents[comp].descr));

        var self = this;
        return Promise.all(promises).then(function(){ return self.scene; });
    }

    // ## Méthode *display*
    // Cette méthode appelle les méthodes *display* de tous les
    // objets de la scène.
    display(dT) {
      for(var i in this.objects) {
        this.objects[i].display(dT);
      }
    }

    // ## Méthode *update*
    // Cette méthode appelle les méthodes *update* de tous les
    // objets de la scène.
    update(dT) {
      for(var i in this.objects) {
        this.objects[i].update(dT);
      }
    }

    // ## Fonction *findObject*
    // La fonction *findObject* retourne l'objet de la scène
    // portant le nom spécifié.
    findObject(objectName) {
      return this.objects[objectName];
    }
  }

  return Scene;
});
