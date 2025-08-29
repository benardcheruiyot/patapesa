import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  username: string;
  phoneNumber: string;
  points: number;
  isActivated?: boolean;
  pendingActivation?: boolean;
  referralCode?: string;
  referredBy?: string;
  hasUsedFreeSpin?: boolean;
  bonusBalance?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  phoneNumber: string;
  password: string;
  referralCode?: string;
}

const USERS_KEY = '@users';
const CURRENT_USER_KEY = '@current_user';
const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

// Mock user storage and authentication
export class AuthService {
  static async updateUserBonusBalance(userId: string, newBonusBalance: number): Promise<void> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].bonusBalance = newBonusBalance;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
      // Update current user
      const currentUser = await this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.bonusBalance = newBonusBalance;
        await this.setCurrentUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to update user bonus balance:', error);
    }
  }
  // Generate a unique referral code
  static generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'PP'; // PataPesa prefix
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const existingUsers = await this.getUsers();
      
      // Check if user already exists
      const userExists = existingUsers.find(
        user => user.username === credentials.username || user.phoneNumber === credentials.phoneNumber
      );
      
      if (userExists) {
        throw new Error('User already exists with this username or phone number');
      }

      let startingPoints = 0;
      let referredByUserId = null;
      let newUserBonusBalance = 0;

      // Check if referral code is provided and valid
      if (credentials.referralCode) {
        const referrerIndex = existingUsers.findIndex(user => user.referralCode === credentials.referralCode);
        if (referrerIndex !== -1) {
          startingPoints = 100; // Bonus points for new user
          referredByUserId = existingUsers[referrerIndex].id;
          existingUsers[referrerIndex].bonusBalance = (existingUsers[referrerIndex].bonusBalance || 0) + 100;
          newUserBonusBalance = 100; // New user also gets 100 referral bonus
          // Persist referrer update
          await AsyncStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));
        }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: credentials.username,
        phoneNumber: credentials.phoneNumber,
        points: startingPoints,
        referralCode: this.generateReferralCode(),
        referredBy: referredByUserId,
        bonusBalance: newUserBonusBalance,
      };

      // Store user credentials (in real app, passwords should be hashed)
      const userCredentials = {
        ...newUser,
        password: credentials.password,
      };

      existingUsers.push(userCredentials);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));

      // Auto login after registration
      await this.setCurrentUser(newUser);

      return newUser;
    } catch (error) {
      throw error;
    }
  }
  
  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      const users = await this.getUsers();
      const user = users.find(
        u => u.username === credentials.username && u.password === credentials.password
      );
      
      if (!user) {
        throw new Error('Invalid username or password');
      }
      
      const userWithoutPassword: User = {
        id: user.id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        points: user.points,
        isActivated: user.isActivated,
      };
      
      await this.setCurrentUser(userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }
  
  static async logout(): Promise<void> {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }
  
  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  }
  
  static async updateUserPoints(userId: string, newPoints: number): Promise<void> {
    try {
      // Update in users storage
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].points = newPoints;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
      
      // Update current user
      const currentUser = await this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.points = newPoints;
        await this.setCurrentUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to update user points:', error);
    }
  }

  static async updateUserSpinStatus(userId: string, hasUsedFreeSpin: boolean): Promise<void> {
    try {
      // Update in users storage
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].hasUsedFreeSpin = hasUsedFreeSpin;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
      
      // Update current user
      const currentUser = await this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.hasUsedFreeSpin = hasUsedFreeSpin;
        await this.setCurrentUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to update user spin status:', error);
    }
  }

  static async activateUser(userId: string): Promise<void> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].isActivated = true;
        users[userIndex].pendingActivation = false;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        // Update current user if it's the same user
        const currentUser = await this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          currentUser.isActivated = true;
          currentUser.pendingActivation = false;
          await this.setCurrentUser(currentUser);
        }
      }
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  }

  static async setPendingActivation(userId: string): Promise<void> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].pendingActivation = true;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        // Update current user if it's the same user
        const currentUser = await this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          currentUser.pendingActivation = true;
          await this.setCurrentUser(currentUser);
        }
      }
    } catch (error) {
      console.error('Failed to set pending activation:', error);
    }
  }

  static async getReferralStats(userId: string): Promise<{ totalReferrals: number; totalEarnings: number; bonusBalance: number }> {
    try {
      const users = await this.getUsers();
      const referrals = users.filter(user => user.referredBy === userId);
      const totalReferrals = referrals.length;
      const totalEarnings = totalReferrals * 100; // KES 100 per referral
      const user = users.find(u => u.id === userId);
      const bonusBalance = user?.bonusBalance || 0;
      return { totalReferrals, totalEarnings, bonusBalance };
    } catch (error) {
      console.error('Failed to get referral stats:', error);
          return { totalReferrals: 0, totalEarnings: 0, bonusBalance: 0 };
    }
  }

  static async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      return completed === 'true';
    } catch (error) {
      return false;
    }
  }

  static async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch (error) {
      console.error('Failed to set onboarding completed:', error);
    }
  }
  
  private static async getUsers(): Promise<any[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      return [];
    }
  }
  
  private static async setCurrentUser(user: User): Promise<void> {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  static async resetPassword(username: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.username === username && u.password === currentPassword);
      
      if (userIndex === -1) {
        return false; // Invalid username or current password
      }
      
      // Update password
      users[userIndex].password = newPassword;
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error('Failed to reset password:', error);
      return false;
    }
  }
}
