import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

const ImageEdit = () => {
    const { index } = useParams();
    const [imageData, setImageData] = useState(null);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [text, setText] = useState('');
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState('#000000');
    const [brushThickness, setBrushThickness] = useState(2);
    const [drawingPaths, setDrawingPaths] = useState([]);
    const img = new Image();
    const [isBrushActive, setIsBrushActive] = useState(true);
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const isAuthorized = storedUser !== null && storedUser.type === 'DOCTOR';
    let navigate = useNavigate();

    const fetchImage = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/images/${index}`);
            setImageData(response.data);
        } catch (error) {
            console.error('Error fetching image data:', error.message);
        }
    };

    useEffect(() => {
        if (!isAuthorized) {
            navigate('/image-upload');
            return;
        }

        fetchImage();
    }, [index], [isAuthorized]);
  
    useEffect(() => {
        const canvas = canvasRef.current;
        contextRef.current = canvas.getContext('2d');
    
        const loadImageAndDraw = () => {
            if (canvas && imageData) {
                // Draw the image only if it's not already drawn
                if (!img.src) {
                    img.onload = () => {
                        contextRef.current.drawImage(img, 0, 0, canvas.width, canvas.height);
    
                        // Draw the existing paths on top of the image
                        drawingPaths.forEach((path) => {
                            contextRef.current.beginPath();
                            if (path.length === 1 && path[0].text) {
                                // Draw text if it's a single point with text information
                                const { x, y, text } = path[0];
                                contextRef.current.font = '20px Arial';
                                contextRef.current.fillStyle = brushColor;
                                contextRef.current.fillText(text, x, y);
                            } else {
                                // Draw lines if it's a path
                                path.forEach(({ x, y }) => {
                                    contextRef.current.lineTo(x, y);
                                });
                                contextRef.current.stroke();
                            }
                        });
                    };
                    img.src = `data:image/jpeg;base64,${imageData.data}`;
                }
            }
        };

        // Load the image initially
        loadImageAndDraw();
  
        // Event listeners for drawing
        const startDrawing = (e) => {
            if (canvas && imageData) {
                
                if (isBrushActive) {
                    setIsDrawing(true);
                    
                    const rect = canvas.getBoundingClientRect();
                    const offsetX = e.clientX - rect.left;
                    const offsetY = e.clientY - rect.top;

                    contextRef.current.beginPath();
                    contextRef.current.moveTo(offsetX, offsetY);
                    //context.beginPath();
                    //context.moveTo(offsetX, offsetY);
                    setDrawingPaths((prevPaths) => [...prevPaths, [{ x: offsetX, y: offsetY }]]);
                } else {
                    const text = prompt('Enter text:');
                    if (text) {
                        const rect = canvas.getBoundingClientRect();
                        const offsetX = e.clientX - rect.left;
                        const offsetY = e.clientY - rect.top;
                        
                        setDrawingPaths((prevPaths) => [...prevPaths, [{ x: offsetX, y: offsetY, text: text }]]);

                        contextRef.current.font = '20px Arial';
                        contextRef.current.fillStyle = brushColor;
                        contextRef.current.fillText(text, offsetX, offsetY);
                    }
                }
            }
        };
  
        const draw = (e) => {
            if (!isDrawing) return;
            //const context = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
    
            setDrawingPaths((prevPaths) => {
            const lastPath = prevPaths[prevPaths.length - 1];
            return [
                ...prevPaths.slice(0, -1),
                [...lastPath, { x: offsetX, y: offsetY }],
            ];
            });
    
            contextRef.current.beginPath();
            contextRef.current.strokeStyle = brushColor;
            contextRef.current.lineWidth = brushThickness;
            drawingPaths[drawingPaths.length - 1].forEach(({ x, y }) => {
                contextRef.current.lineTo(x, y);
            });
            contextRef.current.stroke();
        };
    
        const stopDrawing = () => {
            setIsDrawing(false);
        };
  
        if (canvas) {
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
    
            return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            };
        }
    }, [canvasRef, imageData, isDrawing, drawingPaths, brushColor, brushThickness, isBrushActive]);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const switchToBrushMode = () => {
        setIsBrushActive(true);
    };
  
    const switchToTextMode = () => {
        setIsBrushActive(false);
    };
  
    const handleSave = async () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = `data:image/jpeg;base64,${imageData.data}`;
        img.onload = async () => {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        
            drawingPaths.forEach((path) => {
                context.beginPath();
        
                if (path.length === 1 && path[0].text) {
                
                const { x, y, text } = path[0];
                context.font = '20px Arial';
                context.fillStyle = brushColor;
                context.fillText(text, x, y);
                } else {
                    path.forEach(({ x, y }) => {
                        context.lineTo(x, y);
                    });
            
                    context.strokeStyle = brushColor;
                    context.lineWidth = brushThickness;
                    context.stroke();
                }
            });
      
            const mergedImageData = canvas.toDataURL('image/jpeg');
            
            try {
                const response = await axios.post('http://localhost:3001/saveMergedImage', {
                  imageData: mergedImageData,
                  id: index,
                });
                
            } catch (error) {
                console.error('Error saving image:', error);
                
            }
            navigate('/image-upload');
        };
    };
  
    return (
        <div>
            <h2>Edit Photo</h2>
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                style={{ border: '1px solid black' }}
                onMouseDown={isBrushActive ? null : (e) => e.preventDefault()}
            />
            <div>
                <label>
                Mode:
                </label>
                <button onClick={switchToBrushMode} disabled={isBrushActive}>
                Switch to Brush
                </button>
                <button onClick={switchToTextMode} disabled={!isBrushActive}>
                Switch to Text
                </button>
            </div>
            <div>
                <label>
                Draw Color:
                <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                Brush Thickness:
                <input
                    type="number"
                    value={brushThickness}
                    onChange={(e) => setBrushThickness(parseInt(e.target.value, 10))}
                    min="1"
                    max="10"
                />
                </label>
            </div>
            <button onClick={handleSave}>Save</button>
        </div>
        );
    };
  
  export default ImageEdit;