import { ResumeData, TimeBoundedEntity } from './types';

/**
 * The Typographic Layout Engine
 * Simulates a rigid canvas typesetting engine using semantic custom DOM components.
 */
export function renderResume(data: ResumeData, container: HTMLElement): void {
  container.innerHTML = '';

  // --- Header / Personal Details ---
  const header = createPositionedBlock('resume-header');

  const nameLine = createLayoutLine('name-line');
  const nameEl = document.createElement('h1');
  nameEl.textContent = data.personal.name;
  nameLine.appendChild(nameEl);
  header.appendChild(nameLine);

  const titleLine = createLayoutLine('title-line');
  const titleEl = document.createElement('h2');
  titleEl.textContent = data.personal.title;
  titleLine.appendChild(titleEl);
  header.appendChild(titleLine);

  const contactParts: string[] = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
  ];
  if (data.personal?.linkedin) contactParts.push(data.personal.linkedin);
  if (data.personal?.github) contactParts.push(data.personal.github);

  const contactLine = createLayoutLine('contact-line');
  const contactEl = document.createElement('p');
  contactEl.textContent = contactParts.join(' | ');
  contactLine.appendChild(contactEl);
  header.appendChild(contactLine);

  container.appendChild(header);

  // --- Experience ---
  if (data.experience && data.experience.length > 0) {
    container.appendChild(renderSection('Experience', data.experience));
  }

  // --- Education ---
  if (data.education && data.education.length > 0) {
    container.appendChild(renderSection('Education', data.education));
  }

  // --- Skills ---
  if (data.skills && data.skills.length > 0) {
    const skillsBlock = createPositionedBlock('section-block skills-section');
    const heading = document.createElement('h3');
    heading.textContent = 'Skills';
    skillsBlock.appendChild(heading);

    const skillsLine = createLayoutLine('skills-content');

    if (typeof data.skills[0] === 'object' && !Array.isArray(data.skills[0])) {
      const categories = data.skills as { category: string; items: string[] }[];
      categories.forEach((cat) => {
        const catDiv = document.createElement('div');
        catDiv.className = 'skill-category';
        const label = document.createElement('strong');
        label.textContent = cat.category + ': ';
        catDiv.appendChild(label);
        catDiv.appendChild(document.createTextNode(cat.items.join(', ')));
        skillsLine.appendChild(catDiv);
      });
    } else {
      const p = document.createElement('p');
      p.textContent = (data.skills as string[]).join(', ');
      skillsLine.appendChild(p);
    }

    skillsBlock.appendChild(skillsLine);
    container.appendChild(skillsBlock);
  }
}

function renderSection(title: string, items: TimeBoundedEntity[]): HTMLElement {
  const section = createPositionedBlock('section-block');
  const heading = document.createElement('h3');
  heading.textContent = title;
  section.appendChild(heading);

  items.forEach((item) => {
    const itemBlock = createPositionedBlock('entity-item');

    const headerLine = createLayoutLine('entity-header');
    const roleOrg = document.createElement('span');
    roleOrg.className = 'role-org';
    const roleBold = document.createElement('strong');
    roleBold.textContent = item.role;
    const instBold = document.createElement('strong');
    instBold.textContent = item.institution;
    roleOrg.appendChild(roleBold);
    roleOrg.appendChild(document.createTextNode(' at '));
    roleOrg.appendChild(instBold);

    const period = document.createElement('span');
    period.className = 'period';
    period.textContent = item.period;

    headerLine.appendChild(roleOrg);
    headerLine.appendChild(period);
    itemBlock.appendChild(headerLine);

    if (item.description && item.description.length > 0) {
      const ul = document.createElement('ul');
      item.description.forEach((bullet) => {
        const li = document.createElement('li');
        li.textContent = bullet;
        ul.appendChild(li);
      });
      itemBlock.appendChild(ul);
    }

    section.appendChild(itemBlock);
  });

  return section;
}

/** Layout Primitive: PositionedBlock — rigid content bounding box */
function createPositionedBlock(extraClass: string): HTMLElement {
  const el = document.createElement('div');
  el.className = `positioned-block ${extraClass}`;
  return el;
}

/** Layout Primitive: LayoutLine — flexbox baseline-aligned row */
function createLayoutLine(extraClass: string): HTMLElement {
  const el = document.createElement('div');
  el.className = `layout-line ${extraClass}`;
  return el;
}
