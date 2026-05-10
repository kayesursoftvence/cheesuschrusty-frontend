export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  proSubscribers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  arpu: number; // Average Revenue Per User
}

export interface UsersOverviewItem {
  month: string;
  totalUsers: number;
  newUsers: number;
}

export interface RecentActivityItem {
  type: 'user' | 'ticket' | 'subscription' | 'content';
  message: string;
  timestamp: string;
}

export interface SubscriptionBreakdown {
  freeUsers: number;
  proSubscribers: number;
  premiumPercentage: number;
}

export interface AdminDashboardResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    stats: UserStats;
    usersOverview: UsersOverviewItem[];
    recentActivity: RecentActivityItem[];
    subscriptionBreakdown: SubscriptionBreakdown;
  };
}

export interface AnalyticsStats {
  dailyActiveUsers: number;
  avgStudyTime: string; // e.g., "50m"
  contentCompletion: string; // e.g., "13.6%"
  userRetention: string; // e.g., "2.9%"
}

export interface DailyUserActivity {
  date: string;
  activeUsers: number;
}

export interface ContentPerformance {
  lesson: string;
  views: number;
}

export interface StudyTimeDistribution {
  date: string;
  minutes: number;
}

export interface LearningProgressByLevel {
  level: string;
  users: number;
}

export interface AdminAnalyticsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    stats: AnalyticsStats;
    dailyUserActivity: DailyUserActivity[];
    contentPerformance: ContentPerformance[];
    studyTimeDistribution: StudyTimeDistribution[];
    learningProgressByLevel: LearningProgressByLevel[];
    keyInsights: string[];
  };
}