// On nomme ici le module *components* afin qu'il soit appelé
// lors de la création de composants.
define('components', () => {
  'use strict';

  // # Composant de test *TestComponent*
  // On définit ici un *[mock object](https://fr.wikipedia.org/wiki/Mock_%28programmation_orient%C3%A9e_objet%29)*
  // qui permet de tester les réactions de nos objets de scène
  // avec les composants, sans avoir besoin d'avoir des composants
  // réels.
  class TestComponent {
    // ## Constructeur de la classe *TestComponent*
    // Le constructeur conserve le type demandé et une référence
    // vers l'objet qui l'a créé dans ses attributs. Il appelle
    // ensuite la méthode statique `onCreate` avec une référence
    // à lui-même
    constructor(type, owner) {
      this.type = type;
      this.owner = owner;
      TestComponent.onCreate(this);
    }

    // ## Méthodes du composant
    // Chaque méthode du composant appelle la méthode statique
    // correspondant en passant une référence à lui-même,
    // en plus des paramètres au besoin.
    setup(descr) {
      return TestComponent.onSetup(this, descr);
    }

    display(dT) {
      return TestComponent.onDisplay(this, dT);
    }

    update(dT) {
      return TestComponent.onUpdate(this, dT);
    }
  }

  // ## Pointeurs de méthodes statiques
  // Ces méthodes statiques n'ont aucun comportement par défaut
  // et, par la nature de JavaScript, pourront être remplacées
  // par des méthodes au besoin des tests.
  // Elles seront appelées lors des différentes actions sur les
  // composants de test afin d'en récupérer de l'information.
  TestComponent.onCreate = ( /*comp*/ ) => {};
  TestComponent.onSetup = ( /*comp, descr*/ ) => {};
  TestComponent.onDisplay = ( /*comp, dT*/ ) => {};
  TestComponent.onUpdate = ( /*comp, dT*/ ) => {};

  return {
    create: (type, owner) => {
      return new TestComponent(type, owner);
    },
    TestComponent: TestComponent,
  };
});
