import app from './app';
import { envVars } from './config/env';
import { seedDatabase } from './utils/seed';

const bootstrap = async () => {
  try {
    // Seed initial data if doesn't exist
    await seedDatabase();

    app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

bootstrap();
