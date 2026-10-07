export const ASSESSMENT_PASS_RATIO = 2 / 3;

export function assessmentPassMark(total: number) {
  return total > 0 ? Math.ceil(total * ASSESSMENT_PASS_RATIO) : 0;
}

export function hasPassedAssessment(score: number, total: number) {
  return total > 0 && score >= assessmentPassMark(total);
}
