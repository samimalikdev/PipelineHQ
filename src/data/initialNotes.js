export const INITIAL_NOTES = [
  {
    id: 1,
    company: 'Linear',
    role: 'Product Designer',
    location: 'New York, NY',
    status: 'INTERVIEW',
    time: '2h ago',
    preview: 'Discussed the design systems team structure and their focus on accessibility in the next quarter...',
    body: {
      intro: 'Spoke with Sarah from the Design Systems team today. The call was centered around how they manage "atomic" updates across their desktop and web platforms simultaneously.',
      takeaways: [
        'They prioritize performance over flashiness. Every component is audited for render-time and memory footprint before being merged.',
        'The team is currently 12 people, looking to expand to 15 by EOY. The role would specifically handle the "Motion" primitive set.',
        'Sarah mentioned they use a custom-built tool for documentation, moving away from Notion for internal specs.',
      ],
      questions: [
        'How does the hand-off process look for motion-heavy components? Lottie or custom engine?',
        'What are the main KPIs for the design systems team this year? Adoption rate or consistency metrics?',
      ],
      tip: "Linear values autonomy. Don't wait for permission to fix something if you see it's broken during the trial task.",
    },
    updated: 'Oct 14, 2023',
  },
  {
    id: 2,
    company: 'Vercel',
    role: 'Frontend Engineer',
    location: 'Remote',
    status: 'TECHNICAL TEST',
    time: 'Yesterday',
    preview: 'Notes from technical round. Edge functions and middleware patterns were the main focus. Need to review Next.js 14...',
    body: {
      intro: 'Technical screen with two senior engineers. Focus was heavily on edge runtime and server components.',
      takeaways: [
        'Deep knowledge of Next.js App Router is required — expect a live coding exercise.',
        'Edge functions vs serverless was a primary discussion point. Review cold-start tradeoffs.',
      ],
      questions: [
        'What does the typical deployment pipeline look like for a new feature?',
        'How does the team handle rollbacks in production?',
      ],
      tip: 'Vercel engineers love open source contributions. Mention any OSS work.',
    },
    updated: 'Oct 13, 2023',
  },
  {
    id: 3,
    company: 'Stripe',
    role: 'Staff Systems Engineer',
    location: 'San Francisco, CA',
    status: 'APPLIED',
    time: 'Oct 12',
    preview: 'Recruiter call summary. Equity split details and hybrid work model. Team seems very technically focused...',
    body: {
      intro: 'First contact from Stripe recruiter. Initial culture-fit discussion, very high-bar expectations mentioned.',
      takeaways: [
        'Equity refresh every 4 years, significant RSU grant at senior levels.',
        'Hybrid 3 days/week from SF office — no full remote for this role.',
      ],
      questions: [
        'What does the on-call rotation look like for this team?',
        'How are tech leads selected? From IC or separate track?',
      ],
      tip: 'Stripe values precision and rigor. Have concrete examples of debugging complex distributed systems.',
    },
    updated: 'Oct 12, 2023',
  },
  {
    id: 4,
    company: 'Figma',
    role: 'UX Researcher',
    location: 'Remote',
    status: 'OFFER',
    time: 'Oct 10',
    preview: 'Portfolio walkthrough tips. Focus on the "why" behind component library decisions...',
    body: {
      intro: 'Prep notes for the portfolio presentation round. Spoke with an internal referral who gave tips.',
      takeaways: [
        'Lead with the research process, not just the outputs.',
        'Show how your research directly changed a product decision — with data.',
      ],
      questions: [
        'How does research feed into the product roadmap cycle?',
        'What does a typical research sprint look like here?',
      ],
      tip: '"Show the messy middle." They want to see your thinking, not just polished deliverables.',
    },
    updated: 'Oct 10, 2023',
  },
  {
    id: 5,
    company: 'Airbnb',
    role: 'Lead Developer',
    location: 'San Francisco, CA',
    status: 'REJECTED',
    time: 'Oct 08',
    preview: 'Interview prep for the cultural fit round. Research their core values and "host" philosophy...',
    body: {
      intro: 'Prep notes before the final loop. Four back-to-back 45-min sessions.',
      takeaways: [
        'Airbnb culture is deeply tied to the "host" concept — frame every answer through empathy.',
        'Be prepared for an obstacle-focused behavioral round.',
      ],
      questions: [
        'How does the eng team collaborate with Belong Anywhere design principles?',
        'What went well and what would change about a recent major launch?',
      ],
      tip: 'They value stories of cross-functional collaboration — bring 2–3 strong examples.',
    },
    updated: 'Oct 08, 2023',
  },
];
