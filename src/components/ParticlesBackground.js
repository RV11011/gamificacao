import React from 'react';
import Particles from "react-tsparticles";

const ParticlesBackground = () => {
  return (
    <Particles
      options={{
        background: {
          color: "transparent", // Alterado para transparente
        },
        particles: {
          number: {
            value: 50, // Reduzido número de partículas
            density: { enable: true, value_area: 800 }
          },
          color: {
            value: ["#6366f1", "#3b82f6", "#8b5cf6"]
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.3, // Reduzido opacidade
            random: true
          },
          size: {
            value: 3,
            random: { enable: true, minimumValue: 1 }
          },
          links: {
            enable: true,
            distance: 150,
            color: "#4a5568",
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            outModes: "out"
          }
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab"
            },
            onClick: {
              enable: true,
              mode: "push"
            }
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 1
              }
            },
            push: {
              quantity: 4
            }
          }
        }
      }}
    />
  );
};

export default ParticlesBackground;