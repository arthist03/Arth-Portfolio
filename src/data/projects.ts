export type ProjectCategory = 'ALL' | 'MEDICAL AI' | 'COMPUTER VISION' | 'DEEP LEARNING';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  categories: Exclude<ProjectCategory, 'ALL'>[];
  clinicalProblem: string;
  architecture: string[];
  outcomes: string[];
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'ALL',
  'MEDICAL AI',
  'COMPUTER VISION',
  'DEEP LEARNING',
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'preterm-risk',
    title: 'Preterm Pregnancy Risk Prediction',
    description:
      'A clinical risk assessment model evaluating maternal physiological parameters with Random Forest and Support Vector Machine classifiers, incorporating structured feature engineering to identify key risk indicators.',
    image:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=360&fit=crop&auto=format&q=75',
    tags: ['Python', 'Scikit-learn', 'Random Forest', 'SVM'],
    categories: ['MEDICAL AI'],
    clinicalProblem:
      'Early identification of preterm delivery risk helps clinicians schedule timely antenatal interventions in resource-constrained settings.',
    architecture: [
      'Cleaned physiological time-point and demographic clinical features with domain-guided imputation.',
      'Compared ensemble Random Forest trees against RBF-kernel Support Vector Machines under stratified cross-validation.',
      'Extracted feature importance rankings to surface actionable maternal risk predictors for physician review.',
    ],
    outcomes: [
      'Interpretable feature importance scores aligned with clinical obstetric markers',
      'Lightweight inference suitable for point-of-care screening tools',
    ],
  },
  {
    id: 'hand-gesture',
    title: 'Real-Time Hand Gesture Classification',
    description:
      'A computer vision pipeline combining MediaPipe skeletal hand tracking with OpenCV and a convolutional neural network for responsive real-time gesture identification.',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=360&fit=crop&auto=format&q=75',
    tags: ['Python', 'OpenCV', 'MediaPipe', 'CNN'],
    categories: ['COMPUTER VISION', 'DEEP LEARNING'],
    clinicalProblem:
      'Touchless gesture interfaces enable sterile control of medical displays and assistive devices without breaking surgical asepsis.',
    architecture: [
      'Extracted 21 3D hand landmarks per frame using MediaPipe Hands over OpenCV video streams.',
      'Normalized wrist-relative landmark vectors and trained a compact CNN classifier for low-latency inference.',
      'Applied temporal smoothing over sliding frame windows to suppress single-frame jitter.',
    ],
    outcomes: [
      'Low-latency real-time gesture classification on standard webcam hardware',
      'Robust against lighting and background changes via landmark normalization',
    ],
  },
  {
    id: 'customer-churn',
    title: 'Customer Churn Prediction Network',
    description:
      'A deep neural network implemented in TensorFlow for customer retention modeling, featuring categorical feature pipelines, training diagnostic curves, and performance evaluation metrics.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=360&fit=crop&auto=format&q=75',
    tags: ['Python', 'TensorFlow', 'Neural Networks', 'Data Science'],
    link: 'https://github.com/arthist03/Predict-Customer-Churn',
    categories: ['DEEP LEARNING'],
    clinicalProblem:
      'Structured tabular sequence and behavioral churn modeling demonstrates end-to-end deep learning calibration and imbalance handling.',
    architecture: [
      'Built standardized numerical scaling and one-hot categorical encoding pipelines.',
      'Trained a multi-layer TensorFlow/Keras classifier with dropout regularization and early stopping.',
      'Evaluated precision, recall, confusion matrix, and training loss curves.',
    ],
    outcomes: [
      'Reproducible Jupyter training workflow published on GitHub',
      'Well-calibrated probability thresholds for retention prioritization',
    ],
  },
  {
    id: 'eye-care-app',
    title: 'AI-Assisted Ophthalmic Care App',
    description:
      'An Android application built with Kotlin and Firebase integrating TensorFlow Lite on-device models for automated retinal image screening and patient record management.',
    image:
      'https://plus.unsplash.com/premium_photo-1722653260560-f96ad79df08b?w=600&auto=format&fit=crop&q=75',
    tags: ['Kotlin', 'Firebase', 'TensorFlow Lite', 'Medical AI'],
    link: 'https://github.com/arthist03/Eye-Care-For-You',
    categories: ['MEDICAL AI', 'DEEP LEARNING'],
    clinicalProblem:
      'Rural and primary eye-care clinics need offline-capable mobile screening without waiting on cloud GPU servers.',
    architecture: [
      'Quantized convolutional retinal screening weights into TensorFlow Lite for fast on-device mobile execution.',
      'Implemented native Kotlin camera/gallery capture and structured screening history synced to Firebase.',
      'Designed clear patient triage state cards and confidence summaries.',
    ],
    outcomes: [
      'Runs fully offline inference on standard Android smartphones',
      'Combines mobile telemetry sync with point-of-care ophthalmic screening',
    ],
  },
  {
    id: 'magic-ml',
    title: 'Magic ML Model Visualization',
    description:
      'An educational Python dashboard for visualizing machine learning training dynamics, decision surfaces, and evaluation metrics across fundamental algorithms.',
    image:
      'https://images.unsplash.com/photo-1672922310200-fff31138251e?w=600&auto=format&fit=crop&q=75',
    tags: ['Python', 'Machine Learning', 'EDA', 'Visualization'],
    link: 'https://github.com/arthist03/Magic-ML',
    categories: ['DEEP LEARNING'],
    clinicalProblem:
      'Practitioners and students benefit from inspecting hyperparameter sensitivity and decision boundaries interactively rather than treating models as black boxes.',
    architecture: [
      'Modular Python wrappers rendering interactive decision boundary contours and feature distributions.',
      'Side-by-side comparison of linear, kernel, and tree-based classifiers on synthetic and tabular sets.',
    ],
    outcomes: [
      'Open-source interactive exploratory and visual debugging tool',
      'Accelerates intuition around overfitting vs regularization',
    ],
  },
  {
    id: 'engineering-repos',
    title: 'Additional Engineering Repositories',
    description:
      'Explore open-source implementations on GitHub covering biomedical signal analysis, embedded firmware, computer vision, and applied machine learning research.',
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=360&fit=crop&auto=format&q=75',
    tags: ['AI/ML', 'Computer Vision', 'Biomedical Systems', 'Firmware'],
    link: 'https://github.com/arthist03',
    categories: ['MEDICAL AI', 'COMPUTER VISION', 'DEEP LEARNING'],
    clinicalProblem:
      'Continuous prototyping across biosignal filtering, embedded medical electronics, and vision-guided robotics.',
    architecture: [
      'Collection of open-source repositories spanning Python ML, OpenCV, Unity/Vuforia simulation, and Android.',
    ],
    outcomes: [
      '30+ repositories spanning software, AI/ML, and biomedical hardware',
    ],
  },
];

