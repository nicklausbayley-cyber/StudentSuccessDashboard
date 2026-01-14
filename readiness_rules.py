from dataclasses import dataclass
from typing import List, Optional

@dataclass
class RuleResult:
    status: str
    score: int
    reasons: List[str]

def compute_readiness(
    attendance_rate: Optional[float],
    growth_percentile: Optional[int],
    credits_earned: Optional[float],
    credits_expected: Optional[float],
) -> RuleResult:
    reasons: List[str] = []
    score = 0
    final = "on_track"

    def bump(new_status: str, points: int, reason: str):
        nonlocal final, score
        order = {"on_track": 0, "watch": 1, "at_risk": 2}
        if order[new_status] > order[final]:
            final = new_status
        score += points
        reasons.append(reason)

    if attendance_rate is not None:
        if attendance_rate < 0.90:
            bump("at_risk", 3, f"Attendance < 90% ({attendance_rate:.0%})")
        elif attendance_rate < 0.94:
            bump("watch", 1, f"Attendance < 94% ({attendance_rate:.0%})")

    if growth_percentile is not None:
        if growth_percentile < 25:
            bump("at_risk", 3, f"Growth percentile < 25 ({growth_percentile})")
        elif growth_percentile < 40:
            bump("watch", 1, f"Growth percentile < 40 ({growth_percentile})")

    if credits_earned is not None and credits_expected is not None and credits_expected > 0:
        if credits_earned + 1e-9 < credits_expected:
            bump("at_risk", 3, f"Credits behind pace ({credits_earned}/{credits_expected})")

    return RuleResult(status=final, score=score, reasons=reasons)
