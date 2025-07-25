export const enum_PresentingConcernLabel = {
    ANXIETY_DISORDERS : 'Anxiety Disorders (including generalized anxiety, social anxiety, panic, and phobias)',
    ADHD : 'Attention-Deficit/Hyperactivity Disorder (ADHD)',
    BIPOLAR_DISORDER : 'Bipolar disorder',
    BPD : 'Borderline Personality Disorder',
    BURNOUT : 'Burn Out',
    EATING_DISORDERS : 'Eating disorders',
    GENDER_DYSPHORIA : 'Gender Dysphoria',
    HEALTH_ISSUES : 'Health related issues (e.g., somatic symptom disorder, illness anxiety)',
    TRAUMA : 'Trauma and related symptoms',
    DEPRESSION : 'Low Mood/Depression',
    OCD : 'Obsessive Compulsive Disorder (OCD)',
    OTHER_PD : 'Personality disorders other than borderline',
    SKIN_HAIR : 'Skin picking and/or hair pulling',
    SLEEP_DISORDERS : 'Sleep-related disorders (e.g., insomnia)',
    SUBSTANCE_USE : 'Substance use disorders',
}

 export const enum_PresentingConcern = {
    ANXIETY_DISORDERS: 'ANXIETY_DISORDERS',
    ADHD: 'ADHD',
    BIPOLAR_DISORDER: 'BIPOLAR_DISORDER',
    BPD: 'BPD',
    BURNOUT: 'BURNOUT',
    EATING_DISORDERS: 'EATING_DISORDERS',
    GENDER_DYSPHORIA: 'GENDER_DYSPHORIA',
    HEALTH_ISSUES: 'HEALTH_ISSUES',
    TRAUMA: 'TRAUMA',
    DEPRESSION: 'DEPRESSION',
    OCD: 'OCD',
    OTHER_PD: 'OTHER_PD',
    SKIN_HAIR: 'SKIN_HAIR',
    SLEEP_DISORDERS: 'SLEEP_DISORDERS',
    SUBSTANCE_USE: 'SUBSTANCE_USE',
} as const;

export type enum_PresentingConcern = typeof enum_PresentingConcern[keyof typeof enum_PresentingConcern];