/**
 * O(1) precomputed indices constructed once at module initialization.
 * Avoids repeated linear array scans or regex parsing during UI interactions.
 */
export const CATEGORY_INDEX = new Map<ProjectCategory, ProjectItem[]>();
for (const cat of PROJECT_CATEGORIES) {
  CATEGORY_INDEX.set(
    cat,
    cat === 'ALL' ? PROJECTS : PROJECTS.filter((p) => p.categories.includes(cat))
  );
}

export const TECH_STACK: string[] = [
  'Python',
  'PyTorch',
  'TensorFlow',
  'OpenCV',
  'MediaPipe',
  'Unity & Vuforia',
  'Kotlin',
  'Firebase',
  'React / Vite',
  'Tailwind',
];

export const TECH_TO_CATEGORY = new Map<string, ProjectCategory>([
  ['python', 'ALL'],
  ['pytorch', 'DEEP LEARNING'],
  ['tensorflow', 'DEEP LEARNING'],
  ['opencv', 'COMPUTER VISION'],
  ['mediapipe', 'COMPUTER VISION'],
  ['unity & vuforia', 'COMPUTER VISION'],
  ['kotlin', 'MEDICAL AI'],
  ['firebase', 'MEDICAL AI'],
  ['react / vite', 'ALL'],
  ['tailwind', 'ALL'],
]);

export const TECH_MATCH_IDS = new Map<string, Set<string>>();
for (const tech of TECH_STACK) {
  const key = tech.toLowerCase();
  const ids = new Set<string>();
  for (const project of PROJECTS) {
    const matched = project.tags.some((t) => {
      const tl = t.toLowerCase();
      return tl.includes(key) || key.includes(tl);
    });
    if (matched) ids.add(project.id);
  }
  TECH_MATCH_IDS.set(key, ids);
}

export function getFilteredProjects(
  category: ProjectCategory,
  activeTech: string | null
): ProjectItem[] {
  const base = CATEGORY_INDEX.get(category) ?? PROJECTS;
  if (!activeTech) return base;
  const matchSet = TECH_MATCH_IDS.get(activeTech.toLowerCase());
  if (!matchSet || matchSet.size === 0) return base;
  return base.filter((p) => matchSet.has(p.id));
}
