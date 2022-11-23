import Phaser from 'phaser';
import buildingCoordinates from './buildings.json';
import mapTexture from './assets/map.jpg';
import carTexture from './assets/car.png';


window.Phaser = Phaser;


export class Scene extends Phaser.Scene {

  CAR_X = 800;
  CAR_Y = 340;
  CAR_SIZE = 60;
  CAR_SPEED = 200;
  CAR_MANEUVERABILITY = 200;

  preload = () => {
    this.load.image('map', mapTexture);
    this.load.image('car', carTexture);
  };

  create = () => {
    this.map = this.renderMap();

    this.WIDTH = this.map.displayWidth;
    this.HEIGHT = this.map.displayHeight;

    this.car = this.renderCar(this.CAR_SIZE, this.CAR_X, this.CAR_Y, this.WIDTH, this.HEIGHT);
    this.setupCamera(this.car, this.WIDTH, this.HEIGHT);

    this.buildings = this.renderBuildings(this.car, buildingCoordinates);
    this.cursors = this.input.keyboard.createCursorKeys();

    console.log('-- TestScene create', this);
  };


  update = () => {
    const { car, cameras, cursors, CAR_SPEED, CAR_MANEUVERABILITY } = this;
    this.updateMovementAcceleration(car, cursors, CAR_SPEED);
    this.updateMovementSteering(car, cursors, CAR_MANEUVERABILITY);
    this.updateMovementCamera(car, cameras);
  };


  updateMovementAcceleration = (car, cursors, speed) => {
    if (cursors.up.isDown) {
      this.physics.velocityFromRotation(car.rotation, speed, car.body.velocity);
    }

    if (cursors.down.isDown && car.body.speed) {
      this.tweens.add({
        targets: car.body.velocity,
        props: {
          x: 0,
          y: 0,
        },
        ease: 'Power2',
        duration: 1000,
        yoyo: false,
      });
    }
  };

  updateMovementCamera = (car, cameras) => {
    const cameraZoom = car.body.speed > 50 ? 1 : 1.4;
    cameras.main.zoomTo(cameraZoom, 1000);
  };


  updateMovementSteering = (car, cursors, maneuverability) => {
    car.body.angularVelocity = 0;

    let angularDelta = 1;
    if (cursors.down.isDown) {
      angularDelta = -1;
    }

    if (cursors.left.isDown && car.body.speed) {
      car.body.angularVelocity = maneuverability * -1 * angularDelta;
    }
    else if (cursors.right.isDown && car.body.speed) {
      car.body.angularVelocity = maneuverability * angularDelta;
    }
  };

  setupCamera = (car, areaWidth, areaHeight) => {
    this.cameras.main.setZoom(1);
    this.cameras.main.setBounds(0, 0, areaWidth, areaHeight);
    this.cameras.main.startFollow(car, true, 0.1, 0.1);
  };

  renderMap = () => {
    const map = this.add.image(0, 0, 'map').setScale(0.5);
    map.x = map.displayWidth / 2;
    map.y = map.displayHeight / 2;
    return map;
  };

  renderCar = (size, x, y, areaWidth, areaHeight) => {
    const car = this.physics.add.sprite(x, y, 'car');

    const { width, height } = car.getBounds();
    const ratio = height / width;
    const carTextureHeight = size * ratio;

    car.setDisplaySize(size, carTextureHeight);
    car.setSize(size * 2, size * 2);

    car.setCollideWorldBounds(true);
    car.body.world.setBounds(0, 0, areaWidth, areaHeight);

    car.setDamping(true);
    car.setDrag(0.3);

    return car;
  };

  renderBuildings = (car, coordinates) => {
    const buildings = this.physics.add.staticGroup();

    coordinates.forEach(([ x, y, w, h ]) => {
      const building = this.add.rectangle(x, y, w, h, null, 0);
      buildings.add(building);
    });

    this.physics.add.collider(car, buildings);
    return buildings;
  };
}
