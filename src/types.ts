/**
 * Arguments for getProgrammingTip tool
 */
export interface GetProgrammingTipArgs {
  /**
   * The programming topic for the tip (e.g., "Python", "React", "Data Structures").
   */
  topic: string;
}

/**
 * A simple structure for our internal "API" response
 */
export interface ProgrammingTipResponse {
  topic: string;
  tip: string;
  example?: string;
}