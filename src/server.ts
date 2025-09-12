import App from './app';
import { config } from './config/config';

const PORT = config.PORT || 3001;

// Iniciar aplicación
const app = new App();
app.start(PORT).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});