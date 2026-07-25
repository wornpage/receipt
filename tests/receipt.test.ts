import { describe, it, expect } from 'bun:test';

describe('@wornpage/receipt', () => {
  it('package name is correct', () => {
    const pkg = require('../package.json');
    expect(pkg.name).toBe('@wornpage/receipt');
  });
});
