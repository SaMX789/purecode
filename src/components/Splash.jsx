// src/components/Splash.jsx
import React, { useEffect, useState } from 'react';
import './Splash.css';

const Splash = () => {
  const [porcentaje, setPorcentaje] = useState(0);

  useEffect(() => {
    // Animación fluida para llenar la gota en 2.5 segundos
    const intervalo = setInterval(() => {
      setPorcentaje((prev) => {
        if (prev >= 100) {
          clearInterval(intervalo);
          return 100;
        }
        return prev + 1;
      });
    }, 22); // 22ms * 100 pasos ≈ 2.2 segundos

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="splash-container">
      <div className="gota-wrapper">
        {/* La gota externa que sirve de borde */}
        <div className="gota">
          {/* El agua interna que sube según el porcentaje */}
          <div 
            className="agua" 
            style={{ height: `${porcentaje}%` }}
          ></div>
        </div>
      </div>
      <h2 className="splash-texto">Cargando PureCode...</h2>
    </div>
  );
};

export default Splash;