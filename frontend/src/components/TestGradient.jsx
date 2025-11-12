import React, { useEffect, useRef } from 'react';

// Simple test to verify OGL is working
const TestGradient = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log('TestGradient mounted');
    
    // Test 1: Can we import OGL?
    import('ogl').then(OGL => {
      console.log('✅ OGL loaded successfully:', Object.keys(OGL));
      
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('❌ Canvas not found');
        return;
      }

      // Test 2: Can we create a Renderer?
      try {
        const renderer = new OGL.Renderer({
          canvas,
          width: 300,
          height: 300,
          dpr: window.devicePixelRatio || 1,
          alpha: true
        });
        console.log('✅ Renderer created successfully');
        
        const gl = renderer.gl;
        gl.clearColor(1, 0, 1, 1); // Magenta background
        gl.clear(gl.COLOR_BUFFER_BIT);
        console.log('✅ Canvas rendered with magenta color');
        
      } catch (error) {
        console.error('❌ Error creating renderer:', error);
      }
      
    }).catch(error => {
      console.error('❌ Failed to load OGL:', error);
    });
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-white mb-2">OGL Test Canvas (should be magenta):</h3>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={300}
        style={{ border: '2px solid white', display: 'block' }}
      />
    </div>
  );
};

export default TestGradient;
