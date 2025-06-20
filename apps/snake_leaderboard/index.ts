import { Notifier, Ledger } from '@klave/sdk'

@serializable
class SubmitScoreInput {
  player!: string;
  score!: i32;
}

@serializable
class SubmitScoreOutput {
  success!: bool;
}

@serializable
class FetchScoreInput {
  player!: string;
}

@serializable
class FetchScoreOutput {
  success!: bool;
  score!: i32;
}

/**
 * @transaction
 */
export function submitScore(input: SubmitScoreInput): void {
  const table = Ledger.getTable("leaderboard");
  const currentScoreStr = table.get(input.player);
  const currentScore = currentScoreStr.length > 0 ? I32.parseInt(currentScoreStr) : 0;

  if (input.score > currentScore) {
    table.set(input.player, input.score.toString());
  }

  Notifier.sendJson<SubmitScoreOutput>({ success: true });
}

/**
 * @query
 */
export function fetchScore(input: FetchScoreInput): void {
  const table = Ledger.getTable("leaderboard");
  const scoreStr = table.get(input.player);
  const score = scoreStr.length > 0 ? I32.parseInt(scoreStr) : 0;

  Notifier.sendJson<FetchScoreOutput>({
    success: true,
    score
  });
}
