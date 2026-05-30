import React, { useEffect, useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useTexture, Text } from '@react-three/drei';
import { useGameStore } from './GameLogic';
import * as THREE from 'three';

const Platform = ({ position, args, type = 'platform' }) => {
  const textureUrl = type === 'platform' ? '/textures/grass_platform.png' : '/textures/castle_wall.png';
  const texture = useTexture(textureUrl);

  return (
    <RigidBody type="fixed" position={position} colliders="cuboid">
      <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial 
          map={texture} 
          map-wrapS={THREE.RepeatWrapping} 
          map-wrapT={THREE.RepeatWrapping} 
          map-repeat={[args[0] / 2, args[1] / 2]} 
        />
      </mesh>
    </RigidBody>
  );
};

const QuestionBlock = ({ position, value }) => {
  const { question, isTransitioning, setTransitioning, generateQuestion, incrementScore } = useGameStore();
  const rigidBody = useRef();

  const handleCollision = (e) => {
    if (isTransitioning) return;
    
    // Check if player hits from below (approximate)
    const playerY = e.other.rigidBodyObject?.position.y;
    const blockY = position[1];
    
    if (playerY < blockY - 0.5) {
      setTransitioning(true);
      
      // Basic jump animation via rigid body (since it's kinematicPosition or fixed, we could use a spring, but keeping it simple)
      if (value === question.answer) {
        incrementScore(10);
        // Change color to green for a moment?
        setTimeout(() => {
          generateQuestion();
        }, 600);
      } else {
        incrementScore(-5);
        setTimeout(() => {
          setTransitioning(false);
        }, 400);
      }
    }
  };

  const textureUrl = '/textures/castle_wall.png';
  const texture = useTexture(textureUrl);

  return (
    <RigidBody ref={rigidBody} type="fixed" position={position} colliders="cuboid" onCollisionEnter={handleCollision}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          map={texture} 
          color="#ffc107" 
          map-wrapS={THREE.RepeatWrapping} 
          map-wrapT={THREE.RepeatWrapping} 
        />
        <Text
          position={[0, 0, 0.51]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="black"
        >
          {value}
        </Text>
      </mesh>
    </RigidBody>
  );
};

export const World = () => {
  const { question, generateQuestion } = useGameStore();

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  return (
    <group>
      {/* Ground */}
      <Platform position={[0, -2, 0]} args={[20, 1, 3]} type="platform" />

      {/* Static Platforms */}
      <Platform position={[-5, 0, 0]} args={[4, 0.5, 2]} type="platform" />
      <Platform position={[5, 0, 0]} args={[4, 0.5, 2]} type="platform" />
      <Platform position={[0, 2, 0]} args={[4, 0.5, 2]} type="platform" />
      <Platform position={[-5, 4, 0]} args={[4, 0.5, 2]} type="platform" />
      <Platform position={[5, 4, 0]} args={[4, 0.5, 2]} type="platform" />

      {/* Question Blocks */}
      {question.options.length === 4 && (
        <>
          <QuestionBlock position={[-3, 2, 0]} value={question.options[0]} />
          <QuestionBlock position={[3, 2, 0]} value={question.options[1]} />
          <QuestionBlock position={[-5, 6, 0]} value={question.options[2]} />
          <QuestionBlock position={[5, 6, 0]} value={question.options[3]} />
        </>
      )}

      {/* Background walls / Obstacles */}
      <Platform position={[0, 4, -2]} args={[20, 12, 1]} type="wall" />
    </group>
  );
};
