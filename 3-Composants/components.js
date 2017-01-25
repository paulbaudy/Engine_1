define(() => {
  'use strict';

  // # Classes de support
  //
  // ## Classe *Vector2*
  // Classe pour représenter des vecteurs à deux dimensions.
  class Vector2 {
    // ### Constructeur de la classe *Vector2*
    // Le constructeur de la classe de vecteur prend en
    // paramètre un objet comprenant les propriétés `x` et `y`.
    constructor(descr) {
      this.x = descr.x;
      this.y = descr.y;
    }

    // ### Fonction *clone*
    // Les objets JavaScript étant passés par référence, cette
    // fonction permet de créer rapidement une copie de cette
    // structure afin d'y effectuer des opérations sans modifier
    // l'original.
    clone() {
      return new Vector2({
        x: this.x,
        y: this.y,
      });
    }

    // ### Fonction *add*
    // Cette fonction retourne un nouveau vecteur qui représente
    // la somme de ce vecteur et de celui passé en paramètre.
    add(other) {
      return new Vector2({
        x: this.x + other.x,
        y: this.y + other.y,
      });
    }

    // ### Fonciton *scale*
    // Cette fonction retourne un nouveau vecteur qui représente
    // le produit de ce vecteur par une valeur scalaire.
    scale(factor) {
      return new Vector2({
        x: this.x * factor,
        y: this.y * factor,
      });
    }
  }

  // ## Classe *Rectangle*
  // Classe pour représenter un rectangle.
  class Rectangle {
    // ### Constructeur de la classe *Rectangle*
    // Le constructeur de cette classe prend en paramètre un
    // objet pouvant définir soit le centre et la taille du
    // rectangle (`x`, `y`, `width` et `height`) ou les côtés
    // de celui-ci (`xMin`, `xMax`, `yMin` et `yMax`).
    constructor(descr) {
      this.xMin = descr.xMin || (descr.x - descr.width / 2);
      this.xMax = descr.xMax || (descr.x + descr.width / 2);
      this.yMin = descr.yMin || (descr.y - descr.height / 2);
      this.yMax = descr.yMax || (descr.y + descr.height / 2);
    }

    // ### Fonction *intersectsWith*
    // Cette fonction retourne *vrai* si ce rectangle et celui
    // passé en paramètre se superposent.
    intersectsWith(other) {
      return !(
        (this.xMin >= other.xMax) ||
        (this.xMax <= other.xMin) ||
        (this.yMin >= other.yMax) ||
        (this.yMax <= other.yMin)
      );
    }
  }

  // # Classes de composants
  //
  // ## Classe *Component*
  // Cette classe est une classe de base pour l'ensemble des
  // composants et implémente les méthodes par défaut.
  class Component {
    // ### Constructeur de la classe *Composant*
    // Le constructeur de cette classe prend en paramètre l'objet
    // propriétaire du composant, et l'assigne au membre `owner`.
    constructor(owner) {
      this.owner = owner;
    }

    // ### Méthode *setup*
    // Cette méthode est appelée pour configurer le composant après
    // que tous les composants d'un objet aient été créés. Cette
    // méthode peut retourner une promesse.
    setup( /*descr*/ ) {

    }

    // ### Méthode *display*
    // La méthode *display* de chaque composant est appelée une fois
    // par itération de la boucle de jeu.
    display() {

    }

    // ### Méthode *update*
    // La méthode *update* de chaque composant est appelée une fois
    // par itération de la boucle de jeu.
    update() {

    }
  }

  // ## Classe *PositionComponent*
  // Ce composant fournit un concept de position à l'objet.
  class PositionComponent extends Component {
    // ### Méthode *setup*
    // Les propriétés `x` et `y` de la description de ce composant
    // initialisent la propriété `position` de cet objet, ainsi
    // qu'une copie de ce vecteur dans la propriété `originalPosition`.
    setup(descr) {
      this.position = new Vector2(descr);
      this.originalPosition = this.position.clone();
    }

    // ### Méthode *reset*
    // Un appel à cette méthode réinitialise la propriété `position`
    // à sa valeur originale.
    reset() {
      this.position = this.originalPosition.clone();
    }
  }

  // ## Classe *TextureComponent*
  // Ce composant permet d'afficher une image centrée selon la
  // position d'un composant *PositionComponent* sur le même objet.
  class TextureComponent extends Component {
    // ### Méthode *setup*
    // Cette méthode charge une image dont le nom est désigné par
    // la propriété `name` de la description. Cette propriété peut
    // être omise, auquel cas il n'y aura tout simplement pas d'image
    // de chargée. Cette méthode retourne une promesse qui se
    // complète lorsque l'image est complètement chargée.
    setup(descr) {
      this.GraphicsAPI = require('graphicsAPI');
      if (!descr.name) {
        return;
      }

      return this.GraphicsAPI.loadImage(descr.name)
        .then((image) => {
          this.image = image;
        });
    }

    // ### Méthode *display*
    // Si il y a une image chargée pour ce composant, on l'affiche
    // à la position du composant *PositionComponent* de l'objet.
    display() {
      const position = this.owner.getComponent('Position').position;
      if (this.image) {
        this.GraphicsAPI.drawCenter(this.image, position.x, position.y);
      }
    }
  }

  // ## Classe *MotionComponent*
  // Cette classe représente le déplacement d'un objet dans un
  // rectangle, selon une vélocité donnée allant en accélérant.
  class MotionComponent extends Component {
    // ### Méthode *setup*
    // Les propriétés `dx` et `dy` de la description de ce composant
    // initialisent la propriété `velocity` de cet objet, ainsi
    // qu'une copie de ce vecteur dans la propriété `originalVelocity`.
    // Les propriétés `minX`, `maxX`, `minY` et `maxY` de la
    // description sont conservées afin de limiter les déplacements.
    setup(descr) {
      this.velocity = new Vector2({
        x: descr.dx,
        y: descr.dy,
      });
      this.originalVelocity = this.velocity.clone();
      this.minX = descr.minX;
      this.maxX = descr.maxX;
      this.minY = descr.minY;
      this.maxY = descr.maxY;
    }

    // ### Méthode *update*
    // La valeur de la propriété `position` du composant *PositionComponent*
    // de l'objet associé est incrémentée par la vélocité de ce composant.
    // Si la nouvelle position dépasse les bornes désirées, on inverse
    // alors le déplacement dans l'axe de cette borne. On considère
    // également une légère accélération à la vélocité horizontale
    // pour des raisons de jouabilité.
    update(dT) {
      const positionComponent = this.owner.getComponent('Position');
      const newPosition = positionComponent.position.add(this.velocity.scale(dT));
      positionComponent.position = newPosition;

      if ((newPosition.y < this.minY) || (newPosition.y > this.maxY)) {
        this.velocity.y *= -1;
      }
      if ((newPosition.x < this.minX) || (newPosition.x > this.maxX)) {
        this.velocity.x *= -1.05;
      }
    }

    // ### Méthode *reset*
    // Un appel à cette méthode réinitialise la propriété `velocity`
    // à sa valeur originale.
    reset() {
      this.velocity = this.originalVelocity.clone();
    }
  }

  // ## Classe *ColliderComponent*
  // Le composant *ColliderComponent* permet d'évaluer les collisions
  // entre l'objet associé et une liste d'objets à vérifier.
  class ColliderComponent extends Component {
    // ### Propriété *area*
    // Cette fonction retourne le rectangle de collision de l'objet
    // en utilisant le composant *PositionComponent* associé.
    get area() {
      const position = this.owner.getComponent('Position').position;
      return new Rectangle({
        x: position.x,
        y: position.y,
        width: this.width,
        height: this.height,
      });
    }

    // ### Propriété *zone*
    // Cette fonction retourne un rectangle de collision de hauteur
    // infini pour usage interne.
    get zone() {
      const area = this.area;
      area.yMin = Number.NEGATIVE_INFINITY;
      area.yMax = Number.POSITIVE_INFINITY;
      return area;
    }

    // ### Méthode *setup*
    // Les propriétés `width` et `height` de l'objet de description
    // représentent les dimensions du rectangle de collision de
    // l'objet, alors que le tableau `obstacles` comprend les noms
    // des objets à évaluer pour tester les collisions. Les objets
    // sont résolus à partir de leur nom et conservés dans le membre
    // local `obstacles`.
    setup(descr) {
      this.width = descr.width;
      this.height = descr.height;
      this.obstacles = [];
      descr.obstacles.forEach((name) => {
        this.obstacles.push(this.owner.findObjectInScene(name));
      });
    }

    // ### Méthode *update*
    // Chaque objet à vérifier pour collision est testé et, si leurs
    // rectangles de collision se superposent, est assigné à la
    // propriété `collision`. On fait de même pour vérifier si les
    // objets sont dans la même zone horizontale, qui est alors
    // associé à la propriété `inZone`. On ne considère ici qu'un
    // seul objet en collision à la fois.
    update() {
      this.collision = null;
      this.inZone = null;
      const area = this.area;

      this.obstacles.forEach((obj) => {
        const otherCollider = obj.getComponent('Collider');
        if (area.intersectsWith(otherCollider.area)) {
          this.collision = obj;
        }
        if (area.intersectsWith(otherCollider.zone)) {
          this.inZone = obj;
        }
      });
    }
  }

  // ## Classe *JoystickComponent*
  // Cette classe permet de déplacer le joueur selon l'entrée
  // de ce dernier.
  class JoystickComponent extends Component {
    // ### Méthode *setup*
    // La description comprend un identifiant `id` pour le joueur,
    // qui correspond au joystick désiré, et un multiplicateur
    // `speed` qui représente l'envergure du déplacement.
    setup(descr) {
      this.id = descr.id;
      this.speed = descr.speed;
      this.InputAPI = require('inputAPI');
    }

    // ### Méthode *update*
    // On va chercher le déplacement désiré depuis le système
    // d'entrées, et on ajoute ce déplacement à la position de
    // l'objet par le composant *PositionComponent*
    update() {
      const dy = this.InputAPI.getAxisY(this.id);
      const position = this.owner.getComponent('Position').position;
      position.y += dy * this.speed;
    }
  }

  // ## Classe *TextureAtlasComponent*
  // Cette classe permet de conserver un répertoire d'images,
  // pouvant être choisi par leur nom.
  class TextureAtlasComponent extends Component {
    // ### Méthode *setup*
    // Cette méthode crée un tableau associatif `atlas` qui fait
    // la correspondance entre des noms et des images, tirées
    // des propriétés de la description. Cette méthode retourne
    // une promesse qui se complète lorsque toutes les images
    // sont chargées.
    setup(descr) {
      const GraphicsAPI = require('graphicsAPI');
      this.atlas = {};
      const promises = [];
      Object.keys(descr).forEach((key) => {
        const p = GraphicsAPI.loadImage(descr[key])
          .then((image) => {
            this.atlas[key] = image;
          });
        promises.push(p);
      });
      return Promise.all(promises);
    }
  }

  // ## Classe *ScoreComponent*
  // Cette classe contient le pointage d'un joueur et met à
  // jour la texture du composant *TextureComponent* lorsque
  // le score change.
  class ScoreComponent extends Component {
    // ### Méthode *setup*
    // Initialise le pointage du joueur selon la propriété `points`
    // de la description.
    setup(descr) {
      this.points = descr.points;
    }

    // ### Méthode *update*
    // Mets à jour la texture du composant *TextureComponent* avec
    // l'image correspondant au score du joueur, tiré de l'atlas
    // du composant *TextureAtlasComponent*.
    update() {
      const textureComponent = this.owner.getComponent('Texture');
      const atlas = this.owner.getComponent('TextureAtlas').atlas;
      textureComponent.image = atlas[this.points];
    }
  }

  // ## Classe *RefereeComponent*
  // Ce composant vérifie le résultat des collisions entre la
  // balle et les joueurs et accorde les points appropriés.
  class RefereeComponent extends Component {
    // ### Méthode *setup*
    // La méthode *setup* conserve les références vers les joueurs
    // et la balle.
    setup(descr) {
      this.players = [];
      descr.players.forEach((name) => {
        this.players.push(this.owner.findObjectInScene(name));
      });
      this.ball = this.owner.findObjectInScene(descr.ball);
    }

    // ### Méthode *update*
    update() {
      // On commence par aller chercher les objets avec lesquel il
      // y a possibilité de collision.
      const ballCollider = this.ball.getComponent('Collider');
      const ballCollision = ballCollider.collision;
      const ballInZone = ballCollider.inZone;

      // Si il y a collision, ça veut dire que le joueur n'a pas
      // raté son coup. Si on n'est pas dans une zone de collision,
      // ça veut dire que la balle n'est pas rendu proche d'une palette.
      // Dans ces deux cas, il n'y a pas eu point. On quitte donc
      // la méthode.
      if (ballCollision || !ballInZone) {
        return;
      }

      // On vérifie pour chaque joueur lequel a raté la balle.
      this.players.forEach((player) => {
        // Si ce joueur n'est pas dans la zone de la balle, ça veut
        // dire qu'il marque un point (ie.: c'est son adversaire qui
        // a raté)
        if (player !== ballInZone) {
          const scoreObject = player.getChild('score');
          const scoreComp = scoreObject.getComponent('Score');
          scoreComp.points++;

          // On termine au 10e point en affichant un message et en
          // réinitialisant les scores.
          if (scoreComp.points > 9) {
            alert('Partie terminée');
            this.players.forEach((p) => {
              p.getChild('score').getComponent('Score').points = 0;
            });
          }
        }

        // Quand il y a point, on remet la balle en jeu à sa position
        // et vélocité initiale.
        this.ball.getComponent('Position').reset();
        this.ball.getComponent('Motion').reset();
      });
    }
  }

  // # Classe *ComponentFactory*
  // Cette classe est le point d'entrée pour créer les composants.
  class ComponentFactory {
    // ## Fonction statique *create*
    // Cette fonction instancie un nouveau composant choisi dans
    // le tableau `componentCreators` depuis son nom.
    static create(type, owner) {
      const comp = new ComponentFactory.componentCreators[type](owner);
      comp.__type = type;
      return comp;
    }
  }

  // ## Attribut statique *componentCreators*
  // Ce tableau associatif fait le lien entre les noms des composants
  // tels qu'utilisés dans le fichier JSON et les classes de
  // composants correspondants.
  ComponentFactory.componentCreators = {
    Position: PositionComponent,
    Texture: TextureComponent,
    Motion: MotionComponent,
    Collider: ColliderComponent,
    Joystick: JoystickComponent,
    TextureAtlas: TextureAtlasComponent,
    Score: ScoreComponent,
    Referee: RefereeComponent,
  };

  return ComponentFactory;
});
