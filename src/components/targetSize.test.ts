import fs from 'fs';
import path from 'path';

describe('WCAG 2.2 SC 2.5.8 Target Size (Minimum) Compliance Tests', () => {
  it('enforces 24x24px minimum bounding box on tweaks panel close button (.twk-x)', () => {
    const filePath = path.join(__dirname, '../../tweaks-panel.jsx');
    const content = fs.readFileSync(filePath, 'utf8');

    expect(content).toContain('.twk-x');
    expect(content).toContain('min-width:24px');
    expect(content).toContain('min-height:24px');
    expect(content).toContain('display:inline-flex');
    expect(content).toContain('align-items:center');
    expect(content).toContain('justify-content:center');
  });

  it('enforces 24x24px minimum bounding box on design canvas expand button (.dc-expand)', () => {
    const filePath = path.join(__dirname, '../../design-canvas.jsx');
    const content = fs.readFileSync(filePath, 'utf8');

    expect(content).toContain('.dc-expand');
    expect(content).toContain('min-width:24px');
    expect(content).toContain('min-height:24px');
    expect(content).toContain('width:24px');
    expect(content).toContain('height:24px');
    expect(content).toContain('display:flex');
  });

  it('defines shared .k-target-min-size utility class in tokens.css', () => {
    const filePath = path.join(__dirname, '../../tokens.css');
    const content = fs.readFileSync(filePath, 'utf8');

    expect(content).toContain('.k-target-min-size');
    expect(content).toContain('min-width: 24px');
    expect(content).toContain('min-height: 24px');
  });
});
