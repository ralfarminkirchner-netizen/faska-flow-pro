import { Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';

/**
 * Error boundary to catch R3F / Rapier crashes gracefully.
 */
class PhysicsErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[SwarmOrchestrator] Physics crash caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: '#0a0a1a', color: '#ef4444', fontFamily: 'Outfit, sans-serif',
          flexDirection: 'column', gap: 16, padding: 32
        }}>
          <h2 style={{ fontSize: 24 }}>⚠️ Game Engine Error</h2>
          <p style={{ color: '#94a3b8', maxWidth: 400, textAlign: 'center' }}>
            {this.state.error?.message || 'An unexpected error occurred in the physics engine.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="btn-primary"
          >
            🔄 Restart Game
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Loading spinner shown during Suspense.
 */
function LoadingScreen({ gameName }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#0a0a1a', flexDirection: 'column', gap: 20,
    }}>
      <div style={{
        width: 60, height: 60, border: '3px solid #2a2a5a',
        borderTopColor: '#7c3aed', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{
        color: '#94a3b8', fontFamily: 'Outfit, sans-serif',
        fontSize: 16, letterSpacing: 2,
      }}>
        Loading {gameName || 'Game'}...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/**
 * SwarmOrchestrator — Standard wrapper for all FASKA Flow games.
 * Provides Canvas, Physics, Suspense, and Error Boundary.
 * 
 * Props:
 *   gameName     — Display name for loading screen
 *   gravity      — Physics gravity vector [x, y, z] (default: [0, -9.81, 0])
 *   cameraProps  — Camera configuration
 *   children     — 3D scene content
 *   onReset      — Called when error boundary restarts
 *   canvasProps  — Additional Canvas props
 */
export default function SwarmOrchestrator({
  gameName,
  gravity = [0, -9.81, 0],
  cameraProps = { position: [0, 5, 10], fov: 60 },
  children,
  afterPhysics,
  onReset,
  canvasProps = {},
}) {
  const { style: canvasStyle = {}, ...restCanvasProps } = canvasProps;

  return (
    <div className="swarm-orchestrator" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <PhysicsErrorBoundary onReset={onReset}>
        <Suspense fallback={<LoadingScreen gameName={gameName} />}>
          <Canvas
            shadows
            camera={cameraProps}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              touchAction: 'none',
              background: '#0a0a1a',
              ...canvasStyle,
            }}
            {...restCanvasProps}
          >
            <Physics gravity={gravity} debug={false}>
              {children}
            </Physics>
            {afterPhysics}
          </Canvas>
        </Suspense>
      </PhysicsErrorBoundary>
    </div>
  );
}
