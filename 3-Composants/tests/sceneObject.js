define([
  'chai',
  'components',
  'sceneObject',
  'scene',
], (
  chai,
  mockComponent,
  SceneObject,
  Scene
) => {
  'use strict';

  // # Classe de test
  // Cette classe de test est utilisée avec [Mocha](https://mochajs.org/),
  // une infrastructure permettant d'effectuer des tests unitaires.
  //
  // Les tests sont réalisés conjointement avec le module [Chai](http://chaijs.com/)
  // qui fournit des fonctions simplifiant les assertions avec
  // les tests. On utilise ici les fonctions [expect](http://chaijs.com/api/bdd/)
  // de Chai, par choix.

  const expect = chai.expect;

  const TestComponent = mockComponent.TestComponent;

  // # Tests sur la classe *SceneObject*
  describe('SceneObject', () => {
    // ## *beforeEach*
    // Cette méthode est exécutée par Mocha avant chaque test.
    // On l'utilise pour nettoyer les méthodes statique témoin
    // de la classe de composant de test.
    beforeEach(() => {
      TestComponent.onCreate = ( /*comp*/ ) => {};
      TestComponent.onSetup = ( /*comp, descr*/ ) => {};
      TestComponent.onDisplay = ( /*comp, dT*/ ) => {};
      TestComponent.onUpdate = ( /*comp, dT*/ ) => {};
    });

    // ## Tests unitaires
    //
    // On vérifie ici si on peut créer un objet simple, et si
    // l'objet créé est une instance de la classe d'objet.
    it('le module peut être instancié', (done) => {
      const sceneObj = new SceneObject();
      expect(sceneObj).instanceof(SceneObject);
      done();
    });

    // Une instance de la classe SceneObject devrait avoir
    // ces méthodes et fonctions. Ce test vérifie qu'elles
    // existent bel et bien, sans vérifier leur fonctionnement.
    it('a les méthodes requises', (done) => {
      const sceneObj = new SceneObject();
      expect(sceneObj).respondTo('addComponent');
      expect(sceneObj).respondTo('getComponent');
      expect(sceneObj).respondTo('addChild');
      expect(sceneObj).respondTo('getChild');
      expect(sceneObj).respondTo('findObjectInScene');
      expect(sceneObj).respondTo('display');
      expect(sceneObj).respondTo('update');
      done();
    });

    // Ce test vérifie si on peut ajouter un composant à
    // l'objet, par la méthode `addComponent`. Cette méthode
    // devrait instancier un nouveau composant de test, et on
    // conclut donc le test dans la méthode statique appelée
    // par le constructeur.
    it('peut ajouter un composant', (done) => {
      const sceneObj = new SceneObject();

      TestComponent.onCreate = (comp) => {
        expect(comp.type).equals('TestComp');
        expect(comp.owner).equals(sceneObj);
        done();
      };

      sceneObj.addComponent('TestComp');
    });

    // Ce test vérifie si on peut chercher un composant existant
    // à l'aide de la méthode `getComponent`. On ajoute deux
    // composants distincts à un objet, et on tente de les récupérer.
    it('peut chercher un composant', (done) => {
      const sceneObj = new SceneObject();
      const testComp = {};
      TestComponent.onCreate = (comp) => {
        testComp[comp.type] = comp;
      };

      sceneObj.addComponent('TestComp');
      sceneObj.addComponent('TestOtherComp');
      let value = sceneObj.getComponent('TestComp');
      expect(value).instanceof(TestComponent);
      expect(value).equals(testComp['TestComp']);
      value = sceneObj.getComponent('TestOtherComp');
      expect(value).instanceof(TestComponent);
      expect(value).equals(testComp['TestOtherComp']);
      done();
    });

    // On crée ici deux objets simples faisant office d'enfants
    // et on les ajoute à un objet par la méthode `addChild`.
    // On teste également la méthode `getChild` en vérifiant
    // si les objets récupérés sont ceux qui ont été ajoutés.
    it('peut ajouter et chercher des enfants', (done) => {
      const sceneObj = new SceneObject();
      const child1 = {
        hello: 'world'
      };
      const child2 = {
        foo: 'bar'
      };
      sceneObj.addChild('un', child1);
      sceneObj.addChild('deux', child2);
      let value = sceneObj.getChild('un');
      expect(value).equals(child1);
      value = sceneObj.getChild('deux');
      expect(value).equals(child2);
      done();
    });

    // Ce test vérifie si il est possible de récupérer un objet
    // de la scène par la méthode `findObjectInScene`. On doit
    // tout d'abord créer une scène complète, pour ensuite tenter
    // de chercher l'objet. On compare avec la méthode `findObject`
    // de la classe *Scene* pour vérifier le bon fonctionnement.
    it('peut chercher un objet globalement dans la scène', (done) => {
      Scene.create({
          premier: {
            components: {},
            children: {},
          },
          second: {
            components: {},
            children: {},
          },
        })
        .then((scene) => {
          const obj1 = scene.findObject('premier');
          const reference = scene.findObject('second');
          const obj2 = obj1.findObjectInScene('second');
          expect(obj2).exist;
          expect(obj2).instanceof(SceneObject);
          expect(obj2).equals(reference);
          done();
        })
        .catch((err) => {
          done(err || 'Erreur inconnue');
        });
    });

    // Lors de l'appel à la méthode *display*, l'objet doit à son
    // tour appeler la méthode *display* sur ses composants. On
    // vérifie que la méthode est appelée une seule fois.
    it('appelle une fois la méthode "display" de ses composants', (done) => {
      const sceneObj = new SceneObject();
      const calls = {};
      TestComponent.onDisplay = (comp, dT) => {
        expect(calls).not.property(comp.type);
        calls[comp.type] = dT;
      };

      sceneObj.addComponent('TestComp');
      sceneObj.addComponent('TestOtherComp');
      sceneObj.display(123);
      expect(calls).property('TestComp');
      expect(calls).property('TestOtherComp');
      expect(calls.TestComp).equals(123);
      expect(calls.TestOtherComp).equals(123);
      done();
    });

    // Comme pour le test ci-dessus, on vérifie que la méthode
    // *update* est appelée une seule fois sur tous les composants
    // de l'objet.
    it('appelle une fois la méthode "update" de ses composants', (done) => {
      const sceneObj = new SceneObject();
      const calls = {};
      TestComponent.onUpdate = (comp, dT) => {
        expect(calls).not.property(comp.type);
        calls[comp.type] = dT;
      };

      sceneObj.addComponent('TestComp');
      sceneObj.addComponent('TestOtherComp');
      sceneObj.update(123);
      expect(calls).property('TestComp');
      expect(calls).property('TestOtherComp');
      expect(calls.TestComp).equals(123);
      expect(calls.TestOtherComp).equals(123);
      done();
    });
  });
});
