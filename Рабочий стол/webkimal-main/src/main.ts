import { ResumeData } from './types';
import { renderResume } from './resume-builder';
import { ThemeSwitcher } from './resume-themes';
import { printResume } from './print-utils';

/** Sample / default resume data */
const sampleData: ResumeData = {
  personal: {
    name: 'Almaz Aalmaz',
    title: 'Full-Stack Web Developer',
    email: 'almaz@example.com',
    phone: '+7 (999) 123-4567',
    location: 'Kazan, Russia',
    linkedin: 'linkedin.com/in/almaz',
    github: 'github.com/aalmaz1',
  },
  experience: [
    {
      institution: 'TechCorp',
      role: 'Senior Frontend Engineer',
      period: 'Jan 2022 – Present',
      description: [
        'Led migration of legacy jQuery codebase to TypeScript + React.',
        'Reduced bundle size by 40% through tree-shaking and code splitting.',
        'Mentored a team of 4 junior developers.',
      ],
    },
    {
      institution: 'WebStudio',
      role: 'Web Developer',
      period: 'Jun 2019 – Dec 2021',
      description: [
        'Built responsive e-commerce storefronts for 10+ clients.',
        'Implemented CI/CD pipelines with GitHub Actions.',
      ],
    },
  ],
  education: [
    {
      institution: 'Kazan Federal University',
      role: 'B.Sc. Computer Science',
      period: '2015 – 2019',
      description: [
        'Graduated with honours.',
        'Thesis: "Pretext-Based Layout Engines for the Modern Web".',
      ],
    },
  ],
  skills: [
    { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'SQL'] },
    { category: 'Frameworks', items: ['React', 'Node.js', 'Express', 'Next.js'] },
    { category: 'Tools', items: ['Git', 'Docker', 'GitHub Actions', 'Figma'] },
  ],
};

document.addEventListener('DOMContentLoaded', () => {
  const themeSwitcher = new ThemeSwitcher();

  // Resume container
  const container = document.getElementById('resume-container');
  if (container) {
    renderResume(sampleData, container);
  }

  // Theme buttons
  document.getElementById('btn-classic')?.addEventListener('click', () => {
    themeSwitcher.switchTheme('classic');
  });
  document.getElementById('btn-modern')?.addEventListener('click', () => {
    themeSwitcher.switchTheme('modern');
  });
  document.getElementById('btn-minimal')?.addEventListener('click', () => {
    themeSwitcher.switchTheme('minimal');
  });

  // Print / export button
  document.getElementById('btn-print')?.addEventListener('click', () => {
    printResume();
  });
});
