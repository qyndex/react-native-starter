import { Colors } from '../constants/Colors';

describe('Colors', () => {
  it('exports light and dark theme objects', () => {
    expect(Colors).toHaveProperty('light');
    expect(Colors).toHaveProperty('dark');
  });

  it('light theme has all required keys', () => {
    const required = ['text', 'background', 'tint', 'icon', 'tabIconDefault', 'tabIconSelected'];
    for (const key of required) {
      expect(Colors.light).toHaveProperty(key);
    }
  });

  it('dark theme has all required keys', () => {
    const required = ['text', 'background', 'tint', 'icon', 'tabIconDefault', 'tabIconSelected'];
    for (const key of required) {
      expect(Colors.dark).toHaveProperty(key);
    }
  });

  it('light and dark backgrounds differ', () => {
    expect(Colors.light.background).not.toBe(Colors.dark.background);
  });

  it('light and dark text colors differ', () => {
    expect(Colors.light.text).not.toBe(Colors.dark.text);
  });
});
