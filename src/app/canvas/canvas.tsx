import { FC, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { Player } from '../game-objects/player';
import { World } from '../game-objects/world';

/* eslint-disable-next-line */
export interface CanvasProps {}

const CanvasStyled = styled.canvas`
  display: block;
  height: 100vh;
  width: 100vh;
  margin: 0 auto;
  background: rgb(64, 202, 152);
  cursor: none;
`;

const Canvas: FC<CanvasProps> = (props) => {
  const [world, setWorld] = useState<World | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const world = new World(
          context,
          (canvasRef.current.width = canvasRef.current.clientWidth),
          (canvasRef.current.height = canvasRef.current.clientHeight),
          'Oleksii_Game'
        );

        setWorld(world);
        setPlayer(world.player);

        setIsLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      requestAnimationFrame(anim);
    }
  }, [isLoaded]);

  const anim = (timeStamp: number) => {
    if (player && world) {
      world.updateTimes(timeStamp);
      world.setIsGameStarted();
      world.drawGameBoard();
      world.drawFps();

      world.enemies.forEach((enemy, i) => {
        enemy.updateEnemyState(world.deltaTime, world.isGameStarted);
        enemy.wallsCollisionHandler(world.width, world.height);

        world.headquarters.forEach((head) => {
          enemy.handleCollisionCircleToRect(head.square);
        });

        let obj2 = world.enemies[0];
        for (let j = i + 1; j < world.enemies.length; j++) {
          obj2 = world.enemies[j];

          const isCollidingWithEnemy = World.checkCollisionBetweenCircles(
            enemy,
            obj2
          );

          if (isCollidingWithEnemy) {
            enemy.enemyCollisionHandler(obj2);
          }
        }

        if (!world.isGameOver) {
          const isCollidingWithPlayer = World.checkCollisionBetweenCircles(
            enemy,
            player
          );
          if (isCollidingWithPlayer) {
            world.isGameOver = true;
            enemy.isKiller = true;
          }
        }

        enemy.drawEnemy();
        enemy.updateFrame(timeStamp, world.isGameStarted);
      });

      world.headquarters.forEach((head) => {
        const isColliding = world.enemies.find((en) =>
          World.checkCollisionCircleToRect(en, head.square)
        );

        head.isColliding = !!isColliding;

        head.drawHeadquarters();
      });

      if (!world.isGameOver) {
        player.updatePlayerState(world.deltaTime);
        player.wallsCollisionHandler(world.width, world.height);
      }
      player.drawPlayer();
    }
    requestAnimationFrame(anim);
  };

  const setPlayerDestinationOnMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (player) {
      player.Destination = {
        x: e.clientX - e.currentTarget.offsetLeft,
        y: e.clientY - e.currentTarget.offsetTop,
      };
    }
  };

  return (
    <CanvasStyled
      ref={canvasRef}
      onMouseMove={setPlayerDestinationOnMouseMove}
    ></CanvasStyled>
  );
};

export default Canvas;
