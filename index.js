const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 824;
canvas.height = 641;

const Player = () => {
  const image = new Image();
  image.src = "./assets/nave.png";

  const sprite = image;
  const width = sprite.width;
  const height = sprite.height;

  let position = {
    x: canvas.width / 2 - width / 10,
    y: canvas.height - height / 2,
  };

  let velocity = {
    x: 0,
    y: 0,
  };

  const draw = () => {
    ctx.save();
    if (sprite)
      ctx.drawImage(
        sprite,
        position.x,
        position.y,
        sprite.width * 0.15,
        sprite.height * 0.15
      );
  };

  const move = () => {
    draw();
    position.x += velocity.x;
    position.y += velocity.y;
  };

  return { width, height, position, velocity, draw, move };
};

const Invader = () => {
  const scale = 1;
  const image = new Image();
  image.src = "./assets/invader.png";

  const sprite = image;
  const width = sprite * scale;
  const height = sprite * scale;

  let position = {
    x: canvas.width / 2 - 20,
    y: canvas.height / 2 - 180,
  };

  let velocity = {
    x: 0,
    y: 0,
  };

  const draw = () => {
    ctx.save();
    if (sprite)
      ctx.drawImage(
        sprite,
        position.x,
        position.y,
        sprite.width * 0.95,
        sprite.height * 0.95
      );
  };

  const move = () => {
    if (sprite) {
      draw();
      position.x += velocity.x;
      position.y += velocity.y;
    }
  };

  return { width, height, position, velocity, draw, move };
};

const Projectile = (position, velocity) => {
  const radius = 3;

  const draw = () => {
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  };

  const update = () => {
    draw();
    position.x += velocity.x;
    position.y += velocity.y;
  };

  return { position, velocity, radius, draw, update };
};

const player = Player();
const projectiles = [];
const invader = Invader();

const keys = {
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
};

const animate = () => {
  requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  invader.move();
  player.draw();
  player.move();

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      projectiles.splice(index, 1);
    } else {
      projectile.update();
    }
  });

  if (keys.left.pressed && player.position.x >= 0) {
    player.velocity.x = -5;
    player.rotation = -0.15;
  } else if (keys.right.pressed && player.position.x <= 750) {
    player.velocity.x = 5;
    player.rotation = 0.15;
  } else {
    player.velocity.x = 0;
  }
};

animate();

addEventListener("keydown", ({ key }) => {
  if (key == "ArrowLeft") {
    keys.left.pressed = true;
  }
  if (key == "ArrowRight") {
    keys.right.pressed = true;
  }
  if (key == " ") {
    projectiles.push(
      Projectile(
        { x: player.position.x + 33, y: player.position.y },
        { x: 0, y: -5 }
      )
    );
  }
});

addEventListener("keyup", ({ key }) => {
  if (key == "ArrowLeft") {
    player.velocity.x = 0;
    keys.left.pressed = false;
  }
  if (key == "ArrowRight") {
    player.velocity.x = 0;
    keys.right.pressed = false;
  }
});
