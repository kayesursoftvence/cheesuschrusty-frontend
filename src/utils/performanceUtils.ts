/* eslint-disable @typescript-eslint/no-explicit-any */

export interface NormalizedFeedback {
    header: {
        level: string;
        skill: string;
        target_language: string;
        primary_language?: string;
        task_id?: string;
        target_flag?: string;
        topic?: string;
        domain?: string;
    };
    score: {
        title: string;
        value: string;
        status: string;
    };
    cefr_profile: {
        title: string;
        details: {
            overall: string;
            comprehension: string;
            accuracy: string;
            range: string;
            [key: string]: string; // Allow dynamic keys
        };
    };
    strengths: {
        title: string;
        points: string[];
    };
    improvements: {
        title: string;
        points: string[];
    };
    readiness: {
        title: string;
        percentage: string;
        message: string;
    } | null;
    power_tip: {
        title: string;
        explanation: string;
        example: string;
    } | null;
    motivational_close: {
        title: string;
        target_language?: string;
        primary_language?: string;
        message?: string | { target_language: string; primary_language: string }; // Handle nested message object
        flag?: string;
        translation?: string;
    } | null;
}

export function normalizePerformanceData(data: any): NormalizedFeedback | null {
    if (!data) return null;

    // 1. Identify where the core feedback object is
    // Case A: data.feedback_card (Flat or with sections)
    // Case B: data.feedback (Flat)
    let root = data?.feedback_card || data?.feedback || {};
    
    // If root.content exists (Case: Nested content), drill down
    if (root?.content) {
        root = { ...root, ...root.content };
    }
    
    // 2. Normalize Sections (Strengths/Improvements)
    // They can be direct properties or inside 'sections'
    // They can be array of strings (points) or array of objects (items)
    const sourceStrengths = root?.sections?.strengths || root?.strengths;
    const sourceImprovements = root?.sections?.improvements || root?.improvements;

    const normalizePoints = (source: any): string[] => {
        if (!source) return [];
        
        // CASE 1: Source is directly an array
        if (Array.isArray(source)) {
            return source.map((item: any) => {
                if (typeof item === 'string') return item;
                if (typeof item === 'object') {
                    // Try to find the text content
                    let text = item.text || item.point || item.step || "";
                    if (item.example && item.example !== "N/A") text += ` (${item.example})`;
                    if (item.correction) text += ` (${item.correction})`;
                    return text;
                }
                return String(item);
            }).filter(Boolean);
        }

        // CASE 2: Source has 'points' array (strings or objects)
        if (Array.isArray(source.points)) {
             return source.points.map((item: any) => {
                if (typeof item === 'string') return item;
                 if (typeof item === 'object') {
                    let text = item.text || item.point || item.step || "";
                    if (item.example) text += ` (${item.example})`;
                    return text;
                }
                return String(item);
            });
        }

        // CASE 3: Source has 'items' array (objects)
        if (Array.isArray(source.items)) {
            return source.items.map((item: any) => {
                // Construct a string from point + example/correction
                let text = item.point || item.text || "";
                if (item.example && item.example !== "N/A") text += ` (${item.example})`;
                if (item.correction) text += ` (${item.correction})`;
                return text;
            });
        }
        return [];
    };

    const strengths = {
        title: sourceStrengths?.title || "Strengths",
        points: normalizePoints(sourceStrengths)
    };

    const improvements = {
        title: sourceImprovements?.title || "Improvements",
        points: normalizePoints(sourceImprovements)
    };

    // 3. Normalize Header
    // Can be at top level data.header or inside root.header
    const normalizeHeader = (h: any) => ({
        level: h?.level || "N/A",
        skill: h?.skill || "Reading",
        target_language: h?.target_language || "Italian",
        primary_language: h?.primary_language,
        task_id: h?.task_id,
        target_flag: h?.target_flag,
        topic: h?.topic,
        domain: h?.domain
    });

    const header = normalizeHeader(data.header || root?.header);

    // 4. Normalize Score
    const sourceScore = root?.sections?.score || root?.score || {};
    const score = {
        title: sourceScore.title || "Score",
        value: sourceScore.value || "0 / 100",
        status: sourceScore.status || ""
    };

    // 5. Normalize CEFR
    const sourceCefr = root?.sections?.cefr_profile || root?.cefr_profile || {};
    // Sometimes details are direct properties of cefr_profile, sometimes in 'ratings' or 'details'
    const cefrDetails = sourceCefr.details || sourceCefr.ratings || sourceCefr;
    const cefr = {
        title: sourceCefr.title || "CEFR Profile",
        details: {
            overall: cefrDetails.overall || "[?]",
            comprehension: cefrDetails.comprehension || "[?]",
            accuracy: cefrDetails.accuracy || "[?]",
            range: cefrDetails.range || "[?]",
             ...cefrDetails // spread other keys if any
        }
    };

    // 6. Normalize Readiness
    const sourceReadiness = root?.sections?.readiness || root?.readiness;
    const readiness = sourceReadiness ? {
        title: sourceReadiness.title || "Readiness",
        percentage: sourceReadiness.percentage || sourceReadiness.value || "0%",
        message: sourceReadiness.message || ""
    } : null;

    // 7. Normalize Power Tip
    const sourceTip = root?.sections?.power_tip || root?.power_tip;
    const power_tip = sourceTip ? {
        title: sourceTip.title || "Power Tip",
        explanation: sourceTip.explanation || sourceTip.tip || "",
        example: sourceTip.example || ""
    } : null;

    // 8. Normalize Motivational Close
    const sourceClose = root?.sections?.motivational_close || root?.motivational_close;
    // Handle nested message object scenario (Format 3)
    let motivational_close = null;
    if (sourceClose) {
         motivational_close = {
            title: sourceClose.title || "Keep going!",
            target_language: sourceClose.target_language,
            primary_language: sourceClose.primary_language,
            message: sourceClose.message,
            flag: sourceClose.flag,
            translation: sourceClose.translation
        };

        // Standardize message content if it is an object
        if (typeof sourceClose.message === 'object' && sourceClose.message !== null) {
            motivational_close.target_language = sourceClose.message.target_language;
            motivational_close.primary_language = sourceClose.message.primary_language;
            // Clear message object to avoid confusion in UI if it expects string
            motivational_close.message = sourceClose.message.target_language; 
        }
    }

    return {
        header,
        score,
        cefr_profile: cefr,
        strengths,
        improvements,
        readiness,
        power_tip,
        motivational_close
    };
}
