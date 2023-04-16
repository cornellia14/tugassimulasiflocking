class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(6, 4));
    this.acceleration = createVector(); 
    this.maxForce = 0.5;
    this.maxSpeed = 1;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 1;
    } else if (this.position.x < 1) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }
  
  align(boids) { 
    let perceptionRadius = 25;
    let steering = createVector();
    let total = 0; 
  
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity); 
        total++;
      }
    }
    if (total > 0) {
      steering.div(total); 
      steering.setMag(this.maxSpeed); 
      steering.sub(this.velocity); 
      steering.limit(this.maxForce);
    }
    return steering;
  }
  
  //mirip dengan align
  separation(boids) {
    let perceptionRadius = 24;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position); 
        diff.div(d * d); // 1/r^2
        steering.add(diff); // 
        total++;
      }
    }
    //mirip align
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 80;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.sub(this.position); 
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());
    
    
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0); //accelerasionya direset setiap update
  }

  show() {
    strokeWeight(8);
    stroke(255);
    point(this.position.x, this.position.y);
  }
}
const flock = []; 
let alignSlider, cohesionSlider, separationSlider;
let population;
function setup() {
  createCanvas(400, 400);
  //createSlider(min, max, nilai_skrg, jarak antar nilai)
  alignSlider = createSlider(0,1,4,0.4);
  cohesionSlider = createSlider(0,0,0.0,0);
  separationSlider = createSlider(0,0,0,0);
  
  population = 100;
  for (let i=0; i<population;i++){
    flock.push(new Boid());
  }
}

function draw() {
  background(216);
  
  text("tugas slocking simulasi", 10,20)
  
  for (let boid of flock){
    boid.edges();
    boid.flock(flock)
    boid.update();
    boid.show();
  }
}
