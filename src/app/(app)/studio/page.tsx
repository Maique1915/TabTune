import { AppProvider } from '@/app/context/app--context';
import { HomePage } from '@/components/studio/home-page';

export default function StudioPage() {
    return (
        <AppProvider>
            <HomePage />
        </AppProvider>
    );
}
