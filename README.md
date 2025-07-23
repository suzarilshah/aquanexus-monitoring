# AquaNexus Monitoring System

A comprehensive IoT monitoring and management system for aquaponics environments, featuring real-time data visualization, AI-powered insights, and ESP32 device integration.

## Features

### 🐟 Fish Environment Monitoring
- Real-time water quality tracking (temperature, pH, dissolved oxygen)
- Nitrogen cycle monitoring (ammonia, nitrite, nitrate)
- Fish health indicators and feeding optimization
- Automated alert system for critical parameters

### 🌱 Plant Environment Control
- Growing condition monitoring (temperature, humidity, light)
- Nutrient solution management (pH, EC, NPK levels)
- Growth stage tracking and optimization
- Automated irrigation and lighting control

### 🧠 AI-Powered Analysis
- Predictive analytics for system optimization
- Intelligent recommendations for parameter adjustments
- Performance trend analysis and forecasting
- Energy efficiency optimization suggestions

### 📊 Data Management
- Historical data visualization with interactive charts
- CSV/JSON/Excel data import capabilities
- Real-time WebSocket data streaming
- Comprehensive reporting and export features

### 🔧 ESP32 Integration
- Seamless device onboarding and management
- Real-time sensor data collection
- Remote device monitoring and control
- Automatic device discovery and configuration

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Tailwind CSS + Radix UI
- **State Management**: Zustand
- **Charts**: Recharts
- **Backend**: Appwrite (BaaS)
- **Real-time**: WebSocket connections
- **IoT**: ESP32 microcontrollers
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Appwrite server instance
- ESP32 devices (optional, for hardware integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/suzarilshah/aquanexus-monitoring.git
   cd aquanexus-monitoring
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_APPWRITE_ENDPOINT=https://your-appwrite-endpoint
   VITE_APPWRITE_PROJECT_ID=your-project-id
   VITE_WEBSOCKET_URL=ws://localhost:8080
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open [http://localhost:5173](http://localhost:5173) in your browser

### Demo Account

For quick testing, use the demo login feature:
- Click "Try Demo Account" on the login page
- Explore all features with pre-loaded sample data

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication forms
│   └── ui/             # Base UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and API clients
├── pages/              # Main application pages
├── store/              # Zustand state management
└── assets/             # Static assets
```

## Key Components

### Dashboard
- System overview with key metrics
- Real-time alerts and notifications
- Device status monitoring
- Quick action buttons

### Fish Environment
- Water quality parameter tracking
- Fish health indicators
- Feeding schedule optimization
- Environmental alerts

### Plant Environment
- Growing condition monitoring
- Nutrient solution management
- Growth stage tracking
- Climate control systems

### AI Analysis
- Predictive analytics dashboard
- System optimization recommendations
- Performance trend analysis
- Confidence-based insights

### Data Import
- File upload interface (CSV, JSON, Excel)
- Data validation and mapping
- Historical data integration
- Import statistics and management

## ESP32 Integration

### Device Setup

1. **Flash ESP32 firmware** with AquaNexus sensor code
2. **Configure WiFi credentials** through the web interface
3. **Register device** in the monitoring system
4. **Calibrate sensors** using the built-in calibration tools

### Supported Sensors

- **Water Quality**: pH, temperature, dissolved oxygen, turbidity
- **Environmental**: Air temperature, humidity, light intensity
- **System**: Flow rate, water level, pump status
- **Power**: Battery level, power consumption

## API Integration

### Appwrite Configuration

1. **Create Appwrite project**
2. **Set up authentication** (email/password)
3. **Configure databases** for sensor data and user management
4. **Deploy cloud functions** for data processing

### WebSocket Server

Real-time data streaming requires a WebSocket server:

```javascript
// Basic WebSocket server setup
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  // Handle ESP32 connections
  ws.on('message', (data) => {
    // Process sensor data
    broadcastToClients(data);
  });
});
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Tailwind CSS** for styling

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop `dist` folder
- **Docker**: Use provided Dockerfile
- **Traditional hosting**: Upload `dist` folder contents

### Environment Variables

Ensure these are set in your production environment:

```env
VITE_APPWRITE_ENDPOINT=https://your-production-appwrite
VITE_APPWRITE_PROJECT_ID=your-production-project-id
VITE_WEBSOCKET_URL=wss://your-websocket-server
```

## Monitoring & Analytics

### System Health
- Real-time device status monitoring
- Performance metrics tracking
- Error logging and alerting
- Uptime monitoring

### Data Analytics
- Historical trend analysis
- Predictive modeling
- Performance optimization
- Custom reporting

## Security

### Authentication
- Secure user registration and login
- JWT token-based authentication
- Session management
- Password reset functionality

### Data Protection
- Encrypted data transmission
- Secure API endpoints
- Input validation and sanitization
- CORS configuration

## Troubleshooting

### Common Issues

1. **WebSocket connection failed**
   - Check WebSocket server is running
   - Verify VITE_WEBSOCKET_URL is correct
   - Check firewall settings

2. **Appwrite connection error**
   - Verify Appwrite endpoint and project ID
   - Check network connectivity
   - Ensure proper CORS settings

3. **ESP32 not connecting**
   - Check WiFi credentials
   - Verify device firmware
   - Check sensor connections

### Support

For technical support or questions:
- Create an issue on GitHub
- Check the documentation
- Review existing issues and discussions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React and Vite teams for excellent development tools
- Appwrite for backend-as-a-service platform
- Tailwind CSS for utility-first styling
- Recharts for beautiful data visualization
- Lucide for comprehensive icon library

---

**AquaNexus Monitoring System** - Revolutionizing aquaponics through intelligent IoT monitoring and AI-powered insights.