import React, { useEffect, useRef } from 'react';

export const FractalBloomCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        const mouse = { x: window.innerWidth / 2, y: window.innerHeight };
        let currentDepth = 0;
        const maxDepth = 9;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawBranch = (x, y, angle, length, depth) => {
            if (depth > currentDepth) return;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            
            const endX = x + Math.cos(angle) * length;
            const endY = y + Math.sin(angle) * length;
            
            ctx.lineTo(endX, endY);
            
            const opacity = 1 - (depth / maxDepth);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
            ctx.lineWidth = 1 - (depth / maxDepth) * 0.5;
            ctx.stroke();

            // Mouse influence on branching angle
            const distToMouse = Math.hypot(endX - mouse.x, endY - mouse.y);
            const mouseEffect = Math.max(0, 1 - distToMouse / (canvas.height / 2));
            const angleOffset = (Math.PI / 8) * mouseEffect;

            drawBranch(endX, endY, angle - (Math.PI / 10) - angleOffset, length * 0.8, depth + 1);
            drawBranch(endX, endY, angle + (Math.PI / 10) + angleOffset, length * 0.8, depth + 1);
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(2, 6, 23, 0.2)'; // Fading effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const startX = canvas.width / 2;
            const startY = canvas.height;
            const startLength = canvas.height / 5;
            
            drawBranch(startX, startY, -Math.PI / 2, startLength, 0);

            if (currentDepth < maxDepth) {
                currentDepth += 0.03;
            }
            
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        
        resizeCanvas();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full bg-[#020617]" />;
};
