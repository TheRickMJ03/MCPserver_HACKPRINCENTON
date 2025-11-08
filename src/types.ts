
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