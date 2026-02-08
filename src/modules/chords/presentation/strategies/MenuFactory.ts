import { MenuStrategy } from './MenuStrategy';
import { DefaultMenuStrategy } from './DefaultMenuStrategy';
import { FullMenuStrategy } from './FullMenuStrategy';
import { BeatsMenuStrategy } from './BeatsMenuStrategy';

export type MenuType = 'default' | 'full' | 'beats';

export class MenuFactory {
    static createStrategy(type: MenuType): MenuStrategy {
        switch (type) {
            case 'full':
                return new FullMenuStrategy();
            case 'beats':
                return new BeatsMenuStrategy();
            case 'default':
            default:
                return new DefaultMenuStrategy();
        }
    }
}
