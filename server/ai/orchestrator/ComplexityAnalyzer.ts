// ============================================================================
// SARVAGYA AI — COMPLEXITY ANALYZER (`server/ai/orchestrator/ComplexityAnalyzer.ts`)
// Evaluates task depth, multi-step dependencies, and algorithmic complexity (1-10)
// ============================================================================

export interface ComplexityMetrics {
  score: number; // 1 to 10
  tier: "simple" | "moderate" | "advanced" | "frontier";
  factors: {
    lengthFactor: number;
    codeFactor: number;
    mathFactor: number;
    multiStepFactor: number;
  };
  recommendedReasoningEffort: "low" | "medium" | "high" | "xhigh";
}

export class ComplexityAnalyzer {
  public analyze(message: string): ComplexityMetrics {
    const text = message.trim();
    const words = text.split(/\s+/).length;

    let codeScore = 0;
    if (/```|\{|\}|const |function |def |import |class |SELECT |<div/i.test(text)) {
      codeScore += 3;
    }
    if (/debug|refactor|optimize|architecture|memory leak|concurrency|deadlock/i.test(text)) {
      codeScore += 2;
    }

    let mathScore = 0;
    if (/[=+\-*/^√∫∑π]|\b(derivative|integral|eigenvalue|theorem|proof|calculate|solve for)\b/i.test(text)) {
      mathScore += 3;
    }

    let multiStepScore = 0;
    if (/\b(first|then|after that|finally|step 1|step 2|compare and|plan and execute)\b/i.test(text)) {
      multiStepScore += 2;
    }

    // Base score from word count
    let base = 1;
    if (words > 120) base = 4;
    else if (words > 50) base = 3;
    else if (words > 20) base = 2;

    const totalScore = Math.min(10, Math.max(1, base + codeScore + mathScore + multiStepScore));

    let tier: ComplexityMetrics["tier"] = "simple";
    let effort: ComplexityMetrics["recommendedReasoningEffort"] = "low";

    if (totalScore >= 8) {
      tier = "frontier";
      effort = "high";
    } else if (totalScore >= 5) {
      tier = "advanced";
      effort = "medium";
    } else if (totalScore >= 3) {
      tier = "moderate";
      effort = "low";
    }

    return {
      score: totalScore,
      tier,
      factors: {
        lengthFactor: base,
        codeFactor: codeScore,
        mathFactor: mathScore,
        multiStepFactor: multiStepScore,
      },
      recommendedReasoningEffort: effort,
    };
  }
}

export const complexityAnalyzer = new ComplexityAnalyzer();
