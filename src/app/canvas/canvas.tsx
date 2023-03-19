import { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { World } from '../game-objects/world';

/* eslint-disable-next-line */
export interface CanvasProps {}

const CanvasStyled = styled.canvas`
  height: 1000px;
  width: 100%;
  cursor: none;
`;

const Canvas: FC<CanvasProps> = (props) => {
  const [world, setWorld] = useState<World | null>(null);
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
          { id: 'sup_player_765', name: 'Oleksii_Game' }
        );

        setWorld(world);

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
    console.log('player: ', world?.player.name);
    requestAnimationFrame(anim);
  };

  return <CanvasStyled ref={canvasRef}></CanvasStyled>;
};

export default Canvas;
