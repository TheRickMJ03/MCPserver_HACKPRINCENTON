
export interface GetProgrammingTipArgs {
  
  topic: string;
}


export interface ProgrammingTipResponse {
  topic: string;
  tip: string;
  example?: string;
}

export interface GenerateRoutineArgs {

  interest: string;
}

export interface GetSmallTipArgs {
  interest: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}