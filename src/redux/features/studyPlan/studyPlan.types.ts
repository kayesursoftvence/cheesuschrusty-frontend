export interface StudyActivities {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
    weeklyGoal?: string;
  }
  
  export interface StudyPlan {
    id: string;
    generatedAt: string;
    activities: StudyActivities;
  }
  
  export interface StudyPlanResponse {
    success: boolean;
    message?: string;
    data: StudyPlan;
  }
  
  export interface CreateOrUpdateStudyPlanRequest {
    activities: StudyActivities;
  }
   