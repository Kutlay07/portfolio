
export type Project = {
    id: string
    title: string
    category: string
    description: string
    technologies: string[]
    status: 'completed' | 'in-progress' | 'planned'
    github?: string
}

export const projects: Project[] = [
    {
    id: 'kutlang',
    title: 'Kutlang',
    category: 'AI Engineering',
    description:
    'A modular coding agent harness with tool execution, policy enforcement, and audit logging.',
    technologies: ['Python', 'FastAPI', 'pytest'],
    status: 'in-progress',
},
{
    id: 'gpt',
    title: 'GPT from Scratch',
    category: 'Deep Learning',
    description:
    'A decoder-only Transformer language model implemented and trained with PyTorch.',
    technologies: ['PyTorch', 'Transformers', 'Python'],
    status: 'completed',
},
{
    id: 'ml-lab',
    title: 'Applied ML Lab',
    category: 'Data Science',
    description:
    'Hands-on experiments in exploratory data analysis, feature engineering, and machine learning.',
    technologies: ['Pandas', 'Scikit-learn', 'XGBoost'],
    status: 'in-progress',
},
]
