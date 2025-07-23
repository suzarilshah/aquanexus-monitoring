import { Client, Account, Databases, Functions, Storage, Query } from 'appwrite';
import { Project, SensorReading, Alert, AIInsight } from '@/store/useStore';

// Appwrite Configuration
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '687f8e78001ac206db80';
const APPWRITE_DATABASE_ID = 'aquanexus-main';
const APPWRITE_API_KEY = import.meta.env.VITE_APPWRITE_API_KEY || 'standard_2c0b3177b1c27be45830633b9bc9142f19d0b0764211810fc449fbdcc4afe39c5bf32a0fc3dc0a468c44ca9ea7883739da70317047e5ada06c75eb294ee820181063c0a75f69262b07cad631f611f22188c50c553d424b92bdfbb4855dc04deb90cae07ec23d2072d30c3dd2541bd70b80d2fc65902303281712593078a7ff6c';

// Appwrite Client
class AppwriteClient {
  private client: Client;
  private account: Account;
  private databases: Databases;
  private functions: Functions;
  private storage: Storage;
  private isServerSide: boolean;

  constructor(serverSide: boolean = false) {
    this.isServerSide = serverSide;
    this.client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID);
    
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.functions = new Functions(this.client);
    this.storage = new Storage(this.client);
  }

  // Authentication methods
  async login(email: string, password: string) {
    try {
      const session = await this.account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, name: string) {
    try {
      const user = await this.account.create('unique()', email, password, name);
      await this.account.createEmailPasswordSession(email, password);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async createDemoAccount(email: string, password: string, name: string) {
    try {
      const user = await this.account.create('unique()', email, password, name);
      await this.account.createEmailPasswordSession(email, password);
      
      const response = await this.functions.createExecution(
        'create-demo-account',
        JSON.stringify({
          userId: user.$id,
          projectId: APPWRITE_PROJECT_ID
        }),
        false
      );
      
      const result = JSON.parse(response.responseBody);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create demo account');
      }
      
      return { user, ...result };
    } catch (error) {
      console.error('Demo account creation error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // AI Processing methods
  async generateAIInsights(deviceMac: string, deviceType: 'fish' | 'plant', timeRange?: string) {
    try {
      const response = await this.functions.createExecution(
        'ai-insights',
        JSON.stringify({
          deviceMac,
          deviceType,
          timeRange
        }),
        false
      );
      
      const result = JSON.parse(response.responseBody);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to generate AI insights');
      }
      
      return result.insights;
    } catch (error) {
      console.error('AI insights error:', error);
      return this.generateFallbackInsights(deviceMac, deviceType, timeRange);
    }
  }

  // Fallback AI insights when cloud function is unavailable
  private async generateFallbackInsights(deviceMac: string, deviceType: 'fish' | 'plant', timeRange?: string) {
    return {
      summary: 'AI insights temporarily unavailable. System is functioning normally.',
      recommendations: [
        'Monitor sensor readings regularly',
        'Check device connectivity',
        'Maintain optimal environmental conditions'
      ],
      trends: {},
      alerts: 0,
      dataPoints: 0
    };
  }

  // Data processing methods
  async processDataImport(file: File, dataType: 'fish' | 'plant') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dataType', dataType);
      
      const response = await this.functions.createExecution(
        'process-data-import',
        JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          dataType
        }),
        false
      );
      
      const result = JSON.parse(response.responseBody);
      return result;
    } catch (error) {
      console.error('Data import error:', error);
      throw error;
    }
  }

  // Sensor data methods
  async getSensorReadings(deviceMac: string, deviceType: 'fish' | 'plant', timeRange?: string) {
    try {
      // Mock implementation for now
      return [];
    } catch (error) {
      console.error('Get sensor readings error:', error);
      return [];
    }
  }
}

// Export singleton instance
export const appwriteClient = new AppwriteClient();
export default appwriteClient;