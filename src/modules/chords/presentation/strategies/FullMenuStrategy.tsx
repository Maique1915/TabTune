import { DefaultMenuStrategy } from './DefaultMenuStrategy';

// Currently FullMenuStrategy behaves identically to DefaultMenuStrategy.
// Extending allows future divergence.
export class FullMenuStrategy extends DefaultMenuStrategy { }
