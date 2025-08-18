export interface LearningPlanRes {
  planMonth: number;
  planIdx: number;
  learningGoals: LearningGoalRes[];
}

export interface LearningGoalRes {
  goalIdx: number;
  title: string;
  metric: string;
  targetValue: string;
  priority: number;
  learningTasks: LearningTaskRes[];
}

export interface LearningTaskRes {
  taskIdx: number;
  goalIdx: number;
  taskTitle: string;
  resourceUrl: string;
  weekNo: number;
}
