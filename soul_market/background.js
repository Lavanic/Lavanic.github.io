/* Balatro-style WebGL Background */
/* Adapted from reactbits.dev for vanilla JS */

class BalatroBg {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Background container not found');
            return;
        }

        // Options with defaults
        this.options = {
            spinRotation: options.spinRotation || -2.0,
            spinSpeed: options.spinSpeed || 7.0,
            offset: options.offset || [0.0, 0.0],
            color1: options.color1 || '#A51D2D',
            color2: options.color2 || '#241F31',
            color3: options.color3 || '#000000',
            contrast: options.contrast || 3.5,
            lighting: options.lighting || 0.4,
            spinAmount: options.spinAmount || 0.25,
            pixelFilter: options.pixelFilter || 700.0,
            spinEase: options.spinEase || 1.0,
            isRotate: options.isRotate !== undefined ? options.isRotate : false,
            mouseInteraction: options.mouseInteraction !== undefined ? options.mouseInteraction : true
        };

        this.mouse = [0.5, 0.5];
        this.init();
    }

    hexToVec4(hex) {
        let hexStr = hex.replace('#', '');
        let r = 0, g = 0, b = 0, a = 1;

        if (hexStr.length === 6) {
            r = parseInt(hexStr.slice(0, 2), 16) / 255;
            g = parseInt(hexStr.slice(2, 4), 16) / 255;
            b = parseInt(hexStr.slice(4, 6), 16) / 255;
        } else if (hexStr.length === 8) {
            r = parseInt(hexStr.slice(0, 2), 16) / 255;
            g = parseInt(hexStr.slice(2, 4), 16) / 255;
            b = parseInt(hexStr.slice(4, 6), 16) / 255;
            a = parseInt(hexStr.slice(6, 8), 16) / 255;
        }

        return [r, g, b, a];
    }

    init() {
        // Create renderer
        this.renderer = new OGL.Renderer({
            alpha: false,
            antialias: false
        });

        this.gl = this.renderer.gl;
        this.gl.clearColor(0, 0, 0, 1);

        // Vertex shader
        const vertexShader = `
            attribute vec2 uv;
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 0, 1);
            }
        `;

        // Fragment shader (Balatro effect)
        const fragmentShader = `
            precision highp float;
            #define PI 3.14159265359

            uniform float iTime;
            uniform vec3 iResolution;
            uniform float uSpinRotation;
            uniform float uSpinSpeed;
            uniform vec2 uOffset;
            uniform vec4 uColor1;
            uniform vec4 uColor2;
            uniform vec4 uColor3;
            uniform float uContrast;
            uniform float uLighting;
            uniform float uSpinAmount;
            uniform float uPixelFilter;
            uniform float uSpinEase;
            uniform bool uIsRotate;
            uniform vec2 uMouse;

            varying vec2 vUv;

            vec4 effect(vec2 screenSize, vec2 screen_coords) {
                float pixel_size = length(screenSize.xy) / uPixelFilter;
                vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize.xy) / length(screenSize.xy) - uOffset;
                float uv_len = length(uv);

                float speed = (uSpinRotation * uSpinEase * 0.2);
                if(uIsRotate){
                    speed = iTime * speed;
                }
                speed += 302.2;

                float mouseInfluence = (uMouse.x * 2.0 - 1.0);
                speed += mouseInfluence * 0.1;

                float new_pixel_angle = atan(uv.y, uv.x) + speed - uSpinEase * 20.0 * (uSpinAmount * uv_len + (1.0 - uSpinAmount));
                vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;
                uv = (vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid);

                uv *= 30.0;
                float baseSpeed = iTime * uSpinSpeed;
                speed = baseSpeed + mouseInfluence * 2.0;

                vec2 uv2 = vec2(uv.x + uv.y);

                for(int i = 0; i < 5; i++) {
                    uv2 += sin(max(uv.x, uv.y)) + uv;
                    uv += 0.5 * vec2(
                        cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121),
                        sin(uv2.x - 0.113 * speed)
                    );
                    uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
                }

                float contrast_mod = (0.25 * uContrast + 0.5 * uSpinAmount + 1.2);
                float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * contrast_mod));
                float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
                float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
                float c3p = 1.0 - min(1.0, c1p + c2p);
                float light = (uLighting - 0.2) * max(c1p * 5.0 - 4.0, 0.0) + uLighting * max(c2p * 5.0 - 4.0, 0.0);

                return (0.3 / uContrast) * uColor1 + (1.0 - 0.3 / uContrast) * (uColor1 * c1p + uColor2 * c2p + vec4(c3p * uColor3.rgb, c3p * uColor1.a)) + light;
            }

            void main() {
                vec2 uv = vUv * iResolution.xy;
                gl_FragColor = effect(iResolution.xy, uv);
            }
        `;

        // Create geometry
        this.geometry = new OGL.Triangle(this.gl);

        // Create program with shaders
        this.program = new OGL.Program(this.gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                iTime: { value: 0 },
                iResolution: {
                    value: [this.gl.canvas.width, this.gl.canvas.height, this.gl.canvas.width / this.gl.canvas.height]
                },
                uSpinRotation: { value: this.options.spinRotation },
                uSpinSpeed: { value: this.options.spinSpeed },
                uOffset: { value: this.options.offset },
                uColor1: { value: this.hexToVec4(this.options.color1) },
                uColor2: { value: this.hexToVec4(this.options.color2) },
                uColor3: { value: this.hexToVec4(this.options.color3) },
                uContrast: { value: this.options.contrast },
                uLighting: { value: this.options.lighting },
                uSpinAmount: { value: this.options.spinAmount },
                uPixelFilter: { value: this.options.pixelFilter },
                uSpinEase: { value: this.options.spinEase },
                uIsRotate: { value: this.options.isRotate },
                uMouse: { value: this.mouse }
            }
        });

        // Create mesh
        this.mesh = new OGL.Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program
        });

        // Add canvas to container
        this.container.appendChild(this.gl.canvas);

        // Set up resize handler
        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
        this.resize();

        // Set up mouse handler
        if (this.options.mouseInteraction) {
            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.container.addEventListener('mousemove', this.handleMouseMove);
        }

        // Start animation loop
        this.update = this.update.bind(this);
        this.animationFrameId = requestAnimationFrame(this.update);
    }

    resize() {
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        if (this.program) {
            this.program.uniforms.iResolution.value = [
                this.gl.canvas.width,
                this.gl.canvas.height,
                this.gl.canvas.width / this.gl.canvas.height
            ];
        }
    }

    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;
        this.program.uniforms.uMouse.value = [x, y];
    }

    update(time) {
        this.animationFrameId = requestAnimationFrame(this.update);
        this.program.uniforms.iTime.value = time * 0.001;
        this.renderer.render({ scene: this.mesh });
    }

    show() {
        this.container.style.display = 'block';
    }

    hide() {
        this.container.style.display = 'none';
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        window.removeEventListener('resize', this.resize);
        if (this.options.mouseInteraction) {
            this.container.removeEventListener('mousemove', this.handleMouseMove);
        }
        if (this.gl && this.gl.canvas && this.container.contains(this.gl.canvas)) {
            this.container.removeChild(this.gl.canvas);
        }
        const ext = this.gl?.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
    }
}

// Export for use in game.js
window.BalatroBg = BalatroBg;
