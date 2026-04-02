
const AVATAR_COLORS = {
  'A': { bg: 'bg-blue-500/20',   text: 'text-blue-400',   border: 'border-blue-500/30' },
  'M': { bg: 'bg-white/10',     text: 'text-white',      border: 'border-white/20' },
  'S': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'E': { bg: 'bg-indigo-500/20',  text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'D': { bg: 'bg-white/10',       text: 'text-white',      border: 'border-white/20' },
  'L': { bg: 'bg-purple-500/20',  text: 'text-purple-400', border: 'border-purple-500/30' },
  'J': { bg: 'bg-orange-500/20',  text: 'text-orange-400', border: 'border-orange-500/30' },
};

export function getAvatarStyle(candidateName) {
  const initial = candidateName ? candidateName.charAt(0).toUpperCase() : 'U';
  return AVATAR_COLORS[initial] ?? { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' };
}

export const INITIAL_APPS = [
  { id: 1, candidate: 'Marcus Sterling', role: 'Senior Frontend Engineer', status: 'Interview',      source: 'LinkedIn',       salary: 'Rs 180k–Rs 220k', date: '2023-10-12', resume: 'https://example.com/resume.pdf', portfolio: 'https://github.com/marcus' },
  { id: 2, candidate: 'Sarah Jenkins',   role: 'Product Designer',         status: 'Technical Test', source: 'Referral',       salary: 'Rs 150k–Rs 175k', date: '2023-10-10', resume: 'https://example.com/sarah-cv', portfolio: 'https://dribbble.com/sarah' },
  { id: 3, candidate: 'David Chen',      role: 'Design Systems Lead',      status: 'Offer',          source: 'Direct Website', salary: 'Rs 200k+',      date: '2023-09-28', resume: '', portfolio: 'https://behance.net/davidchen' },
  { id: 4, candidate: 'Elena Rossi',     role: 'Backend Engineer',         status: 'Rejected',       source: 'LinkedIn',       salary: 'Rs 160k–Rs 190k', date: '2023-09-25', resume: 'https://example.com/elena_cv.pdf', portfolio: '' },
  { id: 5, candidate: 'Liam O\'Connor',  role: 'Senior Product Manager',   status: 'Interview',      source: 'Referral',       salary: 'Rs 170k–Rs 200k', date: '2023-10-24', resume: '', portfolio: '' },
  { id: 6, candidate: 'Aisha Patel',     role: 'Head of Engineering',      status: 'Offer',          source: 'Referral',       salary: 'Rs 190k+',      date: '2023-10-15', resume: 'https://example.com/aisha-patel.pdf', portfolio: 'https://linkedin.com/in/aishapatel' },
];
